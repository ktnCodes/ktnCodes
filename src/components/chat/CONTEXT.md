# Context: src/components/chat/

Route: `src/components/chat/`

Persona-led AI chatbot. Floating button bottom-right opens a chat panel. Vercel AI SDK + Gemini (primary) / OpenAI (fallback). Tool-using agent that can pull project pages, posts, and contact info from the site.

## Key Files

| File | Purpose |
|------|---------|
| `floating-chat.tsx` | Bottom-right entry button + panel mount |
| `ChatPanel.tsx` | Side panel: header, message list, input, glass styling |
| `chat-landing.tsx` | First-open state: suggestion pills before any user input |
| `chat-message.tsx` | Individual message bubble (user, assistant, tool calls) |
| `chat-input.tsx` | Textarea + send button with submit-on-enter |
| `chat-context.tsx` | React context: layout state, auto-prompt-on-leaf-click integration with Finder |
| `chat.tsx` | Top-level Chat wrapper (`useChat` hook from AI SDK) |
| `tool-disclosure.tsx` | Collapsible UI for showing tool calls in transcript |
| `tool-renderer.tsx` | Maps tool name -> renderer component (see `src/components/tools/`) |

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
- Glass styling uses CSS vars (`--glass-bg`, `--glass-bg-strong`) for dark-mode compatibility.

## For LLMs

1. Don't add new tools without adding their renderer in `src/components/tools/`.
2. Tool results need to be JSON-serializable for streaming.
3. If adding a tool that hits an external API, set a sane timeout. Don't block the stream.
