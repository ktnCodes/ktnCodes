'use client';

import { useEffect, useState } from 'react';

/**
 * Mac menu bar inside MacChrome. Renders the user's current local day +
 * time on the right (like macOS does), updating every minute. Server
 * renders an empty string for that slot to avoid hydration mismatch.
 */
export function MenuBar() {
  const [now, setNow] = useState<string>('');

  useEffect(() => {
    function tick() {
      const d = new Date();
      const dow = d.toLocaleDateString(undefined, { weekday: 'short' });
      const time = d.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
      });
      setNow(`${dow} ${time}`);
    }
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="absolute top-0 inset-x-0 flex items-center gap-4 px-4 py-1.5 text-[12px] text-white/95 backdrop-blur-md"
      style={{ background: 'rgba(255,255,255,0.08)' }}
    >
      <span aria-hidden></span>
      <span className="font-semibold">Finder</span>
      <span className="opacity-80">File</span>
      <span className="opacity-80">Edit</span>
      <span className="opacity-80">View</span>
      <span className="opacity-80">Go</span>
      <span className="opacity-80">Window</span>
      <span className="opacity-80">Help</span>
      <span
        suppressHydrationWarning
        className="ml-auto opacity-80 font-mono text-[11px] tabular-nums"
      >
        {now}
      </span>
    </div>
  );
}
