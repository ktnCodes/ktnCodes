import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "../../_components/SectionLabel";

export const metadata: Metadata = {
  title: "init vs build -- ideaverse-os concepts",
  description:
    "init scaffolds the skeleton in under 15 seconds. build is the 5-phase interview that compiles your identity into the lean files. Here is what each step does.",
};

const phases = [
  {
    num: "01",
    name: "Compass",
    command: "--phase=compass",
    compiles: "compass.md",
    what: "What you are optimizing for. This week, this month, this quarter. Success metrics. Collision rules when priorities conflict.",
    questions: [
      "What are your top 2-3 bets right now?",
      "For each bet, what does success look like?",
      "When two priorities collide, which wins?",
    ],
  },
  {
    num: "02",
    name: "Identity",
    command: "--phase=identity",
    compiles: "me.md + soul.md",
    what: "Who you are when you sit down to work. Drives, first principles, roles, working style, behavioral rules for every session.",
    questions: [
      "In 2-3 sentences: what drives you?",
      "What are 3-5 load-bearing first principles?",
      "What communication style do you want from the LLM?",
    ],
  },
  {
    num: "03",
    name: "Workflow",
    command: "--phase=workflow",
    compiles: "user.md",
    what: "How you actually work day to day. Which LLM tools you use, your stack, file naming conventions, and daily rhythm.",
    questions: [
      "Which LLM harnesses do you use, and when?",
      "What is your stack? (editor, OS, terminal, knowledge base)",
      "Walk me through a concrete work day.",
    ],
  },
  {
    num: "04",
    name: "Domains",
    command: "--phase=domains",
    compiles: "20- and 30- domain folders",
    what: "How your vault splits across your two main domains. Pick from 6 starter templates or go custom.",
    questions: [
      "Which template fits your mental model?",
      "Domain names -- use the template defaults, or rename?",
    ],
  },
  {
    num: "05",
    name: "Optional layers",
    command: "--phase=optional-layers",
    compiles: "runbook.md, paths.json",
    what: "Opt-in power-ups: Claude session hooks, GitHub private backup, WSL path configuration. All independent, all skippable.",
    questions: [
      "Which hooks do you want: session-start, load-memory, save-session?",
      "GitHub backup repo?",
      "WSL paths to configure?",
    ],
  },
];

const initOutputs = [
  { path: "00-agentic-OS/", desc: "Lean files with [TODO] placeholders" },
  { path: "10-cortex/", desc: "Cortex (knowledge articles) root" },
  { path: "40-raw/", desc: "Ingestion: web clips, youtube, papers" },
  { path: "50-research-library/", desc: "Curated research staging area" },
  { path: "60-skills/", desc: "Bundled skills: build, capture, cortex" },
  { path: "70-daily/", desc: "Daily notes" },
  { path: "80-visualization/", desc: "Attachments and diagrams" },
  { path: "99-archive/", desc: "Compiled raw sources" },
  { path: "CLAUDE.md", desc: "Claude Code convention file" },
  { path: "GEMINI.md", desc: "Gemini CLI convention file" },
  { path: "AGENTS.md", desc: "Codex / OpenAI Assistants convention file" },
  { path: ".cursorrules", desc: "Cursor convention file" },
  { path: ".gitignore", desc: "Privacy-first defaults" },
];

