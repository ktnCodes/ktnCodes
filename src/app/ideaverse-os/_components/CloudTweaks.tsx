"use client";

import { useEffect, useState } from "react";

type Tweaks = {
  heightPct: number;
  opacity: number;
  sizePx: number;
  posXPx: number;
  posYPx: number;
  insetPx: number;
  radiusPx: number;
  fadeXPct: number;
  bottomFadeStartPct: number;
};

const DEFAULTS: Tweaks = {
  heightPct: 60,
  opacity: 0.9,
  sizePx: 2500,
  posXPx: 0,
  posYPx: -310,
  insetPx: 16,
  radiusPx: 48,
  fadeXPct: 5,
  bottomFadeStartPct: 22,
};

const STORAGE_KEY = "ideaverse-cloud-tweaks-v4";

function applyToRoot(t: Tweaks) {
  const r = document.documentElement.style;
  r.setProperty("--cloud-h", `${t.heightPct}%`);
  r.setProperty("--cloud-opacity", `${t.opacity}`);
  r.setProperty("--cloud-size", `${t.sizePx}px`);
  r.setProperty("--cloud-x", `${t.posXPx}px`);
  r.setProperty("--cloud-y", `${t.posYPx}px`);
  r.setProperty("--cloud-inset", `${t.insetPx}px`);
  r.setProperty("--cloud-radius", `${t.radiusPx}px`);
  r.setProperty("--cloud-fade-x", `${t.fadeXPct}%`);
  r.setProperty("--cloud-bf-start", `${t.bottomFadeStartPct}%`);
}

function isEnabled(): boolean {
  if (typeof window === "undefined") return false;
  if (process.env.NODE_ENV === "development") return true;
  return new URLSearchParams(window.location.search).has("tweak");
}

export function CloudTweaks() {
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(true);
  const [t, setT] = useState<Tweaks>(DEFAULTS);

  useEffect(() => {
    if (!isEnabled()) return;
    setEnabled(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = { ...DEFAULTS, ...JSON.parse(saved) };
        setT(parsed);
        applyToRoot(parsed);
        return;
      } catch {
        // fall through
      }
    }
    applyToRoot(DEFAULTS);
  }, []);

  function update<K extends keyof Tweaks>(key: K, value: Tweaks[K]) {
    const next = { ...t, [key]: value };
    setT(next);
    applyToRoot(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function reset() {
    setT(DEFAULTS);
    applyToRoot(DEFAULTS);
    localStorage.removeItem(STORAGE_KEY);
  }

  function copyCss() {
    const css = `/* Cloud image hero — paste into page.tsx style props */
top/left/right: "${t.insetPx}px",
height: "${t.heightPct}%",
opacity: ${t.opacity},
backgroundSize: "${t.sizePx}px auto",
backgroundPosition: "calc(50% + ${t.posXPx}px) ${t.posYPx}px",
borderRadius: "${t.radiusPx}px",

/* Combined fade overlay (matches image bounds + radius) */
background: "linear-gradient(to right, var(--iv-cream) 0%, transparent ${t.fadeXPct}%, transparent ${100 - t.fadeXPct}%, var(--iv-cream) 100%), linear-gradient(to bottom, transparent 0%, transparent ${t.bottomFadeStartPct}%, color-mix(in oklch, var(--iv-cream) 40%, transparent) 50%, color-mix(in oklch, var(--iv-cream) 80%, transparent) 78%, var(--iv-cream) 100%)",
`;
    navigator.clipboard.writeText(css);
  }

  if (!enabled) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] w-72 border border-iv-wine/40 bg-iv-cream-pale font-sans text-[12px] text-iv-ink"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between border-b border-iv-wine/20 bg-iv-cream-deep px-3 py-2 text-left"
      >
        <span className="font-semibold uppercase tracking-[0.14em] text-iv-wine">
          Cloud tweaks
        </span>
        <span aria-hidden className="text-iv-wine">
          {open ? "_" : "+"}
        </span>
      </button>

      {open && (
        <div className="space-y-3 px-3 py-3">
          <Slider
            label="Height (% of hero)"
            min={10}
            max={90}
            step={1}
            value={t.heightPct}
            onChange={(v) => update("heightPct", v)}
          />
          <Slider
            label="Opacity"
            min={0.2}
            max={1}
            step={0.05}
            value={t.opacity}
            onChange={(v) => update("opacity", v)}
          />
          <Slider
            label="Image size (px wide)"
            min={600}
            max={3200}
            step={20}
            value={t.sizePx}
            onChange={(v) => update("sizePx", v)}
          />
          <Slider
            label="Position X (px, neg = left)"
            min={-400}
            max={400}
            step={5}
            value={t.posXPx}
            onChange={(v) => update("posXPx", v)}
          />
          <Slider
            label="Position Y (px, neg = up)"
            min={-400}
            max={300}
            step={5}
            value={t.posYPx}
            onChange={(v) => update("posYPx", v)}
          />
          <Slider
            label="Inset from page edges (px)"
            min={0}
            max={64}
            step={1}
            value={t.insetPx}
            onChange={(v) => update("insetPx", v)}
          />
          <Slider
            label="Corner radius (px)"
            min={0}
            max={120}
            step={1}
            value={t.radiusPx}
            onChange={(v) => update("radiusPx", v)}
          />
          <Slider
            label="L/R fade (% from edge)"
            min={0}
            max={40}
            step={1}
            value={t.fadeXPct}
            onChange={(v) => update("fadeXPct", v)}
          />
          <Slider
            label="Bottom fade start (% of image)"
            min={0}
            max={90}
            step={1}
            value={t.bottomFadeStartPct}
            onChange={(v) => update("bottomFadeStartPct", v)}
          />

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={copyCss}
              className="flex-1 border border-iv-wine bg-iv-wine px-2 py-1.5 font-semibold uppercase tracking-[0.14em] text-iv-cream hover:bg-iv-wine-deep"
            >
              Copy CSS
            </button>
            <button
              type="button"
              onClick={reset}
              className="border border-iv-wine/40 px-2 py-1.5 text-iv-wine hover:bg-iv-cream-deep"
            >
              Reset
            </button>
          </div>
          <p className="text-[10px] italic text-iv-ink-soft">
            Saved to localStorage. Hidden in production unless ?tweak=1.
          </p>
        </div>
      )}
    </div>
  );
}

function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="font-semibold text-iv-ink">{label}</span>
        <span className="font-mono text-iv-wine">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-iv-wine"
      />
    </label>
  );
}
