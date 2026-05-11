import type { ReactNode } from 'react';
import { MenuBar } from './MenuBar';

interface MacChromeProps {
  children: ReactNode;
  /** Hide the wallpaper/menu/dock on mobile (T15 will swap to iOS Files). */
  hideOnMobile?: boolean;
}

/**
 * Decorative macOS desktop chrome (wallpaper gradient, menu bar, dock).
 * Wraps the FinderWindow to make the Finder feel "on a desktop" rather than
 * floating on the page background. Pure CSS, no real OS integration.
 */
export function MacChrome({ children, hideOnMobile = true }: MacChromeProps) {
  return (
    <div
      className={`relative rounded-[20px] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.18)] ${hideOnMobile ? 'hidden md:block' : ''}`}
      style={{
        background:
          'linear-gradient(135deg, #ff8c4a 0%, #ff5a8a 35%, #7a5af8 70%, #3aa9ff 100%)',
        aspectRatio: '21 / 11',
      }}
    >
      <MenuBar />
      <div className="absolute inset-0 pt-8 pb-12 px-12 flex items-center justify-center">
        <div className="w-full max-w-[1100px]">{children}</div>
      </div>
      <Dock />
    </div>
  );
}

const DOCK_APPS: Array<{ bg: string; emoji: string }> = [
  { bg: '#0a84ff', emoji: '🔍' },
  { bg: '#34c759', emoji: '🌐' },
  { bg: '#ff9500', emoji: '💬' },
  { bg: '#5856d6', emoji: '📁' },
  { bg: 'rgba(255,255,255,0.4)', emoji: '🗑' },
];

function Dock() {
  return (
    <div
      className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 rounded-2xl border"
      style={{
        background: 'rgba(255,255,255,0.18)',
        borderColor: 'rgba(255,255,255,0.25)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {DOCK_APPS.map((app, idx) => (
        <div
          key={idx}
          className="w-7 h-7 rounded-md flex items-center justify-center text-sm"
          style={{ background: app.bg }}
        >
          {app.emoji}
        </div>
      ))}
    </div>
  );
}
