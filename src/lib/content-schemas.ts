import { z } from "zod";

/**
 * Runtime validation for the content layer. Content files (portfolio-config,
 * project/post frontmatter) are the primary edit surface of this site -- a
 * typo'd key should fail loudly at build/request time, not silently publish
 * a broken page. Parsed at each loader boundary (config.ts, projects.ts,
 * posts.ts).
 */

export const ProjectFrontmatterSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  folder: z.string().min(1),
  tagline: z.string().optional(),
  status: z
    .enum(["planned", "in-progress", "active", "released", "archived"])
    .optional(),
  tech: z.array(z.string()).optional(),
  github: z.string().nullable().optional(),
  demo: z.string().nullable().optional(),
  started: z.string().optional(),
  order: z.number().optional(),
  icon: z.string().optional(),
  featured: z.boolean().optional(),
  screenshot: z.string().optional(),
  cover_color: z.string().optional(),
  category: z.string().optional(),
});

export const PostFrontmatterSchema = z.object({
  title: z.string().min(1),
  // gray-matter parses unquoted YAML dates (date: 2026-01-05) into JS Date
  // objects; quoted ones stay strings. Accept both, normalize to YYYY-MM-DD.
  date: z
    .union([z.string().min(1), z.date()])
    .transform((d) => (d instanceof Date ? d.toISOString().slice(0, 10) : d)),
  tags: z.array(z.string()).default([]),
  summary: z.string().default(""),
  showToc: z.boolean().default(false),
});

export const PortfolioConfigSchema = z.object({
  personal: z.object({
    name: z.string().min(1),
    title: z.string().min(1),
    // Empty by policy: the address lives in NEXT_PUBLIC_CONTACT_EMAIL.
    email: z.string(),
    location: z.string(),
    bio: z.string(),
    avatar: z.string(),
  }),
  education: z.object({
    degree: z.string(),
    institution: z.string(),
    graduationDate: z.string(),
    highlights: z.array(z.string()),
  }),
  experience: z.array(
    z.object({
      company: z.string().min(1),
      position: z.string().min(1),
      link: z.string().optional(),
      linkLabel: z.string().optional(),
      location: z.string(),
      duration: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
      highlights: z.array(z.string()).optional(),
      impact_tag: z.string().optional(),
    })
  ),
  skills: z.record(z.string(), z.array(z.string())),
  social: z.object({
    github: z.string(),
    linkedin: z.string(),
  }),
  personality: z.object({
    traits: z.array(z.string()),
    interests: z.array(z.string()),
    workingStyle: z.string(),
  }),
  chatbot: z.object({
    name: z.string(),
    personality: z.string(),
    tone: z.string(),
    topics: z.array(z.string()),
  }),
  personal_life: z.object({
    cats: z.array(z.object({ name: z.string(), description: z.string() })),
    relationship: z.string(),
    hobbies: z.array(z.string()),
    gaming: z.object({
      competitive: z.array(z.string()),
      casual: z.array(z.string()),
    }),
    off_limits: z.array(z.string()),
  }),
  presetQuestions: z.array(z.object({ label: z.string(), tool: z.string() })),
});

export const HeroContentSchema = z.object({
  eyebrow: z.string().min(1),
  headline: z.string().min(1),
  subline: z.string().min(1),
  chips: z.array(z.string().min(1)),
});

export const CapabilitiesFileSchema = z.object({
  items: z
    .array(
      z.object({
        num: z.string().min(1),
        name: z.string().min(1),
        blurb: z.string().min(1),
      })
    )
    .min(1),
});

export const CaseStudiesFileSchema = z.object({
  items: z
    .array(
      z.object({
        slug: z.string().min(1),
        title: z.string().min(1),
        org: z.string().min(1),
        problem: z.string().min(1),
        system: z.string().min(1),
        outcome: z.string().min(1),
        metrics: z.array(z.string().min(1)),
        link: z
          .object({ label: z.string().min(1), href: z.string().min(1) })
          .optional(),
      })
    )
    .min(1),
});

export const ResumeSchema = z.object({
  basics: z.object({
    name: z.string().min(1),
    label: z.string(),
    email: z.string(),
    phone: z.string(),
    url: z.string(),
    summary: z.string(),
    location: z.object({ city: z.string(), region: z.string(), countryCode: z.string() }).optional(),
    profiles: z.array(z.object({ network: z.string(), username: z.string(), url: z.string() })).optional(),
  }),
  skills: z.array(z.object({ name: z.string(), keywords: z.array(z.string()) })),
  work: z.array(z.object({
    name: z.string(),
    position: z.string(),
    location: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    highlights: z.array(z.string()),
  })),
  projects: z.array(z.object({
    name: z.string(),
    url: z.string().optional(),
    highlights: z.array(z.string()),
  })),
  education: z.array(z.object({
    institution: z.string(),
    studyType: z.string(),
    area: z.string(),
    endDate: z.string(),
  })),
});

export type ResumeData = z.infer<typeof ResumeSchema>;

/** Format a ZodError into a one-line, file-prefixed message. */
export function formatContentError(
  file: string,
  error: z.ZodError
): string {
  const issues = error.issues
    .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("; ");
  return `${file}: invalid content -- ${issues}`;
}
