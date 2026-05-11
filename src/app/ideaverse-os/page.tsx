import type { Metadata } from "next";
import Link from "next/link";
import { CloudTweaks } from "./_components/CloudTweaks";
import { ComparisonTable } from "./_components/ComparisonTable";
import { IDEAVERSE_GRADIENT_TEXT_STYLE } from "./_components/IdeaverseLogo";
import { HarnessSnippets } from "./_components/HarnessSnippets";
import { InlineInstallBar } from "./_components/InlineInstallBar";
import { InterviewTimeline } from "./_components/InterviewTimeline";
import { PositionGrid } from "./_components/PositionGrid";
import { SectionLabel } from "./_components/SectionLabel";
import { TemplateGallery } from "./_components/TemplateGallery";
import { TypingTerminal } from "./_components/TypingTerminal";
import { VaultDemo } from "./_components/VaultDemo";

const installCommand = "npx ideaverse-os init ~/my-vault";

export const metadata: Metadata = {
  title: "ideaverse-os, your knowledge base written by conversation",
  description:
    "Bootstrap a position-addressed, harness-agnostic knowledge vault in one command. Karpathy's wiki pattern with conversational ingestion baked in.",
  openGraph: {
    title: "ideaverse-os",
    description:
      "Your knowledge base, written by conversation. Bootstrap a position-addressed vault with npx ideaverse-os init.",
    type: "website",
    url: "https://ideaverse-os.ktncodes.com",
  },
};

