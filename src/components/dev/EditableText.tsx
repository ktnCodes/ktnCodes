'use client';

import { useRef, useState } from 'react';
import { useDevMode } from './useDevMode';

interface EditableTextProps {
  /**
   * Path relative to project root, e.g. "content/hero.json".
   * The text payload will be serialized via `serialize(currentValue)` and
   * written to disk on blur.
   */
  filePath: string;
  /** Current value (read from the JSON file at build/render time). */
  value: string;
  /**
   * How to serialize the new text into the file's full contents. For JSON
   * files this typically rewrites a single field. For pure markdown files,
   * just return the new value verbatim.
   */
  serialize: (next: string) => string;
  /** Render as block-level (default) or inline. */
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'pre';
  /** Allow newlines (multiline contentEditable). Default false. */
  multiline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Click-to-edit text. In dev mode (localhost) shows a subtle outline on hover
 * + becomes contentEditable on click. On blur, POSTs the new full file
 * contents to /api/dev/save. In production: renders the value as plain text,
 * no editing affordance.
 */
export function EditableText({
  filePath,
  value,
  serialize,
  as: Tag = 'span',
  multiline = false,
  className = '',
  children,
}: EditableTextProps) {
  const dev = useDevMode();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const ref = useRef<HTMLElement>(null);

  if (!dev) {
    return <Tag className={className}>{children ?? value}</Tag>;
  }

  async function onBlur() {
    const next = ref.current?.textContent ?? '';
    if (next === value) return;
    setSaving(true);
    try {
      const res = await fetch('/api/dev/save', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ path: filePath, content: serialize(next) }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    } catch (e) {
      console.error('[EditableText] save failed', e);
      alert(`Save failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setSaving(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
  }

  // The Tag union accepts a permissive ref via cast to `any` (intersection
  // of all elements' refs is impossible to satisfy generically).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const refAny: any = ref;
  return (
    <Tag
      ref={refAny}
      contentEditable
      suppressContentEditableWarning
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      title={`dev-edit: ${filePath}`}
      data-edit-path={filePath}
      className={`outline-none rounded-sm transition-colors hover:bg-amber-100/40 focus:bg-amber-100/60 focus:ring-1 focus:ring-amber-300 ${
        saving ? 'opacity-50' : ''
      } ${className}`}
      style={{ cursor: 'text' }}
    >
      {children ?? value}
      {saved && (
        <span aria-hidden className="ml-2 text-[10px] text-green-700">
          ✓ saved
        </span>
      )}
    </Tag>
  );
}
