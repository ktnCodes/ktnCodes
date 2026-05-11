'use client';

import Image from 'next/image';
import { useState } from 'react';

export type MemojiState = 'idle' | 'hover' | 'chat-open' | 'thinking';

interface MemojiProps {
  /** Pixel size of the rendered avatar (square). Default 200. */
  size?: number;
  /**
   * Force a state. If undefined, the component handles hover internally
   * (mouseenter swaps to `hover`, mouseleave back to `idle`).
   */
  state?: MemojiState;
}

const STATE_TO_FILE: Record<MemojiState, string> = {
  idle: '/memoji/idle.png',
  hover: '/memoji/hover.png',
  'chat-open': '/memoji/chat-open.png',
  thinking: '/memoji/chat-open.png', // v1 reuses chat-open + CSS bob; v2 Blender deliverable
};

/**
 * Pure visual component (renders <span>, no click handling). The parent
 * is responsible for wrapping in a clickable element if needed (e.g.,
 * BrandBand wraps in a <button> that opens the chat).
 */
export function Memoji({ size = 200, state }: MemojiProps) {
  const [hovered, setHovered] = useState(false);
  const resolved: MemojiState = state ?? (hovered ? 'hover' : 'idle');
  const isThinking = resolved === 'thinking';

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative block rounded-full"
      style={{ width: size, height: size }}
    >
      {/* Soft accent glow behind the avatar — warm in light, cool in dark */}
      <span
        aria-hidden
        className="absolute inset-[-12px] rounded-full blur-2xl opacity-60 dark:opacity-50"
        style={{
          background:
            'radial-gradient(circle, var(--memoji-glow, rgba(253,230,138,0.7)) 0%, transparent 65%)',
        }}
      />
      {/* Crossfade layer: render all 3 source PNGs, fade in the active one */}
      <span
        className="relative block w-full h-full overflow-hidden rounded-full"
        style={{ animation: isThinking ? 'memoji-bob 1.2s ease-in-out infinite' : 'none' }}
      >
        {(['idle', 'hover', 'chat-open'] as const).map((s) => {
          const isActive =
            s === resolved || (resolved === 'thinking' && s === 'chat-open');
          return (
            <Image
              key={s}
              src={STATE_TO_FILE[s]}
              alt={s === 'idle' ? "Kevin's Memoji" : ''}
              width={size}
              height={size}
              priority={s === 'idle'}
              draggable={false}
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-200 select-none"
              style={{
                opacity: isActive ? 1 : 0,
                transitionTimingFunction: 'var(--ease-out-expo)',
              }}
            />
          );
        })}
      </span>
      <style jsx>{`
        @keyframes memoji-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </span>
  );
}
