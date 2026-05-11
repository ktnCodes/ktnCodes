import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "../../_components/SectionLabel";

export const metadata: Metadata = {
  title: "The Harness Layer -- ideaverse-os concepts",
  description:
    "How ideaverse-os routes every LLM tool to the same identity files. The lean 6 files, auto_inject, and why harness-agnostic design matters.",
};

const leanFiles = [
  {
    name: "soul.md",
    role: "Behavioral rules",
    what: "Communication style, format constraints, workflow process rules. The non-negotiables for every session.",
    why: "Without this, every session starts from scratch. With it, every harness inherits the same defaults.",
  },
  {
    name: "me.md",
    role: "Identity dossier",
    what: "Who you are: summary statement, first principles, roles, working style, energy pattern.",
    why: "Grounds the LLM in your context before it reads anything else. The difference between generic responses and ones that feel like they know you.",
  },
  {
    name: "user.md",
    role: "Workflow preferences",
    what: "Which LLM harnesses you use, tool stack, file naming conventions, daily rhythm.",
    why: "Lets the LLM pick the right path, file format, and tone for your actual environment.",
  },
  {
    name: "compass.md",
    role: "Current priorities",
    what: "What you are optimizing for this week, this month, this quarter. Success metrics. Collision rules.",
    why: "The priority filter. Every suggestion the LLM makes should pass through this first.",
  },
  {
    name: "memory.md",
    role: "Persistent memory",
    what: "A rolling log of observations, decisions, and learnings too important to lose between sessions.",
    why: "Context that survives session boundaries. Grows over time without growing unbounded.",
  },
  {
    name: "runbook.md",
    role: "Session triggers",
    what: "What to do at session start, what chains to run, when to switch between work and personal modes.",
    why: "Automates the onboarding steps you would otherwise type every time.",
  },
];

const routerFiles = [
  {
    name: "CLAUDE.md",
    harness: "Claude Code",
    mechanism: "Auto-loaded as project instructions when Claude Code runs from the vault root.",
  },
  {
    name: "GEMINI.md",
    harness: "Gemini CLI",
    mechanism: "Read by GEMINI.md convention at session start.",
  },
  {
    name: "AGENTS.md",
    harness: "Codex CLI / OpenAI Assistants",
    mechanism: "Loaded by the AGENTS.md convention in agentic frameworks.",
  },
  {
    name: ".cursorrules",
    harness: "Cursor",
    mechanism: "Auto-loaded as project rules by Cursor's .cursorrules discovery.",
  },
];

