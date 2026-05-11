'use client';

import { useState } from 'react';
import matter from 'gray-matter';

interface MarkdownSourceProps {
  /** Raw .md file contents (frontmatter + body), shown verbatim. */
  raw: string;
  /** Filename to label in the header, e.g. 'arkive.md'. */
  filename: string;
}

export function MarkdownSource({ raw, filename }: MarkdownSourceProps) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(raw).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="h-full flex flex-col bg-(--surface-alt)">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-hairline">
        <span className="font-mono text-[11px] text-muted">📄 content/projects/{filename}</span>
        <span className="text-[9px] uppercase tracking-wider font-semibold bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded">
          raw
        </span>
        <button
          type="button"
          onClick={copy}
          className="ml-auto text-[11px] text-muted inline-flex items-center gap-1 border border-hairline rounded-md px-2 py-1 bg-surface hover:text-foreground"
        >
          {copied ? '✓ Copied' : '📋 Copy'}
        </button>
      </div>
      <pre className="flex-1 overflow-auto m-0 p-4 font-mono text-[12px] leading-relaxed text-foreground bg-(--surface-alt) whitespace-pre-wrap break-words">
        {raw}
      </pre>
    </div>
  );
}

/** Reconstruct the raw .md from a parsed frontmatter+body pair. */
export function rawFromProject(frontmatter: Record<string, unknown>, body: string): string {
  return matter.stringify(body, frontmatter);
}
