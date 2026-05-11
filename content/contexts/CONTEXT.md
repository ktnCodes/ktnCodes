# Context: content/contexts/

Route: `content/contexts/`

The CONTEXT.md library for the position-addressed Finder demo. One file per folder shown in the demo. Plus `_root-*` files for the `Workspace/` folder.

## Files

| File | Renders in Finder as |
|------|---------------------|
| `_root-context.md` | `Workspace/` folder CONTEXT.md (auto-preview + CONTEXT.md leaf) |
| `_root-readme.md` | `Workspace/` -> README.md leaf |
| `_root-agents.md` | `Workspace/` -> AGENTS.md leaf |
| `_root-claude.md` | `Workspace/` -> CLAUDE.md leaf |
| `_root-copilot.md` | `Workspace/` -> copilot-instructions.md leaf |
| `agentic-os.md` | `00-agentic-OS/` CONTEXT.md |
| `shipped.md` | `10-shipped/` CONTEXT.md |
| `inflight.md` | `20-inflight/` CONTEXT.md |
| `spikes.md` | `30-spikes/` CONTEXT.md |
| `planned.md` | `40-planned/` CONTEXT.md |
| `portfolio-site.md` | `50-portfolio-site/` CONTEXT.md |
| `knowledge-vault.md` | `60-knowledge-vault/` CONTEXT.md |

## Style Pattern

Each file follows the AutoPath CONTEXT.md style:

1. `# Context: <name>` heading
2. `Route: \`<path>/\`` line
3. One-line purpose
4. "Key Files" or "Key Projects" table
5. Lifecycle / Stack / Rules section as appropriate
6. "For LLMs" numbered list

## Rules

- No NDA / confidential content. This is public.
- Keep each file under ~50 lines. Tight tables, no prose paragraphs.
- ASCII only. No em dashes, smart quotes, ellipsis characters.
- File path = `content/contexts/<folder-slug>.md` matching the folder's `slug` in `tree.json`.

## For LLMs

1. New demo folder = new `<slug>.md` here + update `tree.json` to wire the `contextMd` field.
2. Sync style with the real workspace CONTEXT.md pattern (see `MyIdeaverse/AutoPath/CONTEXT.md`).
3. Don't rewrite these as marketing copy. They are functional routing contracts.
