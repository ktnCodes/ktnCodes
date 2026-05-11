"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

type Phase = {
  num: number;
  name: string;
  intent: string;
  compilesTo: string;
  questions: string[];
  compiledFragment: { lang: string; body: string };
};

const phases: Phase[] = [
  {
    num: 1,
    name: "Compass",
    intent: "What you are optimizing for. This week, this month, this quarter.",
    compilesTo: "compass.md",
    questions: [
      "For each of those priorities, what's the success metric? How will you know you succeeded vs. just stayed busy?",
      "When two priorities collide, say a work emergency and a personal goal, which wins? Is there a rule, or does it go case-by-case?",
    ],
    compiledFragment: {
      lang: "compass.md",
      body: `## What I'm Optimizing For

### This week
- Top bet: ship the build interview
- Success metric: 1 user runs the 5 phases end-to-end

### When priorities collide
work-emergency wins, log the swap in 70-daily/.`,
    },
  },
  {
    num: 2,
    name: "Identity",
    intent: "Who you are when you sit down to work.",
    compilesTo: "me.md",
    questions: [
      "In 2-3 sentences: what drives you? What are you building toward over the next 1-2 years?",
      "What are you known for among people who know you well? What do they come to you for?",
    ],
    compiledFragment: {
      lang: "me.md",
      body: `## What drives me
Building tools that compound my own work and other
people's. The agentic-OS pattern.

## Known for
Receipts-first. Honest pushback. Bridging embedded
depth with AI-tooling depth.`,
    },
  },
  {
    num: 3,
    name: "Workflow",
    intent: "How you actually work, day to day.",
    compilesTo: "user.md",
    questions: [
      "Which LLM harnesses do you use? Claude Code, Cursor, Codex CLI, Gemini CLI, ChatGPT web, Claude.ai web, Copilot CLI, other. For each, when do you reach for it?",
      "Which is your primary, the one you spend the most time in?",
    ],
    compiledFragment: {
      lang: "user.md",
      body: `## Harnesses
Primary: Claude Code (Sonnet 4.6 for build, Opus 4.7
for design and planning).
Secondary: Cursor for refactors, Codex CLI for one-shots.

## Daily rhythm
06:30 /work-daily-note  ->  deep work 07:00-12:00`,
    },
  },
  {
    num: 4,
    name: "Domains",
    intent: "How your life splits across folders 20- and 30-.",
    compilesTo: "20-<your-domain>/, 30-<your-domain>/",
    questions: [
      "Which template fits your mental model? Work plus personal, creative, researcher plus builder, trader, day-job plus side-project, solo, or custom?",
      "Default name for your second domain is the template default. Use that, or rename?",
    ],
    compiledFragment: {
      lang: "domains.lock",
      body: `template: work-personal

my-vault/
+-- 20-work/        day job: AutoPath, Mytra
+-- 30-personal/    career, portfolio, learning`,
    },
  },
  {
    num: 5,
    name: "Optional layers",
    intent: "Hooks, GitHub backup, WSL paths. All opt-in.",
    compilesTo: "00-agentic-OS/runbook.md, paths.json",
    questions: [
      "You'll get three hooks: session-start (loads compass on every new session), load-memory (injects the lean files), save-session (logs transcripts). Confirm all three, or pick a subset?",
    ],
    compiledFragment: {
      lang: "runbook.md",
      body: `## Session starts

| Trigger      | Chain                |
|--------------|----------------------|
| Mon-Fri AM   | /work-daily-note     |
| Weekend PM   | /personal-daily-note |
| Sunday PM    | /weekly-review       |`,
    },
  },
];

const PHASE_COUNT = phases.length;

