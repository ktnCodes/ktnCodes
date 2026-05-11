import type { ReactNode } from 'react';

export type SectionTone = 'light-50' | 'light-100' | 'dark-base' | 'dark-surface';

interface SectionProps {
  /** Two-digit-padded section number for the eyebrow, e.g. '02'. */
  number: string;
  /** Display name shown after the dash in the eyebrow, e.g. 'About'. */
  name: string;
  /** Background tone slot in the locked rhythm. */
  tone?: SectionTone;
  /** Anchor id (defaults to the lowercased name). */
  id?: string;
  className?: string;
  children: ReactNode;
}

const TONE_BG: Record<SectionTone, string> = {
  'light-50': 'bg-background',          // var(--background) = stone-50 in light
  'light-100': 'bg-(--surface-alt)',    // stone-100 alt rhythm in light
  'dark-base': 'bg-background',         // var(--background) = #0c0c0c in dark
  'dark-surface': 'bg-surface',         // #131313 in dark
};

/**
 * Section wrapper for the rhythm system: numbered eyebrow + top hairline +
 * 80-128px vertical padding. Tones cycle stone-50/stone-100 in light mode and
 * #0c0c0c/#131313 in dark mode (the same `--background` / `--surface` tokens
 * resolve differently per theme, so callers just alternate `light-*` /
 * `dark-*` names — but in practice the alternation is defined per page).
 */
export function Section({
  number,
  name,
  tone = 'light-50',
  id,
  className = '',
  children,
}: SectionProps) {
  return (
    <section
      id={id ?? name.toLowerCase().replace(/\s+/g, '-')}
      className={`${TONE_BG[tone]} border-t border-hairline py-(--space-2xl) px-(--space-lg) ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted mb-(--space-md)">
          {number} — {name}
        </p>
        {children}
      </div>
    </section>
  );
}
