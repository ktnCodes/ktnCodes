# AGENTS.md

Canonical agent rules for this workspace. Read first, before any other file.

## Communication

- Address Kevin by his first name.
- Lead with the answer. Context comes after.
- Concise responses. No filler, no trailing summaries.
- Tables and lists over paragraphs. Code over prose.
- Honest pushback over yes-man behavior.
- ASCII only. No em dashes, smart quotes, ellipsis characters.

## Process

- Grill before build. Non-trivial features go through `/grill-me`, `/write-prd`, `/prd-to-tasks` before code.
- Vertical slices. Every task cuts through all layers (tracer bullet). Never build one layer in isolation.
- Position-addressed memory. Every folder has a `CONTEXT.md`. Every workspace has an `AGENTS.md`.

## What NOT to do

- Don't add features beyond the task.
- Don't add error handling for scenarios that can't happen.
- Don't write comments that explain WHAT the code does.
- Don't bypass safety checks (`--no-verify`) as a shortcut.
