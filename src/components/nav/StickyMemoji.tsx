'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useChatContext } from '@/components/chat/chat-context';

/**
 * Persistent bottom-right Memoji + label that opens the chat from anywhere.
 * Click → scroll to top + openWith() on the existing chat context.
 * (T6 will add a real 70/30 stage-shift layout state on top of this.)
 */
export function StickyMemoji() {
  const [hovered, setHovered] = useState(false);
  const { openWith } = useChatContext();

  function open() {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    openWith();
  }

  return (
    <div className="fixed bottom-(--space-sm) right-(--space-sm) z-40 flex flex-col items-end gap-2">
      <span
        aria-hidden
        className={`text-[12px] text-foreground rounded-xl px-3 py-1.5 shadow-md border border-hairline backdrop-blur-md transition-opacity duration-200 ${
          hovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'var(--glass-bg-label)' }}
      >
        💬 Ask Kevin anything
      </span>
      <button
        type="button"
        aria-label="Open chat with Kevin"
        onClick={open}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-16 h-16 rounded-full bg-surface border-2 border-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:scale-105 transition-transform overflow-hidden"
      >
        <Image src="/memoji/idle.png" alt="" width={64} height={64} priority />
      </button>
    </div>
  );
}
