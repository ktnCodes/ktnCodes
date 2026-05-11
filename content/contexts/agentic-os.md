# Context: 00-agentic-OS

Route: `00-agentic-OS/`

The LLM persona layer. Source-of-truth files that every AI harness reads. Same content, different harness entry points.

## Key Files

| File | Purpose |
|------|---------|
| `CONTEXT.md` | This routing contract |
| `soul.md` | Behavioral constraints. Universal, loaded first. |
| `me.md` | Identity. What I do, what I care about, how I work. |
| `skills.md` | Skill registry. Custom slash commands installed via `npx skills install`. |
| `paths.json` | Filesystem path map. Skills read this instead of hardcoding paths. |

## Harness Mapping

| Harness | Reads | Resolves to |
|---------|-------|-------------|
| Claude Code | `CLAUDE.md` | shim -> `AGENTS.md` |
| GitHub Copilot | `copilot-instructions.md` | mirror of `AGENTS.md` |
| Codex / future | `AGENTS.md` | canonical |

## For LLMs

1. Read `soul.md` first. Universal rules.
2. Read `me.md` for identity context.
3. Use `paths.json` to resolve workspace paths, never hardcode.
4. Skill changes go through `60-skills/` in the Ideaverse vault, not here.
