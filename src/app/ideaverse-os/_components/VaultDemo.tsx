"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Folder = {
  num: string;
  name: string;
  highlightOnTarget?: boolean;
  highlightOnCortex?: boolean;
};

const folders: Folder[] = [
  { num: "00", name: "agentic-OS" },
  { num: "10", name: "cortex", highlightOnCortex: true },
  { num: "20", name: "work" },
  { num: "30", name: "personal" },
  { num: "40", name: "raw", highlightOnTarget: true },
  { num: "50", name: "research-library" },
  { num: "60", name: "skills" },
  { num: "70", name: "daily" },
  { num: "80", name: "visualization" },
  { num: "99", name: "archive" },
];

type IngestEvent = {
  id: string;
  label: string;
  kind: "youtube" | "webclip" | "note";
  newCortexArticle: string;
};

const events: IngestEvent[] = [
  {
    id: "yt-karpathy",
    label: "yt: Karpathy on raw to wiki",
    kind: "youtube",
    newCortexArticle: "karpathy-raw-to-wiki-pattern.md",
  },
  {
    id: "web-milo",
    label: "web-clip: Milo on PARA",
    kind: "webclip",
    newCortexArticle: "para-vs-position-addressed.md",
  },
  {
    id: "note-learned",
    label: "I learned: cortex-connect",
    kind: "note",
    newCortexArticle: "cortex-connect-deep-dive.md",
  },
];

type CortexFile = { id: number; name: string };

const initialCortexFiles: CortexFile[] = [
  { id: 1, name: "karpathy-pattern.md" },
  { id: 2, name: "position-addressed-memory.md" },
  { id: 3, name: "conversational-ingestion.md" },
];

const PHASE_TIMINGS = {
  appear: 0,
  drop: 800,
  routeStart: 1800,
  folderPulse: 2200,
  cortexPulse: 3000,
  newArticle: 3400,
  betweenFiles: 5400,
};

