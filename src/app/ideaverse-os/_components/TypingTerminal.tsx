"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  command: string;
  scaffoldLines?: string[];
  prompt?: string;
  ariaLabel?: string;
};

const TYPE_DURATION_MS = 700;
const SCAFFOLD_STAGGER_MS = 120;
const SCAFFOLD_DELAY_MS = 240;
const COPY_RESET_MS = 2000;
const FAILED_RESET_MS = 3500;

export function TypingTerminal({
  command,
  scaffoldLines = [],
  prompt = "$",
  ariaLabel = "Install command. Click to copy.",
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [typed, setTyped] = useState(0);
  const [scaffoldRevealed, setScaffoldRevealed] = useState(0);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const [reducedMotion, setReducedMotion] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || started) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    if (reducedMotion) {
      setTyped(command.length);
      setScaffoldRevealed(scaffoldLines.length);
      return;
    }
    let raf = 0;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / TYPE_DURATION_MS);
      const eased = 1 - Math.pow(1 - t, 4);
      setTyped(Math.floor(eased * command.length));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTyped(command.length);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, reducedMotion, command]);

  useEffect(() => {
    if (!started || reducedMotion) return;
    if (typed < command.length) return;
    const timers = scaffoldLines.map((_, i) =>
      window.setTimeout(() => {
        setScaffoldRevealed((prev) => Math.max(prev, i + 1));
      }, SCAFFOLD_DELAY_MS + i * SCAFFOLD_STAGGER_MS),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [started, reducedMotion, typed, command.length, scaffoldLines]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), COPY_RESET_MS);
    } catch {
      setCopyState("failed");
      window.setTimeout(() => setCopyState("idle"), FAILED_RESET_MS);
    }
  };

  const visibleCommand = command.slice(0, typed);
  const showCaret = started && !reducedMotion && typed < command.length;
  const copyLabel =
    copyState === "copied"
      ? "copied"
      : copyState === "failed"
        ? "select manually"
        : "copy";

  return (
    <div
      ref={containerRef}
      className="not-prose overflow-hidden rounded-lg border border-iv-wine/30 text-iv-cream"
      style={{ backgroundColor: "#1a1a1f" }}
    >
      <div className="flex items-center justify-between border-b border-iv-cream/10 px-5 py-2.5">
        <div className="flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-iv-cream/60">
          <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-iv-amber" />
          <span>terminal</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copyState === "copied" ? "Install command copied" : "Copy install command"}
          className="inline-flex min-h-[32px] items-center rounded-[4px] border border-iv-wine/40 bg-transparent px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-iv-wine transition-colors hover:bg-iv-wine hover:text-iv-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
        >
          {copyLabel}
        </button>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={ariaLabel}
        className="block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
      >
        <div className="overflow-x-auto px-5 py-5 font-mono text-[15px] leading-6 text-iv-cream">
          <span className="text-iv-amber">{prompt}</span>{" "}
          <span>{visibleCommand}</span>
          {showCaret ? (
            <span
              aria-hidden
              className="ml-0.5 inline-block h-[1.05em] w-[0.55ch] -translate-y-[1px] bg-iv-cream align-middle animate-caret-blink"
            />
          ) : null}
        </div>
      </button>
      {scaffoldLines.length > 0 ? (
        <div className="overflow-x-auto border-t border-iv-cream/10 px-5 py-4 font-mono text-[12.5px] leading-[1.55] whitespace-pre text-iv-cream/75">
          {scaffoldLines.map((line, i) => (
            <div
              key={i}
              className="transition-opacity duration-500"
              style={{
                opacity: i < scaffoldRevealed ? 1 : 0,
                visibility: i < scaffoldRevealed ? "visible" : "hidden",
                minHeight: "1.55em",
              }}
            >
              {line || " "}
            </div>
          ))}
        </div>
      ) : null}
      <div aria-live="polite" className="sr-only">
        {copyState === "copied"
          ? "Install command copied to clipboard"
          : copyState === "failed"
            ? "Copy failed. Please select the command manually."
            : ""}
      </div>
    </div>
  );
}
