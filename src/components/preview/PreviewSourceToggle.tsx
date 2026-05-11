'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export type PreviewView = 'preview' | 'source';

export function usePreviewView(): PreviewView {
  const params = useSearchParams();
  return params.get('view') === 'source' ? 'source' : 'preview';
}

export function PreviewSourceToggle() {
  const router = useRouter();
  const params = useSearchParams();
  const view = params.get('view') === 'source' ? 'source' : 'preview';
  const [, startTransition] = useTransition();

  function set(next: PreviewView) {
    const sp = new URLSearchParams(params.toString());
    if (next === 'source') sp.set('view', 'source');
    else sp.delete('view');
    startTransition(() => {
      router.replace(`/?${sp.toString()}`, { scroll: false });
    });
  }

  return (
    <div
      className="inline-flex items-center bg-(--surface-alt) border border-hairline rounded-lg p-0.5 text-[11px] font-medium"
      role="tablist"
      aria-label="Preview or source"
    >
      <button
        type="button"
        role="tab"
        aria-selected={view === 'preview'}
        onClick={() => set('preview')}
        className={`px-2.5 py-1 rounded-md inline-flex items-center gap-1 transition-colors ${
          view === 'preview'
            ? 'bg-surface text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
            : 'text-muted'
        }`}
      >
        <span aria-hidden>👁</span> Preview
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={view === 'source'}
        onClick={() => set('source')}
        className={`px-2.5 py-1 rounded-md inline-flex items-center gap-1 transition-colors ${
          view === 'source'
            ? 'bg-surface text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
            : 'text-muted'
        }`}
      >
        <span aria-hidden className="font-mono">{'{}'}</span> Source
      </button>
    </div>
  );
}
