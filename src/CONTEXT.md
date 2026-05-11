# Context: src/

Route: `src/`

Application source code. Three top-level directories: `app/` for routes, `components/` for UI, `lib/` for shared utilities.

## Structure

| Folder | Purpose |
|--------|---------|
| `app/` | Next.js App Router routes, layouts, API routes |
| `components/` | React components, grouped by domain |
| `lib/` | Framework-agnostic utilities and data loaders |
| `types/` | Shared TypeScript type declarations |

## Path Aliases

| Alias | Resolves to |
|-------|-------------|
| `@/` | `src/` |
| `@/components/...` | `src/components/...` |
| `@/lib/...` | `src/lib/...` |

## Rules

- New routes go in `app/`. Server components by default.
- Mark client components with `'use client'` only when needed (interactivity, hooks).
- New components go in the matching domain folder. No new top-level folders without a clear reason.
- Pure logic goes in `lib/`. Components import from `lib/`, not the other way around.

## For LLMs

1. Always know if the file is server- or client-side. Look for `'use client'` directive.
2. Server components can be async. Client components cannot.
3. Use the `@/` alias, never relative `../../../` chains.