export function InterviewTimeline() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [containerReady, setContainerReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    scrollContainerRef.current = document.querySelector(
      "[data-iv-scroll]",
    ) as HTMLElement | null;
    setContainerReady(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerReady ? scrollContainerRef : undefined,
    offset: ["start start", "end end"],
  });

  // Map progress 0..1 to phase index 0..PHASE_COUNT-1
  const phaseProgress = useTransform(
    scrollYProgress,
    [0, 1],
    [0, PHASE_COUNT],
  );

  useMotionValueEvent(phaseProgress, "change", (v) => {
    const idx = Math.min(PHASE_COUNT - 1, Math.max(0, Math.floor(v)));
    setActiveIndex(idx);
  });

  return (
    <>
      {/* Mobile and reduced-motion: stacked vertical layout */}
      <div className="md:hidden">
        <StackedTimeline />
      </div>

      {/* Desktop pinned-scroll experience */}
      <div
        ref={sectionRef}
        className="relative hidden md:block"
        style={{ position: "relative", height: `${PHASE_COUNT * 45}vh` }}
        aria-hidden={reducedMotion ? true : undefined}
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="mx-auto grid w-full max-w-5xl grid-cols-[minmax(220px,260px)_1fr] gap-12 px-6">
            {/* Left: phase indicator */}
            <ol className="flex flex-col gap-1 border-l border-iv-wine/20 pl-6">
              {phases.map((phase, i) => {
                const isActive = i === activeIndex;
                const isPast = i < activeIndex;
                return (
                  <li key={phase.num} className="relative py-2">
                    <span
                      aria-hidden
                      className={`absolute -left-[31px] top-1/2 inline-block h-2 w-2 -translate-y-1/2 rounded-full transition-colors duration-300 ${
                        isActive
                          ? "bg-iv-wine ring-4 ring-iv-wine/15"
                          : isPast
                            ? "bg-iv-wine/60"
                            : "bg-iv-wine/15"
                      }`}
                    />
                    <div
                      className={`flex items-baseline gap-3 transition-opacity duration-300 ${
                        isActive ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      <span className="font-mono text-[12px] text-iv-wine">
                        0{phase.num}
                      </span>
                      <span
                        className={`font-iv-display text-[1.125rem] ${
                          isActive ? "text-iv-wine" : "text-iv-ink-soft"
                        }`}
                      >
                        {phase.name}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* Right: active phase content */}
            <div className="relative min-h-[360px]">
              {phases.map((phase, i) => (
                <motion.div
                  key={phase.num}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{
                    opacity: i === activeIndex ? 1 : 0,
                    y: i === activeIndex ? 0 : 12,
                  }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                  style={{
                    pointerEvents: i === activeIndex ? "auto" : "none",
                  }}
                  aria-hidden={i !== activeIndex}
                >
                  <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
                    Phase 0{phase.num}
                  </div>
                  <h3 className="mt-3 font-iv-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.012em] text-iv-wine">
                    {phase.name}
                  </h3>
                  <p className="mt-3 max-w-[34rem] text-[1.0625rem] leading-[1.55] text-iv-ink">
                    {phase.intent}
                  </p>
                  <div className="mt-7 space-y-4">
                    {phase.questions.map((q, qi) => (
                      <blockquote
                        key={qi}
                        className="border-l-0 border-t border-iv-wine/20 pt-4 font-iv-display text-[1.125rem] leading-[1.4] text-iv-ink"
                      >
                        <span className="text-iv-wine">Q.</span>{" "}
                        <span className="italic">{q}</span>
                      </blockquote>
                    ))}
                  </div>
                  <div className="mt-6 max-w-[34rem] border border-iv-wine/25 bg-iv-cream-pale">
                    <div className="flex items-center justify-between border-b border-iv-wine/15 bg-iv-cream-deep px-3 py-1.5">
                      <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-wine/65">
                        compiles to
                      </span>
                      <span className="font-mono text-[11px] text-iv-wine">
                        {phase.compiledFragment.lang}
                      </span>
                    </div>
                    <pre className="overflow-x-auto px-4 py-3 font-mono text-[11.5px] leading-[1.6] text-iv-ink whitespace-pre">
                      {phase.compiledFragment.body}
                    </pre>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StackedTimeline() {
  return (
    <ol className="space-y-8 border-l border-iv-wine/20 pl-6">
      {phases.map((phase) => (
        <li key={phase.num} className="relative">
          <span
            aria-hidden
            className="absolute -left-[31px] top-1.5 inline-block h-2 w-2 rounded-full bg-iv-wine"
          />
          <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
            Phase 0{phase.num}
          </div>
          <h3 className="mt-1.5 font-iv-display text-[1.5rem] font-bold leading-[1.1] tracking-[-0.012em] text-iv-wine">
            {phase.name}
          </h3>
          <p className="mt-2 text-[15px] leading-[1.55] text-iv-ink">
            {phase.intent}
          </p>
          <div className="mt-4 space-y-3">
            {phase.questions.map((q, qi) => (
              <blockquote
                key={qi}
                className="border-t border-iv-wine/20 pt-3 font-iv-display text-[1rem] italic leading-[1.45] text-iv-ink"
              >
                <span className="not-italic text-iv-wine">Q.</span> {q}
              </blockquote>
            ))}
          </div>
          <div className="mt-3 border border-iv-wine/25 bg-iv-cream-pale">
            <div className="flex items-center justify-between border-b border-iv-wine/15 bg-iv-cream-deep px-3 py-1.5">
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-wine/65">
                compiles to
              </span>
              <span className="font-mono text-[11px] text-iv-wine">
                {phase.compiledFragment.lang}
              </span>
            </div>
            <pre className="overflow-x-auto px-3 py-2.5 font-mono text-[11px] leading-[1.55] text-iv-ink whitespace-pre">
              {phase.compiledFragment.body}
            </pre>
          </div>
        </li>
      ))}
    </ol>
  );
}
