# Context: src/app/

Route: `src/app/`

Next.js App Router. File-based routing, server components by default. Next.js 16 has breaking changes from older versions.

## Routes

| Path | File | Type |
|------|------|------|
| `/` | `page.tsx` | Home (server). Loads tree, projects, contexts. |
| `/posts` | `posts/page.tsx` | Blog index |
| `/posts/[slug]` | `posts/[slug]/page.tsx` | Blog post |
| `/tags/[tag]` | `tags/[tag]/page.tsx` | Tag-filtered posts |
| `/archives` | `archives/page.tsx` | All posts by date |
| `/search` | `search/page.tsx` | Search UI |
| `/ideaverse-os` | `ideaverse-os/page.tsx` | Marketing surface for ideaverse-OS |
| `/api/chat` | `api/chat/route.ts` | Chatbot streaming endpoint |
| `/api/dev/save` | `api/dev/save/route.ts` | Dev-only inline editor save |

## Global Files

| File | Purpose |
|------|---------|
| `layout.tsx` | Root layout. Fonts, theme provider, chat context. |
| `globals.css` | Tailwind v4 import + `@theme inline` token definitions + dark-mode CSS vars |
| `sitemap.ts` | Dynamic sitemap |
| `robots.ts` | `robots.txt` generator |

## Next.js 16 Quirks

- `searchParams` is now a `Promise<SearchParams>`. Must be awaited.
- `params` for dynamic routes is now `Promise<Params>`. Same treatment.
- Server actions need `'use server'` directive.
- Turbopack is the default dev runtime.

## Rules

- Read `node_modules/next/dist/docs/` before assuming Next.js conventions match older versions.
- Heed deprecation notices.
- Server components are async. Client components are not.

## For LLMs

1. If editing a `page.tsx`, check if it's server (default) or client (`'use client'` at top).
2. Don't add API routes for things that could be server actions.
3. Stream long responses from `api/chat/`. The chat UI expects streaming.
