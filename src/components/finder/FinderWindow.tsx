'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, type ReactNode } from 'react';
import type { Tree, Folder, FolderLeaf } from '@/lib/tree';
import type { Project } from '@/lib/projects';
import { PreviewSourceToggle, usePreviewView } from '@/components/preview/PreviewSourceToggle';
import { MarkdownSource } from '@/components/preview/MarkdownSource';
import { useChatContext } from '@/components/chat/chat-context';

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
      className={`border border-hairline rounded-lg overflow-hidden bg-surface shadow-md transition-opacity duration-300 ${
        dimmed ? 'opacity-85' : 'opacity-100'
      }`}
    >
      <div
        className="flex items-center gap-2 px-3 py-2 border-b border-hairline"
        style={{ background: 'var(--finder-titlebar)' }}
      >
        <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
        <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
        <span className="mx-auto text-[13px] font-semibold text-foreground/85">Workspace</span>
      </div>

      <div className="grid grid-cols-[160px_200px_200px_1fr] min-h-[460px] text-sm">
        <FinderSidebar />
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
      </div>
    </div>
  );
}

function FinderSidebar() {
  return (
    <div className="bg-(--surface-alt) border-r border-hairline p-2.5">
      <div className="text-[9px] uppercase tracking-wider text-muted font-bold px-2 mb-1.5">
        Favorites
      </div>
      <div className="px-2 py-1.5 rounded-md bg-blue-500 text-white text-[13px] flex items-center gap-1.5">
        <span>📁</span> Workspace
      </div>
    </div>
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
      {folders.map((f) => (
        <button
          key={f.slug}
          onClick={() => onSelect(f.slug)}
          className={`block w-full text-left px-2 py-1 rounded-md text-[13px] transition-colors flex items-center gap-1.5 ${
            f.slug === selectedSlug ? 'bg-blue-500 text-white' : 'text-foreground hover:bg-(--surface-alt)'
          }`}
        >
          <span aria-hidden>{f.slug === '_root' ? '🏠' : '📁'}</span>
          <span className="truncate">{f.label}</span>
        </button>
      ))}
    </div>
  );
}

function leafIcon(l: FolderLeaf): string {
  if (l.type === 'link') return '🔗';
  if (l.type === 'context') return '📋';
  return '📄';
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
          <span aria-hidden>{leafIcon(l)}</span>
          <span className="truncate">{leafDisplayLabel(l)}</span>
        </button>
      ))}
    </div>
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
