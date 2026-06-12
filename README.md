# ktnCodes

My personal portfolio and engineering blog -- **[ktncodes.com](https://ktncodes.com)**

The homepage is a macOS Finder-style desktop: my workspace rendered as a browsable folder tree, with projects and context files as documents you can open, preview, and read as raw markdown. A terminal-styled AI chatbot (Gemini with OpenAI fallback) answers questions about my work. The rest of the site is a full blog with posts, tags, archives, and search.

## What You'll Find

- **Engineering notes**: C++/Qt, embedded Linux, real-time systems, and the hard bugs that come with them
- **Agentic engineering**: building with AI agents, GitHub Copilot workflows, and AI-assisted development in production
- **Debugging & systems**: SIGSEGV/SIGABRT crash analysis, concurrency defects, log-driven root-cause methodology
- **Tooling & process**: coding standards, onboarding docs, team-wide AI adoption, and repeatable workflows
- **Learning logs**: things I'm studying, synthesizing, and want to remember
- **Build-in-public**: honest reflections on what shipped, what broke, and what I'd do differently

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 + React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| AI | Gemini 2.5 Flash Lite (primary) + OpenAI gpt-4.1-nano (fallback) via AI SDK v6 |
| Blog | MDX + next-mdx-remote + gray-matter |
| Validation | zod schemas on every content loader |
| Tests | vitest (unit) + Playwright (e2e) + Lighthouse CI |
| Deployment | Vercel |

---

## Features

- **Finder homepage** -- a macOS desktop metaphor with a browsable workspace tree, URL-addressable state (`?open=shipped/ideaverse-os`), preview/source toggle, and a dedicated mobile Files-style UI
- **Terminal AI chat** -- streaming chat with 6 tools (Presentation, Projects, Skills, Resume, Contact, Blog Posts), rate-limited and capped server-side
- **Full blog** -- MDX posts with syntax highlighting, reading time, tags, archives, and search
- **Dev-mode inline editing** -- run `npm run dev` and click any hero/about/experience text to edit it in the browser; writes go back to the source file (prod returns 404)
- **Dark/light mode** -- persisted with next-themes; dark mode swaps the hero thesis
- **Responsive** -- dedicated mobile Finder instead of a squeezed desktop

---

## How to update this site

The three common updates are all single-file edits:

**Add a project** -- create `content/projects/<slug>.md`:

```yaml
---
slug: my-project
name: My Project
folder: shipped        # which Finder folder it appears in
tagline: One-line description
status: active         # planned | in-progress | active | released | archived
tech: [TypeScript, Next.js]
github: https://github.com/ktnCodes/my-project
order: 3
---
Body markdown shown in the Finder preview.
```

The Finder tree, chat `getProjects` tool, and system prompt all pick it up automatically. Only if you need a brand-new Finder folder: also edit `content/tree.json` and add `content/contexts/<slug>.md`.

**Add a blog post** -- create `content/posts/<slug>.mdx` with `title`, `date`, `tags`, `summary` frontmatter. Index, tags, archives, search, sitemap, and the chat tools all derive from it. No code changes.

**Update text / experience** -- `npm run dev`, then click-edit hero/about/experience text directly in the browser (dev-mode inline editor), or edit `portfolio-config.json` by hand. The resume PDF at `public/resume.pdf` is built by a separate pipeline -- remember to replace it when experience changes.

All content is validated with zod at load time -- a typo'd frontmatter key fails the build with a field-level error instead of silently publishing a broken page.

---

## Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/ktnCodes/ktnCodes.git
cd ktnCodes

# 2. Install dependencies
npm install

# 3. Add environment variables
cp .env.example .env.local
# GOOGLE_GENERATIVE_AI_API_KEY=...   # primary chat provider (free at aistudio.google.com)
# OPENAI_API_KEY=...                 # fallback provider (optional but recommended)
# NEXT_PUBLIC_CONTACT_EMAIL=...      # contact email (kept out of committed source)
# DISABLE_GOOGLE=true                # optional: skip Gemini entirely (e.g. quota exhausted)

# 4. Run dev server
npm run dev
```

```bash
npm test        # vitest unit tests
npm run e2e     # Playwright end-to-end tests
npm run lint    # eslint
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage (Finder desktop + sections)
│   ├── posts/                # Blog posts + [slug]
│   ├── tags/                 # Tag index + [tag] filter
│   ├── archives/             # Chronological archive
│   ├── search/               # Client-side search (?q= deep-linkable)
│   ├── ideaverse-os/         # ideaverse-os.ktncodes.com marketing surface
│   └── api/
│       ├── chat/             # Streaming chat route + 6 tools (rate-limited)
│       ├── posts/            # Post metadata for client search
│       └── dev/save/         # Dev-mode inline editor write-back (prod: 404)
├── components/
│   ├── finder/               # FinderWindow, MobileFinder, Dock, MenuBar, MailModal
│   ├── chat/                 # TerminalChat, chat-context, tool-renderer
│   ├── tools/                # Tool result cards (projects, skills, resume, ...)
│   ├── sections/             # About / TechStack / Experience / Beliefs / Contact
│   ├── hero/                 # BrandBand + Memoji
│   ├── fx/                   # PixelCanvas, SpotlightCard, ShowcaseCard, MetalWrap
│   ├── posts/                # Blog post components (card, header, MDX, TOC)
│   ├── nav/                  # FloatingPill, Wordmark, StickyMemoji
│   └── dev/                  # Dev-mode inline editing (EditableText, EditableImage)
├── lib/
│   ├── tree.ts               # Finder workspace tree from content/
│   ├── projects.ts           # content/projects/*.md loader
│   ├── posts.ts              # content/posts/*.mdx loader
│   ├── config.ts             # portfolio-config.json loader (+ legacy shape adapter)
│   ├── content-schemas.ts    # zod schemas for all content loaders
│   └── rate-limit.ts         # in-memory per-IP limiter for /api/chat
content/
├── projects/                 # One .md per project (auto-discovered)
├── posts/                    # MDX blog posts
├── contexts/                 # Finder CONTEXT.md leaves
├── tree.json                 # Finder folder structure
└── hero.json / about.json / beliefs.json
portfolio-config.json         # Identity, experience, skills, chatbot persona
```

Each `src/` folder has a `CONTEXT.md` with routing notes -- read those first when changing code.

---

## Deploying Your Own Fork

1. Fork this repo
2. Connect to [Vercel](https://vercel.com) via GitHub
3. Add `GOOGLE_GENERATIVE_AI_API_KEY` (and optionally `OPENAI_API_KEY`, `NEXT_PUBLIC_CONTACT_EMAIL`) in Vercel environment variables
4. Deploy -- Vercel auto-deploys on every push to `main`

---

## Author

**Kevin Trinh Nguyen**
Software Engineer -- Embedded Systems & AI/Agentic Engineering

- GitHub: [@ktnCodes](https://github.com/ktnCodes)
- LinkedIn: [itskevtrinh](https://linkedin.com/in/itskevtrinh)
