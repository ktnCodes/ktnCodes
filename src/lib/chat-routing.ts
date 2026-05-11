// Pre-LLM routing helpers for the chat API. Detect specific user intents so we
// can force tool calls when the model would otherwise skip them. Kept separate
// from `src/app/api/chat/route.ts` so it can be unit-tested without spinning
// up the full Next.js route handler.

import type { UIMessage } from "ai";

export function lastUserText(messages: UIMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return "";
  return lastUser.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join(" ")
    .toLowerCase();
}

// Word-boundary matches so "presume" or "curiosum vita" don't false-trigger.
const RESUME_PATTERN = /\b(resume|cv|work history|curriculum vitae)\b/;

export function isResumeQuery(messages: UIMessage[]): boolean {
  const text = lastUserText(messages);
  if (!text) return false;
  return RESUME_PATTERN.test(text);
}
