'use client';

import { useState } from 'react';
import { useFinderWindowController } from './finder-window-controller';
import { useChatContext } from '@/components/chat/chat-context';
import { MailModal } from './MailModal';

/**
 * macOS-style dock. Finder toggles its window. Mail opens the contact
 * modal. Terminal scrolls up to the chat panel in BrandBand and opens it.
 * Trash is decorative.
 */
export function Dock() {
  const ctrl = useFinderWindowController();
  const { openWith } = useChatContext();
  const [mailOpen, setMailOpen] = useState(false);

  const finderState = ctrl?.state ?? 'open';
  const finderRunning = finderState !== 'closed';
  const finderAttention = finderState === 'closed';

  function onFinderClick() {
    if (!ctrl) return;
    if (finderState === 'open' || finderState === 'fullscreen') {
      ctrl.minimize();
    } else {
      ctrl.open();
    }
  }

  function onMailClick() {
    setMailOpen((o) => !o);
  }

  function onTerminalClick() {
    openWith();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      <div className="finder-dock" role="toolbar" aria-label="dock">
        <DockApp
          label="Finder"
          gradient="linear-gradient(135deg,#5dc1ff,#0a84ff)"
          onClick={onFinderClick}
          running={finderRunning}
          attention={finderAttention}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </DockApp>

        <DockApp
          label="Mail"
          gradient="linear-gradient(135deg,#7a5af8,#3b2eb8)"
          onClick={onMailClick}
          running={mailOpen}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22 6 12 13 2 6" />
          </svg>
        </DockApp>

        <DockApp
          label="Terminal"
          gradient="linear-gradient(135deg,#3c3c3e,#0a0a0b)"
          onClick={onTerminalClick}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
        </DockApp>

        <span className="finder-dock-sep" aria-hidden />

        <DockApp
          label="Trash"
          gradient="rgba(255,255,255,0.32)"
          onClick={() => {
            /* decorative */
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6 17.3 20.2A2 2 0 0 1 15.3 22H8.7a2 2 0 0 1-2-1.8L5 6" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </DockApp>
      </div>

      <MailModal open={mailOpen} onClose={() => setMailOpen(false)} />
    </>
  );
}

function DockApp({
  label,
  gradient,
  onClick,
  running = false,
  attention = false,
  children,
}: {
  label: string;
  gradient: string;
  onClick: () => void;
  running?: boolean;
  attention?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`finder-dock-app ${attention ? 'attention' : ''}`}
      data-running={running ? 'true' : 'false'}
      onClick={onClick}
      title={label}
      aria-label={label}
    >
      <span className="finder-dock-tile" style={{ background: gradient }}>
        {children}
      </span>
      <span className="finder-dock-dot" aria-hidden />
    </button>
  );
}
