# Context: src/components/chat/

Route: `src/components/chat/`

Persona-led AI chatbot rendered as a macOS-style terminal in the homepage hero (`BrandBand`). Vercel AI SDK + Gemini (primary) / OpenAI (fallback). Tool-using agent that can pull project pages, posts, and contact info from the site.

## Key Files

| File | Purpose |
|------|---------|
| `TerminalChat.tsx` | Terminal-styled chat panel: boot lines, HELLO/IM KEVIN block-ASCII, welcome box, preset chips, prompt input. Mounted in `BrandBand`. |
| `BlockArt.tsx` | Pure-CSS-grid renderer for the block-ASCII art. Exports `BlockArt` component + `composeLine` helper + `LETTERS` map. |
| `chat-context.tsx` | React context: layout state, auto-prompt-on-leaf-click integration with Finder, hash-based open/close. |
| `tool-disclosure.tsx` | Collapsible UI for showing tool calls in transcript. |
| `tool-renderer.tsx` | Maps tool name -> renderer component (see `src/components/tools/`). |

## Tools Available to the Agent

Source: `src/app/api/chat/route.ts`

| Tool | Returns |
|------|---------|
| `getProject(slug)` | Full project frontmatter + body |
| `listProjects()` | All projects (optionally filtered by folder) |
| `getPost(slug)` | Blog post body + frontmatter |
| `getPostsByTag(tag)` | Posts under a tag |
| `getContactInfo()` | Email, github, linkedin from `portfolio-config.json` |
| `searchAll(query)` | Cross-content search |

## Rules

- Streaming required. Use `streamText` from AI SDK.
- Tool execution should be visible to the user via `tool-disclosure.tsx`.
- Persona prompt lives in `src/app/api/chat/route.ts`. Don't duplicate it client-side.
- Terminal palette uses `--term-*` CSS vars in `globals.css` for theme-aware light/dark.

## For LLMs

1. Don't add new tools without adding their renderer in `src/components/tools/`.
2. Tool results need to be JSON-serializable for streaming.
3. If adding a tool that hits an external API, set a sane timeout. Don't block the stream.
