# Context: ktncodes.com

Route: `portfolio-site/ktncodes/`

Production portfolio site. Next.js 16 + React 19 + Tailwind v4. Persona-led AI chatbot. Position-addressed memory demo as the signature feature. Deployed at `ktncodes.com` via Vercel.

## What do you want to do?

| Task | Go to | Load first |
|------|-------|------------|
| Edit the home page | `src/app/page.tsx` | `AGENTS.md`, `src/CONTEXT.md` |
| Edit the position-addressed Finder | `src/components/finder/` | `src/components/finder/CONTEXT.md` |
| Edit the AI chatbot | `src/components/chat/` | `src/components/chat/CONTEXT.md` |
| Add or rewrite a project page | `content/projects/<slug>.md` | `content/projects/CONTEXT.md` |
| Edit folder CONTEXT.md content (demo) | `content/contexts/<folder>.md` | `content/contexts/CONTEXT.md` |
| Edit identity / personal data | `portfolio-config.json` | - |
| Style / theme tokens | `src/app/globals.css` | - |
| Add a blog post | `content/posts/<slug>.mdx` | - |

## Stack

| Layer | Tech | Notes |
|-------|------|-------|
| Framework | Next.js 16 (Turbopack) | App Router. `searchParams` is now a Promise. |
| UI | React 19, Tailwind v4 | CSS-first `@theme inline`. No `tailwind.config.ts`. |
| AI | Vercel AI SDK | Gemini primary, OpenAI fallback |
| Content | `next-mdx-remote/rsc`, `gray-matter` | Server-rendered MDX |
| Test | Vitest, Playwright, `@axe-core` | Run `npm test` |
| Deploy | Vercel | Auto-deploys on push to `main` |

## Rules

- Tailwind v4: no `tailwind.config.ts`. Theme tokens live in `src/app/globals.css` under `@theme inline`.
- Dark mode uses theme-aware CSS vars, not Tailwind `dark:` classes.
- Single source of truth for identity = `portfolio-config.json`.
- Project frontmatter `folder:` field controls position-addressed Finder placement.
- Dev-only inline editor requires `npm run dev`. Production routes return 404 for `/api/dev/*`.

## For LLMs

1. Read `AGENTS.md` first for behavioral rules.
2. Read `src/CONTEXT.md` before touching any code.
3. Read the target folder's `CONTEXT.md` before edits.
4. Don't add features beyond what was requested.
