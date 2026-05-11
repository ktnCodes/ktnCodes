# ktnCodes

My personal portfolio and engineering blog — **[ktncodes.com](https://ktncodes.com)**

The homepage is an AI chatbot powered by Google Gemini. Ask it anything about my work: projects, experience, skills, or blog posts. The rest of the site is a full blog with posts, tags, archives, and search.


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
| Styling | Tailwind CSS 4 (dark slate + cyan) |
| AI | Google Gemini 2.5 Flash Lite via AI SDK v6 |
| Blog | MDX + next-mdx-remote + gray-matter |
| Deployment | Vercel |

---

## Features

- **AI Chatbot homepage** — Gemini-powered chat that answers questions about my work and surfaces blog posts as rich UI cards
- **6 chat tools** — Presentation, Projects, Skills, Resume, Contact, Blog Posts
- **Full blog** — 11 MDX posts with syntax highlighting, reading time, tags, and table of contents
- **Posts / Tags / Archives / Search** — complete blog navigation
- **Dark/light mode** — persisted with next-themes
- **Responsive** — mobile-first layout

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
# Open .env.local and add your key:
# GOOGLE_GENERATIVE_AI_API_KEY=your_key_here

# 4. Run dev server
npm run dev
```

Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com).

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage (chatbot)
│   ├── about/                # About page
│   ├── posts/                # Blog posts + [slug]
│   ├── tags/                 # Tag index + [tag] filter
│   ├── archives/             # Chronological archive
│   ├── search/               # Client-side search
│   └── api/chat/             # Gemini streaming API route + 6 tools
├── components/
│   ├── chat/                 # Chat UI (chat, landing, input, message, tool-renderer)
│   ├── tools/                # Tool UI components (presentation, projects, skills, resume, contact, blog-posts)
│   ├── posts/                # Blog post components (card, header, MDX, TOC)
│   └── layout/               # Navbar, footer, theme toggle
├── lib/
│   ├── posts.ts              # MDX loading and filtering
│   ├── config.ts             # Portfolio config loader
│   └── utils.ts              # formatDate, readingTime
content/
└── posts/                    # 9 MDX blog posts
portfolio-config.json         # All portfolio data (single source of truth)
```

---

## Deploying Your Own Fork

1. Fork this repo
2. Connect to [Vercel](https://vercel.com) via GitHub
3. Add `GOOGLE_GENERATIVE_AI_API_KEY` in Vercel environment variables
4. Deploy — Vercel auto-deploys on every push to `main`

---

## Author

**Kevin Trinh Nguyen**  
Software Engineer — Embedded Systems & AI/Agentic Engineering

- GitHub: [@ktnCodes](https://github.com/ktnCodes)
- LinkedIn: [itskevtrinh](https://linkedin.com/in/itskevtrinh)
