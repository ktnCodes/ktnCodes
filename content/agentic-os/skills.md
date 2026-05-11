# skills.md

Skill registry for this workspace. Custom slash commands installed via `npx skills install`.

## Active skills

- `/grill-me` -- pressure-test a feature idea by branching on every decision
- `/write-prd` -- spike a PRD from a locked grill output
- `/prd-to-tasks` -- break a PRD into vertical-slice tasks
- `/plan`, `/scope`, `/build`, `/qa` -- 4-phase dev workflow
- `/yt-playlist-audit` -- read-only audit of configured YouTube playlists vs on-disk research output
- `/restyle` (planned) -- design-conversation skill for non-coders

## How they get there

Skills live in `60-skills/` inside the Ideaverse vault, get pushed to GitHub as wrapper repos, installed cross-harness via `npx skills install <skill>`. Heterogeneous setup: Claude Code (home) and Copilot CLI (work) share the same skills.
