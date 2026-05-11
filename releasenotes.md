# ktnCodes v2 — AI Portfolio Site Implementation Plan

## Context

Redesign of ktncodes.github.io from a stock Hugo + PaperMod blog into a chatbot-first portfolio site. Combines two inspirations:
- **AI chatbot portfolio** (cloned at `portfolio-copied/`) — interactive chat experience where visitors ask questions to explore the developer's work
- **natebjones.com** — clean dark slate design, card-stack writing page

**Problem:** Current site is a generic Hugo template with no differentiation. For an AI engineering career, the portfolio should *demonstrate* AI skills, not just describe them.

**Outcome:** A Next.js portfolio where the homepage is an AI chatbot (powered by Gemini free tier) that answers questions about Kevin's work, links to blog posts, and showcases projects — with a full blog system (Posts, Tags, Archives, Search) styled in a clean dark theme.

---

## Decisions Summary

| Decision | Choice |
|----------|--------|
| Site model | Chatbot-first homepage + blog pages |
| Tech stack | Next.js 15 + React 19 + TypeScript + Tailwind CSS 4 |
| LLM | Google Gemini 1.5 Flash (free tier) |
| Blog engine | MDX + next-mdx-remote + gray-matter |
| Color scheme | Dark slate (#0f172a) + cyan (#22d3ee) |
| Bot persona | Professional Kevin (first person, interview vibe) |
| Hosting | Vercel free tier (ktncodes.vercel.app) |
| Location | portfolio-site/ktncodes-v2/ |
| Nav pages | Home (chat) / Posts / Tags / About / Archives / Search |
| Blog content | Migrate all 9 published Hugo posts |
| Features | Dark/light mode, reading time, TOC, code copy buttons |

---

## Project Structure

```
ktncodes-v2/
├── public/
│   ├── avatar.png                    # Kevin's profile photo
│   ├── resume.pdf                    # Downloadable resume
│   └── favicon.ico
│
├── content/
│   └── posts/                        # MDX blog posts (migrated from Hugo)
│       ├── hello-world.mdx
│       ├── building-this-site.mdx
│       ├── why-programming-feels-hard.mdx
│       ├── leet-code-study-guide.mdx
│       ├── boomba-recon-bot.mdx
│       ├── card-game-app.mdx
│       ├── cloud-photo-gallery.mdx
│       ├── senior-design-hinkley.mdx
│       └── research-report-ai-agent-fails-97-percent.mdx
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout (metadata, theme, nav)
│   │   ├── page.tsx                  # Homepage = chatbot
│   │   ├── globals.css               # Tailwind + custom dark theme
│   │   ├── posts/
│   │   │   ├── page.tsx              # Posts index (card-stack layout)
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Individual post page
│   │   ├── tags/
│   │   │   ├── page.tsx              # All tags page
│   │   │   └── [tag]/
│   │   │       └── page.tsx          # Posts filtered by tag
│   │   ├── about/
│   │   │   └── page.tsx              # About page
│   │   ├── archives/
│   │   │   └── page.tsx              # Chronological archive
│   │   ├── search/
│   │   │   └── page.tsx              # Search page
│   │   └── api/
│   │       └── chat/
│   │           ├── route.ts          # Chat API endpoint (Gemini)
│   │           ├── prompt.ts         # System prompt builder
│   │           └── tools/
│   │               ├── getPresentation.ts
│   │               ├── getProjects.ts
│   │               ├── getSkills.ts
│   │               ├── getResume.ts
│   │               ├── getContact.ts
│   │               └── getBlogPosts.ts   # NEW: searches posts by topic
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── navbar.tsx            # Top nav bar
│   │   │   ├── footer.tsx            # Site footer
│   │   │   └── theme-toggle.tsx      # Dark/light mode switch
│   │   ├── chat/
│   │   │   ├── chat.tsx              # Main chat container
│   │   │   ├── chat-landing.tsx      # Landing screen with preset questions
│   │   │   ├── chat-input.tsx        # Message input bar
│   │   │   ├── chat-message.tsx      # Message bubble component
│   │   │   └── tool-renderer.tsx     # Maps tool calls to UI components
│   │   ├── tools/                    # UI components rendered by chatbot tools
│   │   │   ├── presentation.tsx      # Bio/intro card
│   │   │   ├── projects.tsx          # Project cards carousel
│   │   │   ├── skills.tsx            # Skills by category
│   │   │   ├── resume.tsx            # Experience + PDF download
│   │   │   ├── contact.tsx           # Email + social links
│   │   │   └── blog-posts.tsx        # Blog post cards (used by getBlogPosts)
│   │   ├── posts/
│   │   │   ├── post-card.tsx         # Card for Posts page (card-stack style)
│   │   │   ├── post-header.tsx       # Post title, date, reading time, tags
│   │   │   ├── table-of-contents.tsx # TOC sidebar for posts
│   │   │   └── code-block.tsx        # Code block with copy button
│   │   └── ui/                       # Base UI primitives (button, card, etc.)
│   │
│   ├── lib/
│   │   ├── config.ts                 # Loads portfolio-config.json
│   │   ├── posts.ts                  # MDX post loading, sorting, filtering
│   │   ├── search.ts                 # Client-side search index
│   │   └── utils.ts                  # Shared utilities (cn, formatDate, readingTime)
│   │
│   └── types/
│       ├── portfolio.ts              # Config type definitions
│       └── posts.ts                  # Post frontmatter types
│
├── portfolio-config.json             # All portfolio data (single source of truth)
├── .env.local                        # GOOGLE_GENERATIVE_AI_API_KEY
├── .env.example                      # Template
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── releasenotes.md                   # This file
```

---

## Phase 1: Project Scaffolding

**Goal:** Empty Next.js project with Tailwind, dark theme, and nav shell.

### Tasks
1. Initialize Next.js 15 with TypeScript and Tailwind CSS 4
   ```bash
   npx create-next-app@latest ktncodes-v2 --typescript --tailwind --eslint --app --src-dir
   ```
2. Install core dependencies:
   ```bash
   npm install ai @ai-sdk/google @ai-sdk/react        # Vercel AI SDK + Gemini
   npm install next-mdx-remote gray-matter              # MDX blog engine
   npm install remark-gfm rehype-slug rehype-autolink-headings rehype-pretty-code  # Markdown plugins
   npm install next-themes                               # Dark/light mode
   npm install framer-motion                             # Animations
   npm install lucide-react                              # Icons
   npm install zod                                       # Schema validation
   ```
3. Set up Tailwind config with dark slate + cyan color scheme:
   ```
   Background:  #0f172a (slate-900)
   Surface:     #1e293b (slate-800)
   Text:        #f1f5f9 (slate-100)
   Accent:      #22d3ee (cyan-400)
   Accent hover:#06b6d4 (cyan-500)
   Muted:       #94a3b8 (slate-400)
   ```
4. Create root layout with:
   - Dark theme as default, light mode toggle via next-themes
   - Navbar component (Home | Posts | Tags | About | Archives | Search)
   - Footer component
   - SEO metadata (title: "ktnCodes", description, Open Graph)
5. Create `.env.example` with `GOOGLE_GENERATIVE_AI_API_KEY=`
6. Create empty page shells for all routes

### Files Created
- `src/app/layout.tsx`, `src/app/globals.css`
- `src/components/layout/navbar.tsx`, `footer.tsx`, `theme-toggle.tsx`
- All `page.tsx` shells (home, posts, tags, about, archives, search)
- `tailwind.config.ts`, `next.config.ts`, `package.json`

---

## Phase 2: Portfolio Data & About Page

**Goal:** Populate portfolio-config.json with Kevin's data. Build the About page.

### Tasks
1. Create `portfolio-config.json` with Kevin's data:
   - **personal**: Kevin Nguyen, Computer Engineering (Iowa State 2022), Embedded Software Engineer at John Deere
   - **education**: B.S. Computer Engineering, Iowa State University, 2022
   - **experience**: Embedded Software Engineer at John Deere (Gen4OS Precision Ag)
   - **skills**: C, C++, Python, JavaScript, TypeScript, React, embedded systems, cloud/AWS, Hugo, Next.js, AI/LLM integration
   - **projects**: 9 projects (5 active/2026, 4 school/2022) — see Projects list below
   - **social**: GitHub (ktnCodes), LinkedIn (itskevtrinh)
   - **personality**: Clear, direct, practical. Engineering-minded. Enthusiastic about AI and building things.
   - **chatbot**: Name "Kevin", professional tone, first person
   - **presetQuestions**: "Tell me about yourself", "What have you built?", "What's your tech stack?", "What do you write about?"
2. Create `src/lib/config.ts` to load and export config data
3. Create `src/types/portfolio.ts` with TypeScript interfaces
4. Build About page (`src/app/about/page.tsx`):
   - Profile section with photo, name, title, bio
   - Experience timeline (John Deere)
   - Skills grouped by category with styled badges
   - Education section
   - Social links (GitHub, LinkedIn)
5. Copy resume PDF to `public/resume.pdf`
   - Source: `JobReforgerAI\base-resume\Kevin_Nguyen_General_Resume.docx.pdf`

### Data: Projects List
```
2026 (Active/Planned):
- AI Portfolio Site — This site. Next.js + Gemini chatbot. [meta, next.js, ai]
- YouTube Blog Summarizer — Tool to convert YouTube videos into blog posts. [python, ai]
- TFT Opener Analysis — TFT game opener analysis tool. [python, data]
- Website Builder — Custom websites (Dalena's pet pastries). [javascript, react]
- ResumeForgerAI — AI-powered resume builder and cover letter generator. [python, ai]

2022 (School):
- Boomba Recon Bot — Roomba programmed as reconnaissance bot. Senior design. [c, embedded]
- Card Game App — Android universal card game with online multiplayer. [java, android]
- Cloud Photo Gallery — AWS-hosted photo gallery (RDS, Flask, EC2). [python, aws]
- Hinkley Medical Web App — Web app for medical device startup. [javascript, react, aws]
```

### Files Created
- `portfolio-config.json`
- `src/lib/config.ts`, `src/types/portfolio.ts`
- `src/app/about/page.tsx`
- `public/resume.pdf`, `public/avatar.png`

---

## Phase 3: Blog System (Posts, Tags, Archives, Search)

**Goal:** Full blog system with MDX posts, card-stack layout, tags, archives, and search.

### Tasks

#### 3a. MDX Post Infrastructure
1. Create `src/lib/posts.ts` with functions:
   - `getAllPosts()` — reads all .mdx files from `content/posts/`, parses frontmatter with gray-matter, sorts by date descending
   - `getPostBySlug(slug)` — loads a single post with content
   - `getAllTags()` — extracts unique tags with counts
   - `getPostsByTag(tag)` — filters posts by tag
   - `getArchivesByYear()` — groups posts by year
2. Create `src/types/posts.ts`:
   ```typescript
   interface PostFrontmatter {
     title: string;
     date: string;
     tags: string[];
     summary: string;
     showToc?: boolean;
   }
   interface Post extends PostFrontmatter {
     slug: string;
     content: string;
     readingTime: string;
   }
   ```
3. Add reading time calculation to `src/lib/utils.ts`

#### 3b. Migrate Hugo Posts to MDX
1. Copy 9 published posts from `ktncodes.github.io/content/posts/` to `ktncodes-v2/content/posts/`
2. Rename `.md` to `.mdx`
3. Adapt frontmatter (Hugo YAML → consistent format):
   - Keep: title, date, tags, summary
   - Rename: `ShowToc: true` → `showToc: true`
   - Add `summary` where missing
4. Verify all markdown content renders correctly

#### 3c. Posts Page (Card-Stack Layout like natebjones.com)
1. Build `src/components/posts/post-card.tsx`:
   - Card with title, summary, date, tags, reading time
   - "Read More" button linking to `/posts/[slug]`
   - Hover animation (subtle lift/glow with cyan accent)
   - Dark surface (#1e293b) card on dark background (#0f172a)
2. Build `src/app/posts/page.tsx`:
   - Vertical card stack layout (cards stacked with consistent spacing)
   - All posts rendered as post-cards, sorted by date
   - Page title "Posts" at top

#### 3d. Individual Post Page
1. Build `src/app/posts/[slug]/page.tsx`:
   - Post header: title, date, reading time, tags (linked to /tags/[tag])
   - MDX content rendered via next-mdx-remote
   - Table of contents sidebar (when showToc is true)
   - Code blocks with copy button (rehype-pretty-code)
   - Dark theme code syntax highlighting
2. Build `src/components/posts/post-header.tsx`
3. Build `src/components/posts/table-of-contents.tsx`
4. Build `src/components/posts/code-block.tsx` with copy button

#### 3e. Tags Pages
1. Build `src/app/tags/page.tsx` — all tags displayed as clickable badges with post counts
2. Build `src/app/tags/[tag]/page.tsx` — posts filtered by tag, using same card-stack layout

#### 3f. Archives Page
1. Build `src/app/archives/page.tsx`:
   - Posts grouped by year
   - Each entry: date + title (linked)
   - Minimal, clean layout

#### 3g. Search Page
1. Build `src/lib/search.ts` — client-side search index built from post titles, summaries, tags, and content
2. Build `src/app/search/page.tsx`:
   - Search input with real-time filtering
   - Results displayed as post-cards
   - Search across title, summary, tags, content

### Files Created
- `content/posts/*.mdx` (9 migrated posts)
- `src/lib/posts.ts`, `src/lib/search.ts`, `src/types/posts.ts`
- `src/app/posts/page.tsx`, `src/app/posts/[slug]/page.tsx`
- `src/app/tags/page.tsx`, `src/app/tags/[tag]/page.tsx`
- `src/app/archives/page.tsx`, `src/app/search/page.tsx`
- `src/components/posts/post-card.tsx`, `post-header.tsx`, `table-of-contents.tsx`, `code-block.tsx`

---

## Phase 4: AI Chatbot

**Goal:** Full chatbot on homepage with 6 tools, preset replies, and streaming.

### Tasks

#### 4a. Chat API Route
1. Create `src/app/api/chat/route.ts`:
   - POST handler using Vercel AI SDK `streamText()`
   - Google Gemini 1.5 Flash model via `@ai-sdk/google`
   - Loads system prompt + registers 6 tools
   - Max 2 tool-calling steps
   - Error handling for quota exhaustion
2. Create `src/app/api/chat/prompt.ts`:
   - Generates system prompt from portfolio-config.json
   - Instructs AI to be "Kevin" in first person
   - Professional, friendly, interview-style tone
   - Maps question types to tools
   - Includes context about all projects, experience, skills
   - Tells AI to use getBlogPosts when someone asks about a topic Kevin has written about

#### 4b. Chat Tools (6 tools)
Adapt from cloned portfolio pattern (no parameters, returns data from config):

| Tool | Returns | UI Component |
|------|---------|-------------|
| `getPresentation` | Bio, education, background, profile photo | `presentation.tsx` |
| `getProjects` | All 9 projects with descriptions, tech, links | `projects.tsx` |
| `getSkills` | Skills by category with color-coded badges | `skills.tsx` |
| `getResume` | Work experience + PDF download link | `resume.tsx` |
| `getContact` | Email, GitHub, LinkedIn links | `contact.tsx` |
| `getBlogPosts` | Searches posts by topic keyword, returns matching post cards with links | `blog-posts.tsx` |

**getBlogPosts (new tool):**
- Takes an optional `topic` parameter (string)
- Reads all MDX posts, filters by matching title/tags/summary against the topic
- Returns matching posts as card data (title, summary, date, slug, tags)
- UI renders as clickable post cards that link to `/posts/[slug]`
- If no topic given, returns 5 most recent posts

#### 4c. Chat UI Components
1. `src/components/chat/chat.tsx` — main container:
   - Avatar header (Kevin's photo, scales when tools active)
   - Scrollable message area
   - Fixed input bar at bottom
   - Message loading states
   - Error handling (quota exceeded)
2. `src/components/chat/chat-landing.tsx` — initial screen:
   - "Hi, I'm Kevin." introduction text
   - 4 preset question buttons (interview-style)
   - Subtle animations on load
3. `src/components/chat/chat-input.tsx` — message input:
   - Text input + send button
   - Enter to send, Shift+Enter for newline
   - Disabled state while loading
4. `src/components/chat/chat-message.tsx` — message bubble:
   - User messages (right-aligned, cyan accent)
   - Bot messages (left-aligned, slate surface)
   - Markdown rendering for bot text responses
5. `src/components/chat/tool-renderer.tsx` — maps tool calls to components:
   ```
   getPresentation → <Presentation />
   getProjects     → <Projects />
   getSkills       → <Skills />
   getResume       → <Resume />
   getContact      → <Contact />
   getBlogPosts    → <BlogPosts />
   ```

#### 4d. Tool UI Components
1. `src/components/tools/presentation.tsx` — profile card with photo, bio, education, tags
2. `src/components/tools/projects.tsx` — project cards (carousel or grid), each with title, description, tech stack, status, links
3. `src/components/tools/skills.tsx` — skills grouped by category, color-coded badges
4. `src/components/tools/resume.tsx` — experience timeline + "Download Resume" button
5. `src/components/tools/contact.tsx` — email + social links with icons
6. `src/components/tools/blog-posts.tsx` — matching post cards with "Read" links

#### 4e. Preset Replies
- Cache responses for the 4 preset questions to save API quota
- Show cached UI component immediately when preset is clicked
- Offer "Get AI Response" override button

#### 4f. Homepage Integration
- `src/app/page.tsx` renders the `<Chat />` component as the full-page experience
- Nav bar stays visible at top
- Chat fills remaining viewport height

### Files Created
- `src/app/api/chat/route.ts`, `prompt.ts`
- `src/app/api/chat/tools/` (6 tool files)
- `src/components/chat/` (5 components)
- `src/components/tools/` (6 components)

### Key Reference Files (from cloned portfolio)
- `portfolio-copied/portfolio-main/src/app/api/chat/route.ts` — chat API pattern
- `portfolio-copied/portfolio-main/src/app/api/chat/tools/` — tool definition pattern
- `portfolio-copied/portfolio-main/src/lib/config-parser.ts` — system prompt generation
- `portfolio-copied/portfolio-main/src/components/chat/chat.tsx` — chat UI pattern
- `portfolio-copied/portfolio-main/src/components/chat/tool-renderer.tsx` — tool rendering

---

## Phase 5: Polish & Deploy

**Goal:** Responsive design, animations, SEO, Vercel deployment.

### Tasks
1. **Responsive design** — test all pages at mobile, tablet, desktop breakpoints
2. **Animations** — subtle Framer Motion transitions:
   - Page transitions (fade in)
   - Post cards (stagger on load, hover lift)
   - Chat messages (slide in)
   - Tool components (fade + scale)
3. **SEO & metadata**:
   - Open Graph tags for all pages
   - Twitter card metadata
   - Dynamic metadata for individual posts (title, description, tags)
   - Sitemap generation
   - robots.txt
4. **Vercel deployment**:
   - Create GitHub repo for ktncodes-v2
   - Connect to Vercel
   - Set environment variable: `GOOGLE_GENERATIVE_AI_API_KEY`
   - Deploy to ktncodes.vercel.app
   - Test chatbot API route works in production
5. **Final QA**:
   - Test all 6 chatbot tools
   - Test all 9 migrated blog posts render correctly
   - Test tags, archives, search functionality
   - Test dark/light mode toggle
   - Test mobile experience
   - Test code copy buttons and TOC

---

## Verification Plan

| Check | How to verify |
|-------|--------------|
| Homepage loads chatbot | Visit `/` — see landing screen with preset questions |
| Preset questions work | Click each of the 4 presets — see cached UI response |
| Freeform chat works | Type a custom question — get streamed Gemini response |
| getBlogPosts tool | Ask "What have you written about AI?" — see post cards |
| All 6 tools render | Trigger each tool — verify UI component renders |
| Posts page card-stack | Visit `/posts/` — see all 9 posts as cards |
| Individual post | Click a post — see full MDX content with TOC |
| Code copy button | Find a code block in a post — click copy, verify clipboard |
| Tags page | Visit `/tags/` — see all tags with counts |
| Tag filtering | Click a tag — see filtered posts |
| Archives page | Visit `/archives/` — see posts grouped by year |
| Search | Visit `/search/`, type "embedded" — see matching posts |
| Dark/light mode | Toggle theme — all pages respond correctly |
| Mobile responsive | Resize to 375px — nav collapses, chat usable, cards stack |
| Resume download | Trigger getResume tool — click download — PDF downloads |
| Vercel deploy | Push to main — Vercel auto-deploys — site live |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Gemini free tier rate limiting | Preset replies handle 80% of interactions; graceful error UI for quota exhaustion |
| MDX migration breaks content | Test each post individually; Hugo markdown is standard and should convert cleanly |
| Chat API cold starts on Vercel | Gemini Flash is fast; Vercel serverless functions warm quickly |
| Large bundle size from MDX | Use next-mdx-remote (renders server-side); lazy-load tool UI components |
| Search performance with many posts | Client-side search is fine for <100 posts; can add Fuse.js if needed |

---

## Implementation Order

```
Phase 1: Scaffolding        ██░░░░░░░░  ~15% of work
Phase 2: Data & About       ██░░░░░░░░  ~10%
Phase 3: Blog System        ████████░░  ~35%
Phase 4: AI Chatbot         ████████░░  ~30%
Phase 5: Polish & Deploy    ██░░░░░░░░  ~10%
```

Phases 2 and 3 can partially overlap. Phase 4 depends on Phase 2 (needs config data). Phase 5 is final integration.
