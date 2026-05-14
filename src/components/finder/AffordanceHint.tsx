'use client';

/**
 * Floating pill that appears above the dock when the Finder window is
 * closed or minimized -- tells visitors the desktop is interactive.
 */
export function AffordanceHint({ visible }: { visible: boolean }) {
  return (
    <div className={`finder-hint ${visible ? '' : 'hidden'}`} aria-hidden={!visible}>
      <div className="finder-hint-pill">
        Click <strong>Finder</strong> in the dock to explore the workspace
      </div>
      <svg
        className="finder-hint-arrow"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="19 12 12 19 5 12" />
      </svg>
    </div>
  );
}