function FileGlyph({ kind }: { kind: IngestEvent["kind"] }) {
  if (kind === "youtube") {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
        <rect x="1" y="3" width="14" height="10" rx="1.5" fill="currentColor" opacity="0.18" />
        <path d="M7 6.5 L11 8 L7 9.5 Z" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "webclip") {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
        <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M2 8 H14 M8 1.5 C10 4 10 12 8 14.5 M8 1.5 C6 4 6 12 8 14.5" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
      <rect x="3" y="2.5" width="10" height="11" rx="0.5" fill="currentColor" opacity="0.18" />
      <path d="M5 6 H11 M5 8 H11 M5 10 H9" stroke="currentColor" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

function FolderRow({
  folder,
  pulseTarget,
  pulseCortex,
}: {
  folder: Folder;
  pulseTarget: boolean;
  pulseCortex: boolean;
}) {
  const isPulsing =
    (folder.highlightOnTarget && pulseTarget) ||
    (folder.highlightOnCortex && pulseCortex);
  return (
    <li
      className={`flex items-center gap-2 px-3 py-1.5 transition-colors duration-300 ${
        isPulsing ? "bg-iv-rose/40" : ""
      }`}
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-iv-wine/70" aria-hidden>
        <path
          d="M2 4.5 C2 3.7 2.7 3 3.5 3 H6 L7.5 4.5 H12.5 C13.3 4.5 14 5.2 14 6 V11.5 C14 12.3 13.3 13 12.5 13 H3.5 C2.7 13 2 12.3 2 11.5 Z"
          fill="currentColor"
          opacity={isPulsing ? "0.85" : "0.5"}
        />
      </svg>
      <span
        className={`font-mono text-[12px] tabular-nums ${
          isPulsing ? "text-iv-wine" : "text-iv-ink"
        }`}
      >
        {folder.num}-{folder.name}/
      </span>
    </li>
  );
}

export function VaultDemo() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [animActiveIdx, setAnimActiveIdx] = useState(-1);
  const [pulseTarget, setPulseTarget] = useState(false);
  const [pulseCortex, setPulseCortex] = useState(false);
  const [cortexFiles, setCortexFiles] = useState<CortexFile[]>(initialCortexFiles);
  const articleCounterRef = useRef<number>(initialCortexFiles.length);
  const [inView, setInView] = useState(false);
  const reducedMotion = useReducedMotion();
  // Derive active index: when the section is off-screen or the user prefers
  // reduced motion, force -1 (no row highlighted) without a setState-in-effect.
  const activeIdx = !inView || reducedMotion ? -1 : animActiveIdx;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setInView(entry.isIntersecting));
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || reducedMotion) return;

    let cancelled = false;
    let idx = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const runCycle = () => {
      if (cancelled) return;
      const event = events[idx];
      setAnimActiveIdx(idx);
      setPulseTarget(false);
      setPulseCortex(false);

      timers.push(
        setTimeout(() => !cancelled && setPulseTarget(true), PHASE_TIMINGS.folderPulse),
      );
      timers.push(
        setTimeout(() => !cancelled && setPulseCortex(true), PHASE_TIMINGS.cortexPulse),
      );
      timers.push(
        setTimeout(() => {
          if (cancelled) return;
          articleCounterRef.current += 1;
          const newEntry: CortexFile = {
            id: articleCounterRef.current,
            name: event.newCortexArticle,
          };
          setCortexFiles((prev) => {
            const deduped = prev.filter((f) => f.name !== newEntry.name);
            return [newEntry, ...deduped].slice(0, 4);
          });
        }, PHASE_TIMINGS.newArticle),
      );
      timers.push(
        setTimeout(() => {
          if (cancelled) return;
          setPulseTarget(false);
          setPulseCortex(false);
          idx = (idx + 1) % events.length;
          runCycle();
        }, PHASE_TIMINGS.betweenFiles),
      );
    };

    timers.push(setTimeout(runCycle, 400));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView, reducedMotion]);

  const activeEvent = activeIdx >= 0 ? events[activeIdx] : null;

  return (
    <div ref={containerRef} className="w-full">
      {/* Window */}
      <div className="relative overflow-hidden border border-iv-wine/25 bg-iv-cream-pale">
        {/* Title bar */}
        <header className="flex items-center justify-between border-b border-iv-wine/15 bg-iv-cream-deep px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span aria-hidden className="block h-2.5 w-2.5 rounded-full bg-iv-wine" />
            <span aria-hidden className="block h-2.5 w-2.5 rounded-full bg-iv-amber" />
            <span aria-hidden className="block h-2.5 w-2.5 rounded-full bg-iv-teal" />
          </div>
          <div className="font-mono text-[11.5px] text-iv-ink-soft">~/my-vault</div>
          <div className="w-12" aria-hidden />
        </header>

        {/* Body: sidebar + main + drop overlay */}
        <div className="relative grid grid-cols-[160px_1fr] sm:grid-cols-[180px_1fr]">
          {/* Sidebar */}
          <aside className="border-r border-iv-wine/15 py-2">
            <div className="px-3 pb-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
              Vault
            </div>
            <ul>
              {folders.map((f) => (
                <FolderRow
                  key={f.num}
                  folder={f}
                  pulseTarget={pulseTarget}
                  pulseCortex={pulseCortex}
                />
              ))}
            </ul>
          </aside>

          {/* Main pane */}
          <main className="relative min-h-[280px] py-2">
            <div className="flex items-center justify-between border-b border-iv-wine/10 px-4 pb-2">
              <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
                10-cortex /
              </div>
              <div className="font-sans text-[10.5px] text-iv-ink-soft tabular-nums">
                {cortexFiles.length} articles
              </div>
            </div>
            <ul className="px-2 pt-1">
              <AnimatePresence initial={false}>
                {cortexFiles.map((file, i) => (
                  <motion.li
                    key={file.id}
                    initial={i === 0 ? { opacity: 0, x: -16, backgroundColor: "rgba(155,63,77,0.18)" } : false}
                    animate={{ opacity: 1, x: 0, backgroundColor: "rgba(155,63,77,0)" }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], backgroundColor: { duration: 1.2 } }}
                    className="flex items-center gap-2 px-2 py-1.5"
                  >
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-iv-wine/70" aria-hidden>
                      <path d="M3 2 H10 L13 5 V14 H3 Z M10 2 V5 H13" fill="none" stroke="currentColor" strokeWidth="1" />
                    </svg>
                    <span className="font-mono text-[11.5px] text-iv-ink truncate">{file.name}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </main>

          {/* Drop overlay (across full body, above content) */}
          <AnimatePresence>
            {activeEvent ? (
              <motion.div
                key={activeEvent.id}
                initial={{ opacity: 0, y: -30 }}
                animate={{
                  opacity: [0, 1, 1, 1, 0.85, 0],
                  y: [-30, 24, 60, 90, 130, 145],
                  x: [0, 0, 0, 0, -100, -150],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 3.6,
                  times: [0, 0.18, 0.4, 0.55, 0.85, 1],
                  ease: "easeOut",
                }}
                className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2"
              >
                <div className="flex items-center gap-2 border border-iv-wine bg-iv-wine px-3 py-2">
                  <span className="text-iv-cream">
                    <FileGlyph kind={activeEvent.kind} />
                  </span>
                  <span className="font-mono text-[11.5px] font-medium text-iv-cream whitespace-nowrap">
                    {activeEvent.label}
                  </span>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Status bar */}
        <footer className="flex items-center justify-between border-t border-iv-wine/15 bg-iv-cream-deep px-4 py-1.5">
          <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-wine/70">
            ideaverse-capture
          </div>
          <div className="font-mono text-[10.5px] text-iv-ink-soft">
            {activeEvent ? `routing: ${activeEvent.kind}` : "watching"}
          </div>
        </footer>
      </div>
    </div>
  );
}
