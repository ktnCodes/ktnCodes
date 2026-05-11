'use client';

import { useDevMode } from './useDevMode';

/**
 * Tiny pill in the bottom-left of the screen that signals inline editing is
 * active. Click any text or image with a hover outline to edit. Renders
 * nothing in production builds.
 */
export function DevModeBadge() {
  const dev = useDevMode();
  if (!dev) return null;
  return (
    <div
      className="fixed bottom-(--space-sm) left-(--space-sm) z-40 inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] font-bold rounded-full border border-amber-300 bg-amber-100 text-amber-900 px-2 py-1 shadow-md"
      title="Inline editing is on. Click any highlighted text/image to edit. Saves to disk on blur."
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      Dev edit mode
    </div>
  );
}
