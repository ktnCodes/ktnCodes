import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "../../_components/SectionLabel";

export const metadata: Metadata = {
  title: "Optional layers -- ideaverse-os concepts",
  description:
    "Phase 5 of the build interview: Claude hooks, GitHub backup, and WSL paths. Each is opt-in and independent. None are required for the core vault to work.",
};

const layers = [
  {
    id: "claude-hooks",
    name: "Claude hooks",
    available: "Claude Code only",
    what: "Three shell scripts registered in ~/.claude/settings.json: session-start (prints compass on session open), load-memory (injects the last 30 lines of memory.md before every prompt), save-session (logs a one-line session summary to today's daily note via local Ollama).",
    why: "Automates the context-loading you would otherwise type at the start of every session. The LLM always opens with your current priority filter visible.",
    requires: "~/.claude/ directory exists (Claude Code installed)",
    lockFile: "00-agentic-OS/optional-claude-hooks.lock.md",
  },
  {
    id: "github-backup",
    name: "GitHub backup",
    available: "Any harness",
    what: "Creates a private GitHub repo for the vault and pushes the initial baseline. No CI/CD, no public access -- pure backup and cross-device sync.",
    why: "Vaults accumulate years of identity context. A private repo is the simplest off-machine backup that also lets you pull to a second computer.",
    requires: "GitHub CLI (gh) authenticated",
    lockFile: "00-agentic-OS/optional-github.lock.md",
  },
  {
    id: "wsl-paths",
    name: "WSL paths",
    available: "Windows + WSL",
    what: "Fills the platforms.wsl block in paths.json with your Linux-side vault root, workspace root, and shell. Skills that detect the platform via uname will use this block automatically.",
    why: "If you use the vault from both Windows and WSL (e.g., running Node scripts in bash), the two environments need separate absolute paths. Without this block, skills default to the Windows path and break in Linux.",
    requires: "WSL installed and accessible",
    lockFile: "00-agentic-OS/optional-wsl.lock.md",
  },
];

const safetyNotes = [
  "GitHub backup defaults to private. You must explicitly request a public repo.",
  "Git init is skipped if a .git/ directory already exists in the vault.",
  "A .gitignore check runs before any push -- you review what will be committed.",
  "Claude hooks chain with existing hooks by default rather than replacing them.",
  "All three layers write a lock file for your review before any mutation applies.",
];

export default function OptionalLayersPage() {
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

      {/* Header */}
      <section className="px-6 pt-10 pb-16 sm:pt-14 sm:pb-20">
        <div className="mx-auto max-w-3xl">
          <SectionLabel number="50" label="Phase 5" />
          <h1 className="mt-6 font-iv-display text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.015em] text-iv-wine">
            Optional layers.
          </h1>
          <p className="mt-5 max-w-[42rem] text-[1.0625rem] leading-[1.65] text-iv-ink">
            The last build phase. Three independent opt-ins that connect your
            vault to the outside world: automation hooks, off-machine backup,
            and cross-environment paths. Pick any subset, or skip entirely. The
            core vault works without any of them.
          </p>
        </div>
      </section>

      {/* Layer cards */}
      <section className="border-t border-iv-wine/15 px-6 pt-16 pb-20 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <SectionLabel number="10" label="The three layers" />
          <div className="mt-8 space-y-8">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className="border border-iv-wine/20 bg-iv-cream-pale p-6"
              >
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="font-iv-display text-[1.25rem] font-semibold text-iv-wine">
                    {layer.name}
                  </h2>
                  <span className="font-mono text-[11px] text-iv-teal">
                    {layer.available}
                  </span>
                </div>

                <p className="mt-3 text-[15px] leading-[1.6] text-iv-ink">
                  {layer.what}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
                      Why
                    </p>
                    <p className="mt-1 text-[13.5px] leading-[1.55] text-iv-ink-soft">
                      {layer.why}
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
                      Requires
                    </p>
                    <p className="mt-1 font-mono text-[12.5px] text-iv-ink">
                      {layer.requires}
                    </p>
                    <p className="mt-2 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
                      Lock file
                    </p>
                    <p className="mt-1 font-mono text-[12px] text-iv-ink-soft">
                      {layer.lockFile}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it runs */}
      <section className="border-t border-iv-wine/15 px-6 pt-16 pb-20 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <SectionLabel number="20" label="How it runs" />
          <h2 className="mt-5 font-iv-display text-[clamp(1.375rem,3vw,2rem)] font-bold leading-[1.08] tracking-[-0.012em] text-iv-wine">
            Detection first. Lock file before mutation.
          </h2>
          <p className="mt-3 max-w-[42rem] text-[15px] leading-[1.55] text-iv-ink-soft">
            The build interview probes your environment before asking anything.
            It only offers layers your system can actually support.
          </p>

          <div className="mt-6 border border-iv-wine/25 bg-iv-cream-pale">
            <div className="border-b border-iv-wine/15 bg-iv-cream-deep px-4 py-2">
              <span className="font-mono text-[11px] text-iv-wine">
                Phase 5 flow
              </span>
            </div>
            <pre className="overflow-x-auto px-4 py-4 font-mono text-[12px] leading-[1.8] text-iv-ink whitespace-pre">{`detect:
  ~/.claude/ exists?       -> offer Claude hooks
  gh auth status?          -> offer GitHub backup
  WSL_DISTRO_NAME set?     -> offer WSL paths

interview:
  "Which layers to enable? (all / none / pick)"

for each chosen layer:
  compile proposed changes -> write .lock.md
  show diff -> confirm
  promote lock -> apply`}</pre>
          </div>

          <p className="mt-5 max-w-[42rem] text-[15px] leading-[1.55] text-iv-ink-soft">
            Order when picking all three: WSL paths first (local only), then
            Claude hooks (mutates ~/.claude/), then GitHub backup (external
            state). If one fails, the others complete independently.
          </p>
        </div>
      </section>

      {/* Safety */}
      <section className="border-t border-iv-wine/15 px-6 pt-16 pb-20 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <SectionLabel number="30" label="Safety guarantees" />
          <ul className="mt-6 space-y-3">
            {safetyNotes.map((note) => (
              <li
                key={note}
                className="flex items-start gap-3 text-[15px] leading-[1.6] text-iv-ink"
              >
                <span
                  aria-hidden
                  className="mt-[0.2em] shrink-0 font-mono text-[11px] text-iv-wine/50"
                >
                  --
                </span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Terminal */}
      <section className="border-t border-iv-wine/15 px-6 pt-16 pb-20 sm:pt-20">
        <div className="mx-auto max-w-3xl">
          <SectionLabel number="40" label="Run it" />
          <div className="mt-6 border border-iv-wine/25 bg-iv-cream-pale">
            <div className="border-b border-iv-wine/15 bg-iv-cream-deep px-4 py-2">
              <span className="font-mono text-[11px] text-iv-wine">
                terminal
              </span>
            </div>
            <pre className="overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-[1.7] text-iv-ink whitespace-pre">{`# after phases 1-4 are complete:
/ideaverse-os build --phase=optional-layers

# or run all five phases at once:
/ideaverse-os build`}</pre>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/ideaverse-os"
              className="inline-flex min-h-[44px] items-center rounded-sm bg-iv-wine px-5 py-2.5 font-iv-display text-[1rem] text-iv-cream hover:bg-iv-wine-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
            >
              Get started
            </Link>
            <Link
              href="/ideaverse-os/concepts/init-vs-build"
              className="inline-flex min-h-[44px] items-center px-5 py-2.5 font-iv-display text-[1rem] text-iv-wine hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
            >
              How init vs build works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
