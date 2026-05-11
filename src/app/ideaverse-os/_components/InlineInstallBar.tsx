"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  command?: string;
};

const TYPE_DURATION_MS = 700;
const COPY_RESET_MS = 2000;

export function InlineInstallBar({
  command = "npx ideaverse-os init ~/my-vault",
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [typed, setTyped] = useState(0);
  const [copied, setCopied] = useState(false);
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
    const el = ref.current;
    if (!el || started) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
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
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / TYPE_DURATION_MS);
      const eased = 1 - Math.pow(1 - t, 4);
      setTyped(Math.floor(eased * command.length));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTyped(command.length);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, reducedMotion, command]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), COPY_RESET_MS);
    } catch {
      // ignore
    }
  };

  const visible = command.slice(0, typed);
  const showCaret = started && !reducedMotion && typed < command.length;

  return (
    <div
      ref={ref}
      className="relative max-w-[600px]"
      style={{ marginTop: "4px" }}
    >
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Install command. Click to copy."
        className="block w-full cursor-pointer select-all rounded-lg border border-iv-wine/30 px-4 py-2.5 text-left font-mono text-[15px] leading-6 text-iv-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
        style={{ backgroundColor: "#1a1a1f" }}
      >
        <span className="text-iv-amber" aria-hidden>
          $
        </span>
        <span className="ml-1.5">{visible}</span>
        {showCaret ? (
          <span
            aria-hidden
            className="ml-0.5 inline-block h-[1em] w-[0.55ch] -translate-y-[1px] bg-iv-amber align-middle animate-caret-blink"
          />
        ) : null}
      </button>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Install command copied" : "Copy install command"}
        className="absolute right-2.5 top-2.5 rounded-[4px] border border-iv-wine/40 bg-transparent px-2 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-iv-wine transition-colors hover:bg-iv-wine hover:text-iv-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
      >
        {copied ? "copied" : "copy"}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Install command copied to clipboard" : ""}
      </span>
    </div>
  );
}