export default function InitVsBuildPage() {
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
            init vs build
          </h1>
          <p className="mt-5 max-w-[42rem] font-iv-display text-[clamp(1.125rem,2vw,1.375rem)] leading-[1.2] text-iv-teal">
            Two steps, one setup. init takes 15 seconds. build takes one conversation.
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {/* init card */}
            <div className="border border-iv-wine/25 bg-iv-cream-pale p-6">
              <div className="flex items-baseline gap-3">
                <code className="font-mono text-[15px] font-semibold text-iv-wine">
                  npx ideaverse-os init
                </code>
              </div>
              <p className="mt-3 text-[15px] leading-[1.55] text-iv-ink">
                Scaffolds the folder skeleton and writes every lean file with{" "}
                <code className="font-mono text-[13px]">[TODO]</code> placeholders.
                No questions. No LLM needed. Just Node 20+.
              </p>
              <div className="mt-4 border-t border-iv-wine/15 pt-4">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
                  Output
                </p>
                <p className="mt-1 font-sans text-[13px] text-iv-ink-soft">
                  29 files, 9 folders, under 15 seconds.
                </p>
              </div>
            </div>

            {/* build card */}
            <div className="border border-iv-wine/25 bg-iv-cream-pale p-6">
              <div className="flex items-baseline gap-3">
                <code className="font-mono text-[15px] font-semibold text-iv-wine">
                  /ideaverse-os build
                </code>
              </div>
              <p className="mt-3 text-[15px] leading-[1.55] text-iv-ink">
                A 5-phase interview. The LLM asks, you answer, it compiles.
                Each phase writes one or two lean files. Skip nothing on the
                first run. Re-run any phase to refresh it later.
              </p>
              <div className="mt-4 border-t border-iv-wine/15 pt-4">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
                  Output
                </p>
                <p className="mt-1 font-sans text-[13px] text-iv-ink-soft">
                  6 lean files with your actual content. No more placeholders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10 / INIT OUTPUTS */}
      <section className="border-t border-iv-wine/15 px-6 pt-16 pb-20 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <SectionLabel number="10" label="What init creates" />
          <h2 className="mt-6 font-iv-display text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold leading-[1.08] tracking-[-0.012em] text-iv-wine">
            The skeleton
          </h2>
          <p className="mt-4 max-w-[42rem] text-[1.0625rem] leading-[1.65] text-iv-ink">
            init is deterministic and non-destructive. If a target file already
            exists, it prompts per-conflict: overwrite, skip, diff, or abort.
            The skeleton is the same for every user -- build is where it becomes
            yours.
          </p>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-iv-wine/20">
                  <th className="pb-3 text-left font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
                    Path
                  </th>
                  <th className="pb-3 text-left font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
                    Purpose
                  </th>
                </tr>
              </thead>
              <tbody>
                {initOutputs.map((row, i) => (
                  <tr
                    key={row.path}
                    className={i % 2 === 0 ? "bg-iv-cream-pale" : "bg-transparent"}
                  >
                    <td className="py-2.5 pr-6 align-top">
                      <code className="font-mono text-[12.5px] text-iv-wine">
                        {row.path}
                      </code>
                    </td>
                    <td className="py-2.5 align-top text-[14px] leading-[1.5] text-iv-ink-soft">
                      {row.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 20 / BUILD PHASES */}
      <section className="border-t border-iv-wine/15 px-6 pt-16 pb-20 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <SectionLabel number="20" label="The 5 build phases" />
          <h2 className="mt-6 font-iv-display text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold leading-[1.08] tracking-[-0.012em] text-iv-wine">
            One question at a time
          </h2>
          <p className="mt-4 max-w-[42rem] text-[1.0625rem] leading-[1.65] text-iv-ink">
            Run all five in order:{" "}
            <code className="font-mono text-[15px] text-iv-wine">/ideaverse-os build</code>.
            Or run any phase independently:{" "}
            <code className="font-mono text-[15px] text-iv-wine">
              /ideaverse-os build --phase=compass
            </code>
            . Each phase follows the lock-file flow: compile to a lock, review,
            confirm, promote.
          </p>

          <div className="mt-10 space-y-0">
            {phases.map((phase) => (
              <div
                key={phase.num}
                className="border-t border-iv-wine/15 py-7"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-[12px] text-iv-wine/60">
                    {phase.num}
                  </span>
                  <span className="font-iv-display text-[1.25rem] font-semibold text-iv-wine">
                    {phase.name}
                  </span>
                  <code className="ml-auto hidden font-mono text-[11px] text-iv-ink-soft sm:block">
                    {phase.command}
                  </code>
                </div>

                <p className="mt-2 max-w-[40rem] text-[15px] leading-[1.55] text-iv-ink">
                  {phase.what}
                </p>

                <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
                    Compiles to
                  </span>
                  <code className="font-mono text-[12.5px] text-iv-wine">
                    {phase.compiles}
                  </code>
                </div>

                <div className="mt-4 space-y-2">
                  {phase.questions.map((q, qi) => (
                    <div
                      key={qi}
                      className="flex items-start gap-2 text-[14px] leading-[1.5] text-iv-ink-soft"
                    >
                      <span className="shrink-0 font-iv-display text-iv-wine not-italic">
                        Q.
                      </span>
                      <span className="italic">{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 30 / LOCK FILE FLOW */}
      <section className="border-t border-iv-wine/15 px-6 pt-16 pb-20 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <SectionLabel number="30" label="The lock-file flow" />
          <h2 className="mt-6 font-iv-display text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold leading-[1.08] tracking-[-0.012em] text-iv-wine">
            Nothing writes without your sign-off
          </h2>
          <p className="mt-4 max-w-[42rem] text-[1.0625rem] leading-[1.65] text-iv-ink">
            Every phase compiles into a{" "}
            <code className="font-mono text-[15px]">.lock.md</code> file first.
            You review the proposed content, then confirm. Only on confirmation
            does the lean file get written. The lock file is deleted on success
            and kept on abort -- so mid-flight sessions are resumable.
          </p>

          <div className="mt-8 border border-iv-wine/25 bg-iv-cream-pale">
            <div className="border-b border-iv-wine/15 bg-iv-cream-deep px-4 py-2">
              <span className="font-mono text-[11px] text-iv-wine">
                lock-file flow (any phase)
              </span>
            </div>
            <pre className="overflow-x-auto px-4 py-4 font-mono text-[12px] leading-[1.7] text-iv-ink whitespace-pre">{`1. Q&A     -- LLM asks one question per turn
2. Compile -- answers -> proposed content
3. Lock    -- writes 00-agentic-OS/<file>.md.lock.md
4. Confirm -- show summary, ask [y]es / [n]o / [d]iff
5. Promote -- copy lock -> <file>.md, delete lock
   Reject  -- revise the affected section, rewrite lock, re-ask`}</pre>
          </div>

          <p className="mt-6 max-w-[42rem] text-[15px] leading-[1.65] text-iv-ink">
            Re-running a phase on an already-compiled file triggers a merge
            flow: the LLM shows what changed and lets you update specific
            sections rather than starting from scratch.
          </p>
        </div>
      </section>

      {/* 40 / GET STARTED */}
      <section className="border-t border-iv-wine/15 px-6 pt-16 pb-20 sm:pt-20">
        <div className="mx-auto max-w-3xl">
          <SectionLabel number="40" label="Get started" />
          <h2 className="mt-6 font-iv-display text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold leading-[1.08] tracking-[-0.012em] text-iv-wine">
            One command to scaffold. One conversation to personalize.
          </h2>

          <div className="mt-8 border border-iv-wine/25 bg-iv-cream-pale">
            <div className="border-b border-iv-wine/15 bg-iv-cream-deep px-4 py-2">
              <span className="font-mono text-[11px] text-iv-wine">terminal</span>
            </div>
            <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-[1.7] text-iv-ink whitespace-pre">{`$ npx ideaverse-os init ~/my-vault

# then open ~/my-vault in Claude Code, Cursor, Codex CLI, or Gemini CLI and run:
/ideaverse-os build`}</pre>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/ideaverse-os"
              className="inline-flex min-h-[44px] items-center rounded-sm bg-iv-wine px-5 py-2.5 font-iv-display text-[1rem] text-iv-cream hover:bg-iv-wine-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
            >
              Back to ideaverse-os
            </Link>
            <Link
              href="/ideaverse-os/concepts/harness-layer"
              className="inline-flex min-h-[44px] items-center px-5 py-2.5 font-iv-display text-[1rem] text-iv-wine hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
            >
              How the harness layer works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
