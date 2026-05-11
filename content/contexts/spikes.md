# Context: 30-spikes

Route: `30-spikes/`

Exploratory research. Quick investigations to test a hypothesis or evaluate an approach before committing to a full build.

## Spike Lifecycle

| Stage | Output | Next |
|-------|--------|------|
| Active | `SPIKE_<name>.md` PRD plus maybe a tracer slice | Either die or graduate |
| Graduated | Moves to `40-planned/` | Becomes a real project |
| Killed | Archived with a `_killed` suffix on the SPIKE doc | Lessons stay accessible |

## Rules

- A spike is allowed to die. That's the point.
- Spike doc lives at the project's eventual home. If a spike graduates, the doc moves with it.
- Most spikes don't ship. A ~30% graduation rate is healthy.

## For LLMs

1. Spikes get `/grill-me` treatment before any code.
2. Spike branches in git use the `spike/<name>` prefix.
3. Never silently delete a killed spike. Tag and keep for the lesson.
