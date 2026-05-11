# Context: src/components/finder/

Route: `src/components/finder/`

The position-addressed memory demo. Mac Finder column view as a metaphor for "every folder declares its purpose, every workspace declares its rules." Signature feature of the site.

## Key Files

| File | Purpose |
|------|---------|
| `FinderWindow.tsx` | Desktop 4-column view: sidebar + folders + leaves + preview |
| `MobileFinder.tsx` | Mobile drill-in pattern: tap folder, see leaves; tap leaf, see preview |
| `MacChrome.tsx` | Decorative macOS desktop chrome (wallpaper, menu bar slot, dock) |
| `MenuBar.tsx` | Client-side live clock using `Intl.DateTimeFormat` (visitor's timezone) |

## Data Flow

1. `content/tree.json` defines folders + explicit leaves (context, link types).
2. `src/lib/tree.ts` loads `tree.json` AND auto-discovers projects from `content/projects/*.md` based on the project's `folder:` frontmatter field.
3. `src/app/page.tsx` calls `getTree()` server-side, also pre-renders all CONTEXT.md content into `contextSlots`.
4. `FinderWindow` receives tree + contextSlots, renders 4 columns.
5. URL state lives in `?open=<folderSlug>/<leafSlug>` query param.

## Leaf Types

| Type | Renders |
|------|---------|
| `project` | Project preview with frontmatter pill, tech tags, github/demo buttons, MDX body |
| `link` | External link (e.g. `blog` -> `/posts`, `wiki` -> `/tags/wiki`) |
| `context` | Pre-rendered MDX of a `CONTEXT.md` / sidecar file (no source toggle, no edit) |

## Folder Behavior

- When folder is selected with no leaf, `PreviewColumn` renders the folder's `contextMd` content if present.
- When a `context` leaf is selected, `PreviewColumn` renders that leaf's `contentPath` content.

## Rules

- Don't hardcode folder slugs. Always read from `tree.json`.
- The chat panel can dim the Finder via `useChatContext().layout`. Preserve the dim transition.
- Mobile Finder shares URL state with desktop. Don't fork the parse logic.

## For LLMs

1. Read `content/tree.json` to understand the current tree shape.
2. Read `src/lib/tree.ts` for the data model.
3. Adding a new folder = new entry in `tree.json`. Adding a new leaf type = update `LeafType` in `tree.ts` plus update both finder components.
4. URL format: `?open=<folderSlug>` or `?open=<folderSlug>/<leafSlug>`.
