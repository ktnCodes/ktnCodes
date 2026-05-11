# Context: content/

Route: `content/`

All markdown / JSON content read at build or request time. Source-of-truth files, no generated artifacts.

## Structure

| Folder / File | Purpose |
|---------------|---------|
| `projects/` | Project pages. One `.md` per project. Frontmatter drives `folder:` placement. |
| `posts/` | Blog posts as MDX |
| `contexts/` | Per-folder CONTEXT.md content for the position-addressed Finder demo |
| `agentic-os/` | `soul.md` / `me.md` / `skills.md` / `paths.md` leaves for the agentic-OS demo folder |
| `tree.json` | Tree shape: folders, labels, prefixes, explicit leaves |
| `about.json`, `beliefs.json`, `hero.json` | Section content for the home page |

## Content Loaders

| Loader | Reads | Used by |
|--------|-------|---------|
| `getTree()` | `tree.json` + auto-discovered projects | Home page Finder |
| `getAllProjects()` | `projects/*.md` | Home page, chatbot tools |
| `getAllPosts()` | `posts/*.mdx` | Blog routes |
| `buildContextSlots()` | `contexts/*.md` + `agentic-os/*.md` | Home page Finder |

## Rules

- Frontmatter is canonical. Project metadata lives in frontmatter, not in code.
- Slugs match filenames. `arkive.md` has `slug: arkive`.
- New folders in the Finder = new entry in `tree.json` + new `contexts/<slug>.md`.

## For LLMs

1. Don't generate content here unless explicitly asked.
2. Frontmatter changes can break the type validator in `src/lib/projects.ts`. Run `npm test` after edits.
3. Project deletes are filesystem deletes. No DB.
