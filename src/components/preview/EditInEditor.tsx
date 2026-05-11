'use client';

interface EditInEditorProps {
  /** Absolute path to the .md file on disk. */
  filePath: string;
  /** Editor URI scheme. Defaults to vscode:// but Cursor honors it too. */
  scheme?: 'vscode' | 'cursor';
}

/**
 * Opens the underlying .md file in the local editor at the right path via
 * the vscode:// (or cursor://) URI scheme. Both VS Code and Cursor register
 * `vscode://file/<absolute-path>` as a system-wide handler when installed.
 *
 * Dev-only affordance — works on localhost where the path is accurate.
 * On a deployed site, the path won't match anything, but the button still
 * renders. Hide via `process.env.NODE_ENV === 'production'` if you want
 * to strip it from production.
 */
export function EditInEditor({ filePath, scheme = 'vscode' }: EditInEditorProps) {
  // Normalize Windows backslashes; VS Code wants forward slashes after the host.
  const normalized = filePath.replace(/\\/g, '/');
  const href = `${scheme}://file/${normalized}`;

  return (
    <a
      href={href}
      title={`Open ${normalized.split('/').pop()} in editor`}
      className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-foreground border border-hairline rounded-md px-2 py-1 bg-surface transition-colors"
    >
      <span aria-hidden>✏️</span>
      Edit
    </a>
  );
}
