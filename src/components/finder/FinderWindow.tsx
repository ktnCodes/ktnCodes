'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState, type ReactNode, type PointerEvent as ReactPointerEvent } from 'react';
import type { Tree, Folder, FolderLeaf } from '@/lib/tree';
import type { Project } from '@/lib/projects';
import { PreviewSourceToggle, usePreviewView } from '@/components/preview/PreviewSourceToggle';
import { MarkdownSource } from '@/components/preview/MarkdownSource';
import { useChatContext } from '@/components/chat/chat-context';
import { useFinderWindowController } from './finder-window-controller';

interface ContextEntry {
  rendered: ReactNode;
  raw: string;
  filename: string;
}

interface FinderWindowProps {
  tree: Tree;
  projects: Project[];
  defaultOpen: string;
  previewSlot?: ReactNode;
  previewRaw?: string;
  contextSlots?: Record<string, ContextEntry>;
}

interface Selection {
  folderSlug: string | null;
  leafSlug: string | null;
}

/** Min/max bounds for a draggable Finder column in pixels. */
export const COLUMN_MIN = 120;
export const COLUMN_MAX = 400;

/** Clamp a proposed column width to the allowed range. Exported for tests. */
export function clampColumnWidth(width: number): number {
  return Math.max(COLUMN_MIN, Math.min(COLUMN_MAX, width));
}

function parseOpen(open: string | null, defaultOpen: string): Selection {
  const value = open ?? defaultOpen;
  const [folder, leaf] = value.split('/');
  return {
    folderSlug: folder ?? null,
    leafSlug: leaf ?? null,
  };
}

