# Context: content/projects/

Route: `content/projects/`

Project pages. One markdown file per project. Frontmatter drives Finder placement and chatbot lookups.

## Frontmatter Schema

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `slug` | yes | string | Matches filename. URL-safe kebab-case. |
| `name` | yes | string | Display name |
| `folder` | yes | string | One of: `agentic-os`, `shipped`, `inflight`, `spikes`, `planned`, `portfolio-site`, `knowledge-vault` |
| `tagline` | yes | string | One-line summary |
| `status` | yes | string | `active`, `released`, `planned`, `archived` |
| `tech` | no | string[] | Tech tags |
| `started` | no | string | `YYYY-MM` |
| `order` | no | number | Sort within folder. Lower first. |
| `featured` | no | boolean | Highlights in lists |
| `github` | no | string | Repo URL or `null` |
| `demo` | no | string | Live demo URL or `null` |
| `category` | no | string | Free-form category label |

## Validation

Frontmatter is validated by `isValidProjectFrontmatter` in `src/lib/projects.ts`. Invalid files are silently skipped from the tree (won't appear in the Finder).

## Rules

- Filename and `slug` must match.
- Don't put NDA / confidential content here. The site is public.
- New project = new file. Use lowercase kebab-case slug.
- Renaming a project = rename file + update `slug` + add redirect (optional).

## For LLMs

1. When adding a project, copy an existing one as a template.
2. Run `npm test` after frontmatter edits to catch schema violations.
3. Always set `folder:` to a slug that exists in `content/tree.json`.
