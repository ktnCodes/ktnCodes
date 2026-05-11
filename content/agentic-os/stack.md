# stack.md

What I reach for and why. The full tagged list lives in `portfolio-config.json -> skills` (the chatbot's `getSkills` tool reads the same source). This file is the narrative companion.

## Categories

| Bucket | What's there |
|--------|-------------|
| Languages | The 7 I actually ship. C++14 daily, Python often, TypeScript for the web surface. |
| AI & Agentic | Claude Code + Copilot harness, MCP, FastMCP, prompt + context architecture. The leverage layer. |
| Embedded & Platform | Embedded Linux, CAN, Qt5, Gen4OS. The AutoPath toolchain. |
| Web & Cloud | React + Next.js + Tailwind v4 for sites. Hugo for static. AWS for hosting. |
| Debugging & Testing | GDB + Valgrind + ASAN for C++ bugs. Google Test, Squish UI tests, SiL / HiL on target. |
| DevOps & Tools | Git, GitHub Actions, Jenkins, Docker, MkDocs, Ubuntu. |

## How I reach

- Pattern match -> reach for the tool I know -> tracer-slice it -> revisit if rough.
- C++ for performance and determinism. Python for prototyping. TypeScript for the rare web surface.
- AI / agentic stuff is the leverage layer. Compounds everything else.
- Default debugging path: log first, GDB second, ASAN third.

## What I'm learning

- Tailwind v4 (CSS-first `@theme inline`, no `tailwind.config.ts`)
- Next.js 16 (Promise-based `searchParams`, Turbopack default)
- Smart-pointer / memory-management depth (current AutoPath audit pass)

## For LLMs

1. `portfolio-config.json -> skills` is the canonical list. Update there first.
2. This file is the narrative companion. Stays human-readable. Doesn't try to be exhaustive.
3. The home-page `TechStackSection` and the chatbot's `getSkills` tool both read from `portfolio-config.json`. One source of truth.
