# Context: src/components/

Route: `src/components/`

React components grouped by domain. Each subfolder owns one feature area.

## Domains

| Folder | Owns |
|--------|------|
| `finder/` | Position-addressed memory Mac Finder demo (signature feature) |
| `chat/` | Persona-led AI chatbot (panel, landing, tools, context) |
| `nav/` | Top navigation pill, sticky memoji, wordmark |
| `hero/` | Hero band, Memoji animation |
| `sections/` | About, Experience, Beliefs, Contact, shared `Section` wrapper |
| `posts/` | Blog post rendering (MDX, code blocks, headers, scroll progress) |
| `preview/` | Source/rendered toggle for Finder previews, edit-in-editor button |
| `layout/` | Top-level layout primitives |
| `tools/` | Chatbot tool renderers (`getProject`, `getPostsByTag`, etc.) |
| `dev/` | Dev-only inline editor components |
| `ui/` | Generic atomic UI (eyebrows, etc.) |

## Naming Convention

- PascalCase filenames for components: `FinderWindow.tsx`, `ChatPanel.tsx`.
- kebab-case for utilities adjacent to components: `chat-context.tsx`, `tool-renderer.tsx`.

## Rules

- New components go in the matching domain folder.
- If a component doesn't fit any existing domain, create a new domain folder (with a CONTEXT.md).
- Avoid `index.ts` re-exports. Import directly from the component file.
- Client components need `'use client'` at the top.

## For LLMs

1. Before adding a new component, check if an existing one can be extended.
2. Co-locate styles with the component (Tailwind classes inline). No `.module.css` files.
3. Read the target subfolder's CONTEXT.md before editing anything inside it.
