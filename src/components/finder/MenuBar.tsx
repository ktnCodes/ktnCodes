'use client';

import { useEffect, useState } from 'react';

/**
 * macOS menu bar inside MacChrome. Renders Apple logo, the active app
 * name, decorative menu items, and the user's local day + time on the
 * right (updating every minute). Server renders an empty time slot to
 * avoid hydration mismatch.
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
    <div className="finder-menubar">
      <span className="finder-menubar-apple" aria-hidden>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 12.04c-.03-3.1 2.53-4.59 2.65-4.66-1.45-2.11-3.7-2.4-4.5-2.43-1.92-.19-3.74 1.13-4.71 1.13-.98 0-2.47-1.11-4.07-1.08-2.09.03-4.03 1.22-5.1 3.1-2.18 3.77-.56 9.36 1.56 12.43 1.04 1.5 2.27 3.18 3.87 3.12 1.55-.06 2.14-1 4.02-1 1.87 0 2.4 1 4.04.97 1.67-.03 2.72-1.51 3.74-3.02 1.18-1.73 1.67-3.41 1.7-3.5-.04-.02-3.25-1.25-3.2-4.96zM14.06 3.96c.86-1.04 1.43-2.49 1.28-3.92-1.23.05-2.73.82-3.62 1.86-.8.92-1.5 2.4-1.31 3.79 1.37.1 2.78-.7 3.65-1.73z" />
        </svg>
      </span>
      <span className="finder-menubar-app">Developer</span>
      <span className="finder-menubar-item">File</span>
      <span className="finder-menubar-item">Edit</span>
      <span className="finder-menubar-item">View</span>
      <span className="finder-menubar-item">Go</span>
      <span className="finder-menubar-item">Window</span>
      <span className="finder-menubar-item">Help</span>
      <span className="finder-menubar-spacer" />
      <span className="finder-menubar-status" title="search" aria-hidden>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <span className="finder-menubar-status" title="control center" aria-hidden>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="6" cy="6" r="2.4" />
          <circle cx="14" cy="6" r="2.4" />
          <circle cx="6" cy="14" r="2.4" />
          <circle cx="14" cy="14" r="2.4" />
        </svg>
      </span>
      <span
        suppressHydrationWarning
        className="finder-menubar-clock"
      >
        {now}
      </span>
    </div>
  );
}
