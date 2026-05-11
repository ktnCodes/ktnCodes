# Context: src/lib/

Route: `src/lib/`

Framework-agnostic utilities. Pure functions and data loaders. No React, no Next.js, no DOM.

## Key Files

| File | Purpose |
|------|---------|
| `tree.ts` | Loads `content/tree.json`, auto-discovers projects, returns `Tree` |
| `projects.ts` | Loads project markdown files, parses frontmatter, validates schema |
| `posts.ts` | Loads blog posts, sorts by date, extracts tags |
| `config.ts` | Loads `portfolio-config.json`, exposes identity / social data |
| `skills.ts` | Skills-related helpers (categorization, formatting) |
| `utils.ts` | Misc utilities |
| `__fixtures__/` | Test fixtures consumed by `*.test.ts` |

## Test Files

| File | Tests |
|------|-------|
| `tree.test.ts` | Tree construction, project discovery, ordering |
| `projects.test.ts` | Frontmatter validation, schema enforcement |

## Rules

- Pure functions only. No `useState`, no `'use client'`, no fetch.
- File I/O is OK (server-side only) but use `node:fs`, not browser APIs.
- All loaders should fail gracefully (missing file -> `null` or empty, not throw).
- Schema validation via `isValidXxxFrontmatter` guards instead of zod / io-ts.

## For LLMs

1. New utility goes here only if it has no UI dependency.
2. Add a test in `__fixtures__/` for any non-trivial pure function.
3. Don't introduce a runtime dependency unless absolutely necessary.
