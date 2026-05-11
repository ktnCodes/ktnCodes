# Context: 60-knowledge-vault

Route: `60-knowledge-vault/`

The Ideaverse wiki layer. LLM-compiled articles from raw inputs (papers, YouTube, web clips), organized into a position-addressed Obsidian vault.

## Vault Structure

| Route | Purpose |
|-------|---------|
| `00-agentic-OS/` | Persona shared with this workspace |
| `10-wiki/` | LLM-compiled articles |
| `20-work/` | Day-job engineering domain |
| `30-personal/` | Career, learning, portfolio |
| `40-raw/` | Paper / YouTube / web-clip ingestion |
| `50-research-library/` | Curated research, idea generation, spikes |
| `60-skills/` | Custom slash commands |
| `70-daily/` | Daily notes |
| `80-visualization/` | Attachments, screenshots, diagrams |
| `90-copilot/` | Custom prompts and scripts |
| `99-archive/` | Cold storage |

## How Content Flows

1. Raw input lands in `40-raw/` (web clip, paper, YouTube transcript).
2. LLM compiles into a wiki article in `10-wiki/<topic>/`.
3. Human reviews, sets status to `team-reviewed`.
4. Public excerpts published to `/tags/wiki` on this blog.

## For LLMs

1. Read `_index.md` first for master vault routing.
2. Prefer one canonical home per topic. Cross-link, don't duplicate.
3. Never delete content in `99-archive/`.
