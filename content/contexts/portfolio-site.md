# Context: 50-portfolio-site

Route: `50-portfolio-site/`

This site (`ktncodes.com`) plus the blog at `/posts`. Meta-loop: the very thing you're looking at IS the portfolio.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (Turbopack) |
| UI | React 19, Tailwind v4 |
| AI | Vercel AI SDK, Gemini primary, OpenAI fallback |
| Content | `next-mdx-remote/rsc`, `gray-matter` |
| Testing | Vitest (unit), Playwright (e2e), `@axe-core` (a11y) |

## Key Files

| Path | Purpose |
|------|---------|
| `src/app/page.tsx` | Home route, server-side MDX render |
| `src/components/finder/` | Position-addressed memory demo |
| `src/components/chat/` | Persona-led AI chatbot |
| `content/projects/` | Project markdown sources |
| `content/contexts/` | Per-folder `CONTEXT.md` library (this content) |
| `portfolio-config.json` | Single source of truth for identity and personal data |

## For LLMs

1. Tailwind v4 = CSS-first `@theme inline`. No `tailwind.config.ts` file.
2. Next.js 16: `searchParams` is now a Promise.
3. Dark mode is theme-aware CSS vars, not Tailwind `dark:` classes.