export function FinderWindow({
  tree,
  projects,
  defaultOpen,
  previewSlot,
  previewRaw,
  contextSlots,
}: FinderWindowProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const open = searchParams.get('open');
  const sel = useMemo(() => parseOpen(open, defaultOpen), [open, defaultOpen]);
  const { layout, autoPromptLeaf } = useChatContext();
  const dimmed = layout === 'chat-active';
  const winCtrl = useFinderWindowController();
  if (!winCtrl) {
    throw new Error('FinderWindow must be rendered inside <MacChrome>');
  }

  // Resizable column widths (last column flexes via 1fr). Drag the divider
  // strips at column boundaries to resize. Min/max prevent collapse + overrun.
  const [colWidths, setColWidths] = useState({ a: 180, b: 220, c: 220 });
  function startResize(key: 'a' | 'b' | 'c') {
    return (e: ReactPointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      const startX = e.clientX;
      const startW = colWidths[key];
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      function onMove(ev: PointerEvent) {
        const next = clampColumnWidth(startW + (ev.clientX - startX));
        setColWidths((w) => ({ ...w, [key]: next }));
      }
      function onUp() {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    };
  }

  const folder = tree.folders.find((f) => f.slug === sel.folderSlug);
  const leaf = folder?.leaves.find((l) => l.slug === sel.leafSlug);
  const project =
    leaf?.type === 'project' ? projects.find((p) => p.frontmatter.slug === leaf.slug) : null;

  function setOpen(folderSlug: string, leafSlug?: string) {
    const value = leafSlug ? `${folderSlug}/${leafSlug}` : folderSlug;
    const params = new URLSearchParams(searchParams.toString());
    params.set('open', value);
    router.replace(`/?${params.toString()}`, { scroll: false });
  }

  function handleLeafClick(folderSlug: string, leafSlug: string, leafName: string) {
    if (layout === 'chat-active') {
      autoPromptLeaf(leafSlug, leafName);
      return;
    }
    setOpen(folderSlug, leafSlug);
  }

  return (
    <div
      className={`finder-desktop-window ${dimmed ? 'is-dimmed' : ''}`}
      data-state={winCtrl.state}
    >
      <div
        className="finder-titlebar"
        style={{ background: 'var(--finder-titlebar)' }}
      >
        <div className="flex items-center gap-2">
          <TrafficLight color="#ff5f57" onClick={winCtrl.close} label="Close" glyph="x" />
          <TrafficLight color="#febc2e" onClick={winCtrl.minimize} label="Minimize" glyph="-" />
          <TrafficLight color="#28c840" onClick={winCtrl.toggleFullscreen} label="Fullscreen" glyph="o" />
        </div>
        <span className="text-[13px] font-semibold text-foreground/85 text-center">
          Workspace
        </span>
        <div className="flex items-center gap-1 justify-self-end">
          <button type="button" className="finder-icon-btn" title="share" aria-label="Share">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>
        </div>
      </div>

      <FinderToolbar />

      <div
        className="finder-body grid min-h-[460px] text-sm relative"
        style={{
          gridTemplateColumns: `${colWidths.a}px ${colWidths.b}px ${colWidths.c}px 1fr`,
        }}
      >
        <FinderSidebar onWorkspaceClick={() => setOpen('_root')} />
        <FolderColumn
          folders={tree.folders}
          selectedSlug={sel.folderSlug}
          onSelect={(slug) => setOpen(slug)}
        />
        <LeafColumn
          leaves={folder?.leaves ?? []}
          selectedSlug={sel.leafSlug}
          onSelect={(leafSlug) => {
            const clicked = folder?.leaves.find((l) => l.slug === leafSlug);
            handleLeafClick(sel.folderSlug ?? '', leafSlug, clicked?.label ?? leafSlug);
          }}
        />
        <PreviewColumn
          folder={folder}
          leaf={leaf}
          project={project}
          previewSlot={previewSlot}
          previewRaw={previewRaw}
          contextSlots={contextSlots}
          selFolderSlug={sel.folderSlug}
        />

        <Resizer left={colWidths.a} onPointerDown={startResize('a')} />
        <Resizer left={colWidths.a + colWidths.b} onPointerDown={startResize('b')} />
        <Resizer left={colWidths.a + colWidths.b + colWidths.c} onPointerDown={startResize('c')} />
      </div>
    </div>
  );
}

function Resizer({
  left,
  onPointerDown,
}: {
  left: number;
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      className="finder-resizer"
      style={{ left: `${left}px` }}
      onPointerDown={onPointerDown}
    />
  );
}

function TrafficLight({
  color,
  onClick,
  label,
  glyph,
}: {
  color: string;
  onClick?: () => void;
  label: string;
  glyph: 'x' | '-' | 'o';
}) {
  const interactive = typeof onClick === 'function';
  if (!interactive) {
    return <span className="w-3 h-3 rounded-full" style={{ background: color }} />;
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="finder-traffic-light w-3 h-3 rounded-full p-0 border-0 cursor-pointer relative"
      style={{ background: color }}
    >
      <svg
        className="finder-traffic-glyph"
        viewBox="0 0 12 12"
        width="8"
        height="8"
        aria-hidden
      >
        {glyph === 'x' && (
          <>
            <line x1="3" y1="3" x2="9" y2="9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="9" y1="3" x2="3" y2="9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </>
        )}
        {glyph === '-' && (
          <line x1="2.5" y1="6" x2="9.5" y2="6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        )}
        {glyph === 'o' && (
          <path d="M3 3 L7 3 L3 7 Z M9 9 L5 9 L9 5 Z" fill="currentColor" />
        )}
      </svg>
    </button>
  );
}

function FinderToolbar() {
  return (
    <div className="finder-toolbar">
      <button type="button" className="finder-icon-btn" disabled title="back" aria-label="Navigate back">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button type="button" className="finder-icon-btn" disabled title="forward" aria-label="Navigate forward">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      <div className="finder-segmented" role="group" aria-label="View mode">
        <button type="button" title="icons" aria-label="Icons view">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        </button>
        <button type="button" title="list" aria-label="List view">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <circle cx="3.5" cy="6" r="0.5" />
            <circle cx="3.5" cy="12" r="0.5" />
            <circle cx="3.5" cy="18" r="0.5" />
          </svg>
        </button>
        <button type="button" className="active" title="columns" aria-label="Columns view">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="6" height="18" />
            <rect x="10" y="3" width="6" height="18" />
            <rect x="17" y="3" width="4" height="18" />
          </svg>
        </button>
        <button type="button" title="gallery" aria-label="Gallery view">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </button>
      </div>
      <div className="flex-1" />
      <div className="finder-search">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input type="text" placeholder="search workspace" aria-label="Search workspace" />
      </div>
    </div>
  );
}

function FinderSidebar({ onWorkspaceClick }: { onWorkspaceClick: () => void }) {
  return (
    <aside className="finder-sidebar">
      <h4>Favorites</h4>
      <button type="button" className="finder-sidebar-item active" onClick={onWorkspaceClick}>
        <span className="finder-sidebar-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </span>
        Workspace
      </button>

      <h4>Locations</h4>
      <a className="finder-sidebar-item" href="https://ktncodes.com">
        <span className="finder-sidebar-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15 15 0 0 1 0 20" />
            <path d="M12 2a15 15 0 0 0 0 20" />
          </svg>
        </span>
        ktncodes.com
      </a>
      <a
        className="finder-sidebar-item"
        href="https://github.com/ktnCodes"
        target="_blank"
        rel="noreferrer"
      >
        <span className="finder-sidebar-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3" />
            <path d="M15 22v-4a3 3 0 0 0-.88-2 6.84 6.84 0 0 0 4.88-9.5C19.6 4 18.7 2 17.5 2c-1 0-2 1-2 1s-2-1-5 0a4 4 0 0 0-3.5 4 6.84 6.84 0 0 0 1 5.5A3 3 0 0 0 7 18v4" />
          </svg>
        </span>
        github
      </a>

      <h4>Tags</h4>
      <span className="finder-sidebar-item finder-sidebar-decorative">
        <span className="finder-sidebar-icon">
          <span className="finder-sidebar-dot" style={{ background: '#34d399' }} />
        </span>
        shipped
      </span>
      <span className="finder-sidebar-item finder-sidebar-decorative">
        <span className="finder-sidebar-icon">
          <span className="finder-sidebar-dot" style={{ background: '#f59e0b' }} />
        </span>
        active
      </span>
      <span className="finder-sidebar-item finder-sidebar-decorative">
        <span className="finder-sidebar-icon">
          <span className="finder-sidebar-dot" style={{ background: '#60a5fa' }} />
        </span>
        planned
      </span>
    </aside>
  );
}

function FolderColumn({
  folders,
  selectedSlug,
  onSelect,
}: {
  folders: Tree['folders'];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="border-r border-hairline bg-surface p-1.5">
      {folders.map((f) => {
        // _root is the workspace itself, not a child folder. Render it
        // as a markdown file so the metaphor reads as "the workspace's
        // own readme" rather than a nested folder.
        const isRoot = f.slug === '_root';
        const label = isRoot ? 'workspace.md' : f.label;
        return (
          <button
            key={f.slug}
            onClick={() => onSelect(f.slug)}
            className={`block w-full text-left px-2 py-1 rounded-md text-[13px] transition-colors flex items-center gap-1.5 ${
              f.slug === selectedSlug ? 'bg-blue-500 text-white' : 'text-foreground hover:bg-(--surface-alt)'
            }`}
          >
            <span className="finder-row-icon" aria-hidden>
              {isRoot ? <FileIcon /> : <FolderIcon />}
            </span>
            <span className="truncate flex-1">{label}</span>
            {!isRoot && <span className="opacity-50">{'›'}</span>}
          </button>
        );
      })}
    </div>
  );
}

function leafIcon(l: FolderLeaf) {
  if (l.type === 'link') return <LinkIcon />;
  if (l.type === 'context') return <ContextIcon />;
  return <FileIcon />;
}

function leafDisplayLabel(l: FolderLeaf): string {
  if (l.type === 'project') return `${l.slug}.md`;
  return l.label;
}

function LeafColumn({
  leaves,
  selectedSlug,
  onSelect,
}: {
  leaves: FolderLeaf[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
}) {
  if (leaves.length === 0) {
    return (
      <div className="border-r border-hairline bg-surface p-3 text-muted text-sm italic">
        empty
      </div>
    );
  }
  return (
    <div className="border-r border-hairline bg-surface p-1.5 overflow-y-auto max-h-[460px]">
      {leaves.map((l) => (
        <button
          key={l.slug}
          onClick={() => onSelect(l.slug)}
          className={`block w-full text-left px-2 py-1 rounded-md text-[13px] transition-colors flex items-center gap-1.5 ${
            l.slug === selectedSlug ? 'bg-blue-500 text-white' : 'text-foreground hover:bg-(--surface-alt)'
          }`}
        >
          <span className="finder-row-icon" aria-hidden>
            {leafIcon(l)}
          </span>
          <span className="truncate">{leafDisplayLabel(l)}</span>
        </button>
      ))}
    </div>
  );
}

/* lucide-style icons used in the folder/leaf rows and the sidebar. */
function FolderIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="14 2 14 8 20 8" />
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
function ContextIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="9" x2="15" y2="9" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="13" y2="17" />
    </svg>
  );
}

function PreviewColumn({
  folder,
  leaf,
  project,
  previewSlot,
  previewRaw,
  contextSlots,
  selFolderSlug,
}: {
  folder?: Folder;
  leaf?: FolderLeaf;
  project?: Project | null;
  previewSlot?: ReactNode;
  previewRaw?: string;
  contextSlots?: Record<string, ContextEntry>;
  selFolderSlug?: string | null;
}) {
  const view = usePreviewView();

  // No leaf selected -- show folder CONTEXT.md if present
  if (!leaf) {
    if (folder && folder.contextMd && contextSlots && selFolderSlug) {
      const entry = contextSlots[`folder:${selFolderSlug}`];
      if (entry) {
        return (
          <div className="flex flex-col h-full max-h-[460px]">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-hairline bg-(--surface-alt)">
              <span className="text-[10px] uppercase tracking-wider text-muted font-semibold">
                CONTEXT.md
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted font-mono">
                {folder.label}
              </span>
              <span className="ml-auto">
                <PreviewSourceToggle />
              </span>
            </div>
            {view === 'source' ? (
              <div className="flex-1 overflow-hidden">
                <MarkdownSource raw={entry.raw} filename={entry.filename} />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 bg-(--surface-alt) prose prose-sm max-w-none text-foreground">
                {entry.rendered}
              </div>
            )}
          </div>
        );
      }
    }
    return (
      <div className="bg-(--surface-alt) p-4 text-muted text-sm italic">
        Select an item to preview.
      </div>
    );
  }

  // External link
  if (leaf.type === 'link') {
    return (
      <div className="bg-(--surface-alt) p-4">
        <div className="text-[10px] uppercase tracking-wider text-muted font-semibold mb-2">
          External link
        </div>
        <a href={leaf.href} className="text-blue-600 underline text-sm">
          {leaf.label}
        </a>
      </div>
    );
  }

  // Context file
  if (leaf.type === 'context') {
    const entry = contextSlots?.[`leaf:${selFolderSlug}/${leaf.slug}`];
    return (
      <div className="flex flex-col h-full max-h-[460px]">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-hairline bg-(--surface-alt)">
          <span className="text-[10px] uppercase tracking-wider text-muted font-semibold">
            {leaf.label}
          </span>
          <span className="ml-auto">
            <PreviewSourceToggle />
          </span>
        </div>
        {entry && view === 'source' ? (
          <div className="flex-1 overflow-hidden">
            <MarkdownSource raw={entry.raw} filename={entry.filename} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 bg-(--surface-alt) prose prose-sm max-w-none text-foreground">
            {entry?.rendered ?? <p className="text-muted italic">No content.</p>}
          </div>
        )}
      </div>
    );
  }

  // Project
  if (!project) {
    return <div className="bg-(--surface-alt) p-4 text-muted text-sm italic">Project not found.</div>;
  }
  const fm = project.frontmatter;

  if (view === 'source' && previewRaw) {
    return (
      <div className="flex flex-col h-full max-h-[460px]">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-hairline bg-(--surface-alt)">
          <span className="text-[10px] uppercase tracking-wider text-muted font-semibold">Preview</span>
          <span className="ml-auto">
            <PreviewSourceToggle />
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          <MarkdownSource raw={previewRaw} filename={`${fm.slug}.md`} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[460px]">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-hairline bg-(--surface-alt)">
        <span className="text-[10px] uppercase tracking-wider text-muted font-semibold">Preview</span>
        {fm.status && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold uppercase tracking-wider">
            {fm.status}
          </span>
        )}
        <span className="ml-auto">
          <PreviewSourceToggle />
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-(--surface-alt)">
        <h2 className="text-xl font-bold text-foreground mb-1">{fm.name}</h2>
        {fm.tagline && <p className="text-sm text-muted mb-3">{fm.tagline}</p>}
        {fm.tech && fm.tech.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {fm.tech.map((t) => (
              <span
                key={t}
                className="text-[11px] px-2 py-0.5 border border-hairline rounded bg-surface text-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2 mb-4">
          {fm.github && (
            <a
              href={fm.github}
              className="text-[11px] px-2 py-1 bg-foreground text-background rounded font-medium"
            >
              ↗ github
            </a>
          )}
          {fm.demo && (
            <a
              href={fm.demo}
              className="text-[11px] px-2 py-1 border border-hairline rounded text-foreground bg-surface"
            >
              ↗ demo
            </a>
          )}
        </div>
        <div className="border-t border-hairline pt-3">
          {previewSlot ?? (
            <pre className="whitespace-pre-wrap text-xs text-foreground font-mono leading-relaxed">
              {project.body.trim()}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