export default function IdeaverseOSPage() {
  return (
    <div className="grain bg-iv-cream pb-32">
      {/* 00 / OVERVIEW (single-column hero, purple-clouds backdrop).
          Section label + version live in the sticky page header above. */}
      <section className="relative isolate overflow-hidden px-6 pt-12 pb-20 sm:pt-16 sm:pb-24">
        {/* Background image: atmospheric banner with rounded corners. CSS vars
            let the dev tweak panel adjust live; fallbacks are the locked-in
            defaults from Kevin's tweak session. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -z-20 overflow-hidden bg-no-repeat"
          style={{
            top: "var(--cloud-top, 0px)",
            left: "var(--cloud-inset, 16px)",
            right: "var(--cloud-inset, 16px)",
            height: "var(--cloud-h, 60%)",
            opacity: "var(--cloud-opacity, 0.9)",
            backgroundImage: "url(/ideaverse-os/purpleclouds.png)",
            backgroundSize: "var(--cloud-size, 2500px) auto",
            backgroundPosition:
              "calc(50% + var(--cloud-x, 0px)) var(--cloud-y, -310px)",
            borderRadius: "var(--cloud-radius, 48px)",
          }}
        />
        {/* Single combined fade overlay: L/R cream edges + vertical fade-to-cream
            in the lower portion. Bounds and radius match the image so all four
            rounded corners stay visually clean. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -z-10"
          style={{
            top: "var(--cloud-top, 0px)",
            left: "var(--cloud-inset, 16px)",
            right: "var(--cloud-inset, 16px)",
            height: "var(--cloud-h, 60%)",
            borderRadius: "var(--cloud-radius, 48px)",
            background:
              "linear-gradient(to right, var(--iv-cream) 0%, transparent var(--cloud-fade-x, 5%), transparent calc(100% - var(--cloud-fade-x, 5%)), var(--iv-cream) 100%), linear-gradient(to bottom, transparent 0%, transparent var(--cloud-bf-start, 22%), color-mix(in oklch, var(--iv-cream) 40%, transparent) 50%, color-mix(in oklch, var(--iv-cream) 80%, transparent) 78%, var(--iv-cream) 100%)",
          }}
        />

        <div className="relative mx-auto max-w-3xl">
          <div className="relative">
            <h1
              className="text-[clamp(2.75rem,6.5vw,4.5rem)] font-bold leading-[1.02]"
              style={IDEAVERSE_GRADIENT_TEXT_STYLE}
            >
              ideaverse-OS
            </h1>

            <p className="mt-4 max-w-[44rem] font-iv-display text-[clamp(1.375rem,2.6vw,2rem)] italic leading-[1.15] text-iv-teal">
              Your knowledge base, written by conversation.
            </p>

            <p className="mt-7 max-w-[44rem] text-[1.0625rem] leading-[1.65] text-iv-ink">
              A position-addressed, harness-agnostic vault, scaffolded in one
              command and shaped by an interview that compiles into your
              purpose, identity, and workflow.
            </p>
          </div>

          <div className="mt-8">
            <InlineInstallBar command={installCommand} />
            <p className="mt-2 font-sans text-[11px] text-iv-ink-soft">
              Node 20+. Click the terminal to copy.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="https://github.com/ktnCodes/ideaverse-os"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center rounded-sm border border-iv-wine bg-transparent px-5 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-iv-wine hover:bg-iv-wine hover:text-iv-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
            >
              View on GitHub
            </Link>
            <Link
              href="/ideaverse-os/concepts/init-vs-build"
              className="inline-flex min-h-[44px] items-center gap-2 px-2 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-iv-wine hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
            >
              Read the docs
              <span aria-hidden>{"-->"}</span>
            </Link>
          </div>

          {/* Vault demo below hero copy */}
          <div className="mt-16">
            <VaultDemo />
          </div>
        </div>
      </section>

      {/* 00 / INSTALL (design kit pattern: 2-col, copy left + terminal right;
          harness snippets table sits underneath) */}
      <section
        id="install"
        className="iv-body-quattro border-t border-iv-wine/15 px-6 pt-20 pb-24 sm:pt-24 sm:pb-28"
      >
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-10">
            {/* Left: copy */}
            <div>
              <SectionLabel number="01" label="Install" />
              <h2 className="mt-6 font-iv-display text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.012em] text-iv-wine">
                One command.
                <br />
                Any harness.
              </h2>
              <p className="mt-5 max-w-[42rem] text-[1.0625rem] leading-[1.6] text-iv-ink">
                The skill is a single npx command. It writes the
                position-addressed scaffold and registers itself with whichever
                LLM tool you already use.
              </p>
            </div>
            {/* Right: terminal */}
            <div>
              <TypingTerminal
                command="npx ideaverse-os@latest init ~/my-vault"
                scaffoldLines={[
                  "  scaffolding ~/my-vault",
                  "  + 00-agentic-OS/",
                  "  + 10-cortex/",
                  "  + 20- ... 99-archive/",
                  "  + CLAUDE.md, .cursorrules, AGENTS.md",
                  "",
                  "  next: open your harness, run /ideaverse-os build",
                ]}
              />
            </div>
          </div>

          {/* Harness snippets table, full width under the install row */}
          <div className="mt-12">
            <HarnessSnippets />
          </div>
        </div>
      </section>

      {/* 02 / WHY */}
      <section
        id="why"
        className="iv-body-quattro border-t border-iv-wine/15 px-6 pt-20 pb-24 sm:pt-24 sm:pb-28"
      >
        <div className="mx-auto max-w-5xl">
          <SectionLabel number="02" label="Why" />
          <h2 className="mt-6 font-iv-display text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.012em] text-iv-wine">
            What does every other system miss?
          </h2>
          <p className="mt-5 max-w-[42rem] text-[1.0625rem] leading-[1.6] text-iv-ink">
            Five systems, one tradeoff each. The comparison is the brand
            argument.
          </p>

          <div className="mt-10">
            <ComparisonTable />
          </div>

          <div className="mt-12">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
              What we kept
            </p>
            <div className="mt-5 grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {[
                {
                  from: "Karpathy",
                  kept: "Raw to wiki rhythm. Ingest cheap, synthesize deliberately.",
                  see: "his recurring thread on personal wikis as memory",
                },
                {
                  from: "Nick Milo",
                  kept: "Position-addressed prefixes (00, 10, 99) so the LLM never has to guess where anything lives.",
                  see: "Linking Your Thinking, Ideaverse-OS template",
                },
                {
                  from: "Tiago Forte",
                  kept: "Domain separation: work, personal, archive as first-class slots.",
                  see: "PARA Method, Building a Second Brain",
                },
                {
                  from: "Cole Medin",
                  kept: "Identity-as-files: who-you-are encoded in markdown the agent reads.",
                  see: "AI Agent Stack templates on GitHub",
                },
              ].map((s) => (
                <div
                  key={s.from}
                  className="border-t border-iv-wine/25 pt-4"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-iv-display text-[1.0625rem] font-semibold text-iv-wine">
                      {s.from}
                    </span>
                    <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
                      source
                    </span>
                  </div>
                  <p className="mt-2 text-[15px] leading-[1.55] text-iv-ink">
                    {s.kept}
                  </p>
                  <p className="mt-2 font-sans text-[12px] italic text-iv-ink-soft">
                    see: {s.see}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-12 max-w-[42rem] text-[1.0625rem] leading-[1.65] text-iv-ink">
              <span className="font-semibold text-iv-wine">
                What we changed.
              </span>{" "}
              A 5-phase interview compiles your purpose, identity, and
              workflow into the lean files. Every harness loads them through
              its own convention file. Capture is one turn, not a multi-step
              workflow.
            </p>
          </div>
        </div>
      </section>

      {/* 03 / WALKTHROUGH */}
      <section
        id="walkthrough"
        className="iv-body-quattro border-t border-iv-wine/15 px-6 pt-20 pb-16 sm:pt-24"
      >
        <div className="mx-auto max-w-3xl">
          <SectionLabel number="03" label="Walkthrough" />
          <h2 className="mt-6 font-iv-display text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.012em] text-iv-wine">
            First the skeleton, then the conversation.
          </h2>
          <p className="mt-5 max-w-[42rem] text-[1.0625rem] leading-[1.6] text-iv-ink">
            <code className="font-mono text-[15px] text-iv-wine">npx ideaverse-os init</code>{" "}
            scaffolds a position-addressed vault. Numbered prefixes mean the LLM
            never has to guess where anything lives.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          <PositionGrid />
        </div>

        <div className="mx-auto mt-20 max-w-3xl">
          <p className="max-w-[42rem] text-[1.0625rem] leading-[1.65] text-iv-ink">
            Then{" "}
            <code className="font-mono text-[15px] text-iv-wine">/ideaverse-os build</code>{" "}
            opens a 5-phase interview. Each phase asks a few questions and
            compiles your answers into one of the lean files. Skip nothing,
            re-run any phase later.
          </p>
        </div>

        <div className="mt-12">
          <InterviewTimeline />
        </div>
      </section>

      {/* 30 / TEMPLATES */}
      <section className="iv-body-quattro border-t border-iv-wine/15 px-6 pt-20 pb-24 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <SectionLabel number="04" label="Templates" />
            <h2 className="mt-6 font-iv-display text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.012em] text-iv-wine">
              Or start from a shape that fits.
            </h2>
            <p className="mt-5 max-w-[42rem] text-[1.0625rem] leading-[1.6] text-iv-ink">
              Phase 4 of the build interview offers six presets plus Custom.
              Each preset names your{" "}
              <code className="font-mono text-[15px]">20-</code> and{" "}
              <code className="font-mono text-[15px]">30-</code> domains. Hover
              a preset to see how the vault tree changes.
            </p>
          </div>
          <div className="mt-12">
            <TemplateGallery />
          </div>

          <div className="mt-10">
            <Link
              href="/ideaverse-os/templates"
              className="inline-flex min-h-[44px] items-center gap-2 font-iv-display text-[1rem] text-iv-wine hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
            >
              See all 6 templates
              <span aria-hidden>{"-->"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 50 / READ FURTHER */}
      <section
        id="concepts"
        className="iv-body-quattro border-t border-iv-wine/15 px-6 pt-20 pb-24 sm:pt-24 sm:pb-28"
      >
        <div className="mx-auto max-w-6xl">
          <div className="max-w-4xl">
            <SectionLabel number="05" label="Read further" />
            <h2 className="mt-6 font-iv-display text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.012em] text-iv-wine">
              Concepts behind the design.
            </h2>
            <p className="mt-5 text-[1.0625rem] leading-[1.6] text-iv-ink">
              Why the architecture works the way it does. Each page covers one
              load-bearing idea.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                href: "/ideaverse-os/concepts/harness-layer",
                eyebrow: "Architecture",
                title: "The harness layer",
                desc: "How every LLM tool loads the same identity files through its own convention.",
              },
              {
                href: "/ideaverse-os/concepts/init-vs-build",
                eyebrow: "Commands",
                title: "init vs build",
                desc: "What each command does, what each phase compiles, and the lock-file flow that keeps both safe.",
              },
              {
                href: "/ideaverse-os/concepts/optional-layers",
                eyebrow: "Phase 5",
                title: "Optional layers",
                desc: "Claude hooks, GitHub backup, and WSL paths. Three opt-ins, each independent.",
              },
              {
                href: "/ideaverse-os/concepts/cortex-frontmatter",
                eyebrow: "Article standard",
                title: "Cortex frontmatter",
                desc: "The required fields, typed-edge sources, and decay rules cortex-lint enforces across 10-cortex/.",
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group flex flex-col rounded-[4px] border border-iv-wine/15 bg-iv-cream-pale px-5 py-[18px] transition-colors duration-150 ease-out hover:border-iv-wine hover:bg-iv-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
              >
                <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-iv-teal">
                  {card.eyebrow}
                </p>
                <h3 className="mt-1.5 font-iv-display text-[17px] font-bold leading-[1.25] text-iv-wine">
                  {card.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-[1.55] text-iv-ink-soft">
                  {card.desc}
                </p>
                <p className="mt-auto pt-3.5 font-mono text-[11px] tracking-[0.08em] text-iv-wine">
                  Read {"-->"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-iv-wine/15 px-6 pt-10 pb-16">
        <div className="mx-auto max-w-3xl">
          <div className="-mx-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <Link
              href="https://github.com/ktnCodes/ideaverse-os"
              className="inline-flex min-h-[44px] items-center px-3 py-2.5 font-iv-display text-[1rem] text-iv-wine hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
            <Link
              href="https://www.npmjs.com/package/ideaverse-os"
              className="inline-flex min-h-[44px] items-center px-3 py-2.5 font-iv-display text-[1rem] text-iv-wine hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
              target="_blank"
              rel="noopener noreferrer"
            >
              npm
            </Link>
            <Link
              href="https://ktncodes.com"
              className="inline-flex min-h-[44px] items-center px-3 py-2.5 font-iv-display text-[1rem] text-iv-wine hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
            >
              ktncodes.com
            </Link>
          </div>
          <p className="mt-6 font-sans text-[12px] text-iv-ink-soft">
            Built by{" "}
            <a
              href="https://ktncodes.com"
              className="text-iv-wine hover:underline"
            >
              Kevin Nguyen
            </a>
            . MIT licensed. Position-addressed since 2026.
          </p>
        </div>
      </footer>

      <CloudTweaks />
    </div>
  );
}