export default function HarnessLayerPage() {
  return (
    <div className="grain bg-iv-cream pb-32">
      {/* Back nav */}
      <div className="px-6 pt-10">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/ideaverse-os"
            className="inline-flex min-h-[44px] items-center gap-2 font-sans text-[13px] text-iv-teal hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
          >
            <span aria-hidden>{"<--"}</span>
            ideaverse-os
          </Link>
        </div>
      </div>

      {/* 00 / OVERVIEW */}
      <section className="px-6 pt-10 pb-16 sm:pt-14 sm:pb-20">
        <div className="mx-auto max-w-3xl">
          <SectionLabel number="00" label="Concept" />
          <h1 className="mt-6 font-iv-display text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.015em] text-iv-wine">
            The harness layer
          </h1>
          <p className="mt-5 max-w-[42rem] font-iv-display text-[clamp(1.125rem,2vw,1.375rem)] leading-[1.2] text-iv-teal">
            One set of identity files. Every LLM tool reads them through its own convention.
          </p>
          <p className="mt-6 max-w-[42rem] text-[1.0625rem] leading-[1.65] text-iv-ink">
            The harness layer is what makes ideaverse-os portable. Six markdown files encode who
            you are, how you work, and what you care about right now. Five convention files route
            every LLM harness to those six files at session start. You write your identity once.
            Every tool inherits it.
          </p>
        </div>
      </section>

      {/* 10 / THE LEAN 6 FILES */}
      <section className="border-t border-iv-wine/15 px-6 pt-16 pb-20 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <SectionLabel number="10" label="The lean 6 files" />
          <h2 className="mt-6 font-iv-display text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold leading-[1.08] tracking-[-0.012em] text-iv-wine">
            Stored in{" "}
            <code className="font-mono text-[0.85em]">00-agentic-OS/</code>
          </h2>
          <p className="mt-4 max-w-[42rem] text-[1.0625rem] leading-[1.65] text-iv-ink">
            Every file carries{" "}
            <code className="font-mono text-[15px]">auto_inject: true</code> in its frontmatter.
            Convention files use this signal to load the lean files into context before any
            prompt runs.
          </p>

          <div className="mt-10 space-y-0 border-t border-iv-wine/15">
            {leanFiles.map((f) => (
              <div
                key={f.name}
                className="border-b border-iv-wine/10 py-6"
              >
                <div className="flex items-baseline gap-4">
                  <code className="font-mono text-[15px] font-semibold text-iv-wine">
                    {f.name}
                  </code>
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
                    {f.role}
                  </span>
                </div>
                <p className="mt-2 max-w-[40rem] text-[15px] leading-[1.55] text-iv-ink">
                  {f.what}
                </p>
                <p className="mt-2 max-w-[40rem] text-[14px] leading-[1.5] text-iv-ink-soft italic">
                  {f.why}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 20 / ROUTER FILES */}
      <section className="border-t border-iv-wine/15 px-6 pt-16 pb-20 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <SectionLabel number="20" label="Router files" />
          <h2 className="mt-6 font-iv-display text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold leading-[1.08] tracking-[-0.012em] text-iv-wine">
            One per harness, stored at vault root
          </h2>
          <p className="mt-4 max-w-[42rem] text-[1.0625rem] leading-[1.65] text-iv-ink">
            Each router file is a thin wrapper: it imports the lean 6 files using the
            convention its harness already reads. The content is identical across tools;
            only the filename changes.
          </p>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-iv-wine/20">
                  <th className="pb-3 text-left font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
                    File
                  </th>
                  <th className="pb-3 text-left font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
                    Harness
                  </th>
                  <th className="pb-3 text-left font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
                    How it loads
                  </th>
                </tr>
              </thead>
              <tbody>
                {routerFiles.map((r, i) => (
                  <tr
                    key={r.name}
                    className={i % 2 === 0 ? "bg-iv-cream-pale" : "bg-transparent"}
                  >
                    <td className="py-3 pr-6 align-top">
                      <code className="font-mono text-[13px] text-iv-wine">{r.name}</code>
                    </td>
                    <td className="py-3 pr-6 align-top font-iv-display text-[15px] text-iv-ink">
                      {r.harness}
                    </td>
                    <td className="py-3 align-top text-[14px] leading-[1.5] text-iv-ink-soft">
                      {r.mechanism}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 border border-iv-wine/25 bg-iv-cream-pale">
            <div className="border-b border-iv-wine/15 bg-iv-cream-deep px-4 py-2">
              <span className="font-mono text-[11px] text-iv-wine">CLAUDE.md (example)</span>
            </div>
            <pre className="overflow-x-auto px-4 py-4 font-mono text-[12px] leading-[1.65] text-iv-ink whitespace-pre">{`# Vault context

@00-agentic-OS/soul.md
@00-agentic-OS/me.md
@00-agentic-OS/user.md
@00-agentic-OS/compass.md
@00-agentic-OS/memory.md
@00-agentic-OS/runbook.md

Load these at session start. They are auto_inject: true.
Follow soul.md rules in all responses.`}</pre>
          </div>
        </div>
      </section>

      {/* 30 / AUTO_INJECT */}
      <section className="border-t border-iv-wine/15 px-6 pt-16 pb-20 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <SectionLabel number="30" label="auto_inject" />
          <h2 className="mt-6 font-iv-display text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold leading-[1.08] tracking-[-0.012em] text-iv-wine">
            The load signal
          </h2>
          <p className="mt-4 max-w-[42rem] text-[1.0625rem] leading-[1.65] text-iv-ink">
            Every lean file carries this frontmatter field:
          </p>

          <div className="mt-6 border border-iv-wine/25 bg-iv-cream-pale">
            <pre className="overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-[1.65] text-iv-ink whitespace-pre">{`---
name: compass
description: Current priorities and success metrics.
type: lean-file
auto_inject: true
last-updated: YYYY-MM-DD
---`}</pre>
          </div>

          <div className="mt-8 space-y-6">
            {[
              {
                label: "What auto_inject means",
                text: "A router file or hook reads all lean files with auto_inject: true and loads them into context before any prompt runs. The LLM sees your identity before it sees your question.",
              },
              {
                label: "What it does not mean",
                text: "Not all harnesses support automatic context injection via file scanning. For those that don't, the convention file (CLAUDE.md, AGENTS.md, etc.) acts as the injection point by explicitly @importing the lean files.",
              },
              {
                label: "Why frontmatter, not a config file",
                text: "Keeping the signal in each file's own frontmatter means any LLM can identify which files to load just by reading the files -- no separate registry, no build step, no external config.",
              },
            ].map((item) => (
              <div key={item.label} className="border-t border-iv-wine/15 pt-5">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
                  {item.label}
                </p>
                <p className="mt-2 max-w-[40rem] text-[15px] leading-[1.55] text-iv-ink">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 40 / BUILD */}
      <section className="border-t border-iv-wine/15 px-6 pt-16 pb-20 sm:pt-20">
        <div className="mx-auto max-w-3xl">
          <SectionLabel number="40" label="Build your harness layer" />
          <h2 className="mt-6 font-iv-display text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold leading-[1.08] tracking-[-0.012em] text-iv-wine">
            From init to identity in 5 phases
          </h2>
          <p className="mt-4 max-w-[42rem] text-[1.0625rem] leading-[1.65] text-iv-ink">
            <code className="font-mono text-[15px] text-iv-wine">npx ideaverse-os init</code> scaffolds
            the files with{" "}
            <code className="font-mono text-[15px]">[TODO]</code> placeholders.{" "}
            <code className="font-mono text-[15px] text-iv-wine">/ideaverse-os build</code> runs a
            5-phase interview that compiles your answers into the lean files.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/ideaverse-os"
              className="inline-flex min-h-[44px] items-center rounded-sm bg-iv-wine px-5 py-2.5 font-iv-display text-[1rem] text-iv-cream hover:bg-iv-wine-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
            >
              Get started
            </Link>
            <Link
              href="https://github.com/ktnCodes/ideaverse-os"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center px-5 py-2.5 font-iv-display text-[1rem] text-iv-wine hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
            >
              View on GitHub
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
