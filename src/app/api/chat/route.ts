import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { streamText, stepCountIs, convertToModelMessages, APICallError } from "ai";
import type { UIMessage } from "ai";
import { z } from "zod";
import { generateSystemPrompt } from "./prompt";
import { getConfig } from "@/lib/config";
import { getAllPostMeta, getPostBySlug } from "@/lib/posts";
import { isResumeQuery } from "@/lib/chat-routing";
import { rateLimit } from "@/lib/rate-limit";

// Abuse guards for a public, unauthenticated endpoint fronting paid providers.
// The client trims history too, but client-side limits don't count.
const MAX_MESSAGES = 40;
const MAX_BODY_CHARS = 32_000;
const MAX_OUTPUT_TOKENS = 1000;

function jsonError(message: string, status: number, headers?: HeadersInit) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

// Persists for the lifetime of the server instance.
// Once Google hits its quota, all subsequent requests in this session use OpenAI.
// On Vercel (stateless), set DISABLE_GOOGLE=true in env vars to skip Google entirely.
let googleExhausted = false;

function shouldUseGoogle(): boolean {
  if (process.env.DISABLE_GOOGLE === "true") return false;
  if (googleExhausted) return false;
  return !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
}

function isQuotaError(error: unknown): boolean {
  // Prefer the structured status code over message sniffing.
  if (APICallError.isInstance(error) && error.statusCode === 429) return true;
  const msg = error instanceof Error ? error.message : String(error);
  return msg.includes("quota") || msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED");
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";
    if (!rateLimit(`chat:${ip}`)) {
      return jsonError("Too many requests. Try again in a few minutes.", 429, {
        "Retry-After": "300",
      });
    }

    const raw = await req.text();
    if (raw.length > MAX_BODY_CHARS) {
      return jsonError("Conversation too long.", 413);
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return jsonError("Invalid JSON.", 400);
    }
    const maybeMessages = (parsed as { messages?: unknown })?.messages;
    if (
      !Array.isArray(maybeMessages) ||
      maybeMessages.length === 0 ||
      maybeMessages.length > MAX_MESSAGES
    ) {
      return jsonError("Bad request.", 400);
    }
    const messages = maybeMessages as UIMessage[];

    const config = getConfig();
    const allPosts = getAllPostMeta();

    const forceResumeTool = isResumeQuery(messages);

    const sharedParams = {
      system: generateSystemPrompt(),
      messages: await convertToModelMessages(messages),
      stopWhen: stepCountIs(3),
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      // Force getResume on step 0 only. On subsequent steps, fall back to auto
      // so the model generates the text reply using the tool result. Without
      // this, toolChoice applies to every step and the model loops calling
      // getResume until it hits the step cap (3 tool calls, zero text).
      ...(forceResumeTool && {
        prepareStep: ({ stepNumber }: { stepNumber: number }) => {
          if (stepNumber === 0) {
            return {
              toolChoice: {
                type: "tool" as const,
                toolName: "getResume" as const,
              },
            };
          }
          return undefined;
        },
      }),
      tools: {
        getPresentation: {
          description:
            "Show Kevin's introduction, bio, education, and background. Use when someone asks 'tell me about yourself' or wants an overview.",
          inputSchema: z.object({}),
          execute: async () => ({
            personal: config.personal,
            education: config.education,
          }),
        },
        getProjects: {
          description:
            "Show Kevin's portfolio projects. Use when someone asks about projects, what he's built, or his work.",
          inputSchema: z.object({}),
          execute: async () => ({
            projects: config.projects,
          }),
        },
        getSkills: {
          description:
            "Show Kevin's technical skills by category. Use when someone asks about his tech stack, skills, or what technologies he uses.",
          inputSchema: z.object({}),
          execute: async () => ({
            skills: config.skills,
          }),
        },
        getResume: {
          description:
            "Show Kevin's work experience and resume download link. Use when someone asks about his experience, career, resume, or work history.",
          inputSchema: z.object({}),
          execute: async () => ({
            experience: config.experience,
            education: config.education,
            resumeUrl: "/api/resume",
          }),
        },
        getContact: {
          description:
            "Show Kevin's contact information and social links. Use when someone asks how to reach him or for contact info.",
          inputSchema: z.object({}),
          execute: async () => ({
            email: config.personal.email,
            social: config.social,
          }),
        },
        getBlogPosts: {
          description:
            "Search and show Kevin's blog posts by topic. Use when someone asks about topics he's written about, his blog, articles, or writing.",
          inputSchema: z.object({
            topic: z
              .string()
              .optional()
              .describe(
                "Optional topic to filter posts by. Matches against title, tags, and summary."
              ),
          }),
          execute: async ({ topic }: { topic?: string }) => {
            if (!topic) {
              return { posts: allPosts.slice(0, 5), query: "recent" };
            }
            const q = topic.toLowerCase();
            const matches = allPosts.filter(
              (post) =>
                post.title.toLowerCase().includes(q) ||
                post.summary.toLowerCase().includes(q) ||
                post.tags.some((tag) => tag.toLowerCase().includes(q))
            );
            return {
              posts: matches.length > 0 ? matches : allPosts.slice(0, 3),
              query: topic,
            };
          },
        },
        getPostContent: {
          description:
            "Read the full content of one or more blog posts by slug. Use when someone asks about what Kevin wrote in a specific post, wants details from an article, or when you need to accurately answer a question using post content. Call getBlogPosts first to discover slugs, then call this to read the actual post bodies.",
          inputSchema: z.object({
            slugs: z
              .array(z.string())
              .describe("One or more post slugs to fetch full content for."),
          }),
          execute: async ({ slugs }: { slugs: string[] }) => {
            const results = slugs.map((slug: string) => {
              const post = getPostBySlug(slug);
              if (!post) return { slug, error: "Post not found" };
              return {
                slug: post.slug,
                title: post.title,
                date: post.date,
                tags: post.tags,
                summary: post.summary,
                content: post.content,
              };
            });
            return { posts: results };
          },
        },
      },
    };

    // Try Google first; if it throws synchronously (quota at connection level),
    // fall through and retry with OpenAI on the same request.
    if (shouldUseGoogle()) {
      try {
        const result = streamText({
          model: google("gemini-2.5-flash-lite"),
          ...sharedParams,
        });
        return result.toUIMessageStreamResponse({
          onError: (error) => {
            if (isQuotaError(error)) {
              googleExhausted = true;
              console.error("[chat] Google quota exhausted (mid-stream). Set DISABLE_GOOGLE=true in Vercel env vars.");
            } else {
              console.error("[chat] Google stream error:", error);
            }
            return "error";
          },
        });
      } catch (error) {
        if (isQuotaError(error)) {
          googleExhausted = true;
          console.error("[chat] Google quota exhausted (sync). Falling back to OpenAI.");
          // Fall through to OpenAI below
        } else {
          console.error("[chat] Google unexpected error:", error);
          throw error;
        }
      }
    }

    // OpenAI fallback
    console.log("[chat] Using OpenAI gpt-4.1-nano");
    const result = streamText({
      model: openai("gpt-4.1-nano"),
      ...sharedParams,
    });
    return result.toUIMessageStreamResponse({
      onError: (error) => {
        console.error("[chat] OpenAI stream error:", error);
        return "error";
      },
    });
  } catch (error) {
    // Log the detail server-side; never leak internals to the client.
    console.error("[chat] Unhandled error:", error);
    return jsonError("Something went wrong. Please try again.", 500);
  }
}
