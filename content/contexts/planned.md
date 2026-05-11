# Context: 40-planned

Route: `40-planned/`

Designed but not started. Each entry has a SPIKE doc or PRD that survived `/grill-me` but no commits yet.

## Key Projects

| Project | Frame |
|---------|-------|
| `tft-opener-analysis` | TFT opening-strategy tool. Game data, statistical analysis. |
| `agentic-knowledge-base` | Re-imagined LLM-aware wiki pattern. Between iterations. |

## The Bench Rule

`planned/` is the bench. Visible queue of the next 2 to 3 things. Not a todo-list dumping ground.

- Cap: 5 projects.
- Cull: anything sitting in planned for 60+ days without progress.
- Promote to `inflight/` when the first commit lands.

## For LLMs

1. Read the SPIKE doc before suggesting changes. Decisions there are locked.
2. If a planned project sits longer than 60 days, suggest demoting or culling.
