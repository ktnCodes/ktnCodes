'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, type ReactNode } from 'react';
import type { Tree, FolderLeaf } from '@/lib/tree';
import type { Project } from '@/lib/projects';
import { PreviewSourceToggle, usePreviewView } from '@/components/preview/PreviewSourceToggle';
import { MarkdownSource } from '@/components/preview/MarkdownSource';

interface ContextEntry {
  rendered: ReactNode;
  raw: string;
  filename: string;
}

interface MobileFinderProps {
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

function leafIcon(l: FolderLeaf): string {
  if (l.type === 'link') return '🔗';
  if (l.type === 'context') return '📋';
  return '📄';
}

function leafDisplayLabel(l: FolderLeaf): string {
  if (l.type === 'project') return `${l.slug}.md`;
  return l.label;
}

export function MobileFinder({
  tree,
  projects,
  defaultOpen,
  previewSlot,
  previewRaw,
  contextSlots,
}: MobileFinderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const open = searchParams.get('open');
  const sel = useMemo(() => parseOpen(open, defaultOpen), [open, defaultOpen]);
  const folder = tree.folders.find((f) => f.slug === sel.folderSlug);
  const leaf = folder?.leaves.find((l) => l.slug === sel.leafSlug);
  const project =
    leaf?.type === 'project' ? projects.find((p) => p.frontmatter.slug === leaf.slug) : null;

  function navTo(folderSlug: string | null, leafSlug?: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (folderSlug) {
      params.set('open', leafSlug ? `${folderSlug}/${leafSlug}` : folderSlug);
    } else {
      params.delete('open');
    }
    router.replace(`/?${params.toString()}`, { scroll: false });
  }

  // View precedence: project leaf > context leaf > folder > root
  if (leaf && project) {
    return (
      <Frame
        title={`${sel.folderSlug} / ${leaf.slug}`}
        onBack={() => navTo(sel.folderSlug)}
      >
        <LeafView
          project={project}
          previewSlot={previewSlot}
          previewRaw={previewRaw}
        />
      </Frame>
    );
  }
  if (leaf && leaf.type === 'context') {
    const entry = contextSlots?.[`leaf:${sel.folderSlug}/${leaf.slug}`];
    return (
      <Frame
        title={`${sel.folderSlug} / ${leaf.label}`}
        onBack={() => navTo(sel.folderSlug)}
      >
        <ContextView entry={entry} />
      </Frame>
    );
  }
  if (folder) {
    const folderEntry =
      folder.contextMd && contextSlots && sel.folderSlug
        ? contextSlots[`folder:${sel.folderSlug}`]
        : undefined;
    return (
      <Frame title={folder.label} onBack={() => navTo(null)}>
        {folderEntry && (
          <div className="px-4 py-3 border-b border-hairline bg-(--surface-alt) prose prose-sm max-w-none text-foreground">
            {folderEntry.rendered}
          </div>
        )}
        <ul className="divide-y divide-hairline">
          {folder.leaves.length === 0 && (
            <li className="px-4 py-6 text-sm text-muted italic">empty</li>
          )}
          {folder.leaves.map((l) => (
            <li key={l.slug}>
              {l.type === 'link' ? (
                <a
                  href={l.href}
                  className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-(--surface-alt) transition-colors"
                >
                  <span aria-hidden>{leafIcon(l)}</span>
                  <span className="flex-1">{l.label}</span>
                  <span aria-hidden className="text-muted">›</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => navTo(folder.slug, l.slug)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-(--surface-alt) transition-colors text-left"
                >
                  <span aria-hidden>{leafIcon(l)}</span>
                  <span className="flex-1">{leafDisplayLabel(l)}</span>
                  <span aria-hidden className="text-muted">›</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </Frame>
    );
  }
  // Root
  return (
    <Frame title="Workspace">
      <ul className="divide-y divide-hairline">
        {tree.folders.map((f) => (
          <li key={f.slug}>
            <button
              type="button"
              onClick={() => navTo(f.slug)}
              className="w-full flex items-center gap-3 px-4 py-3 text-foreground hover:bg-(--surface-alt) transition-colors text-left"
            >
              <span aria-hidden>{f.slug === '_root' ? '🏠' : '📁'}</span>
              <span className="flex-1">{f.label}</span>
              <span aria-hidden className="text-muted">›</span>
            </button>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

function Frame({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-hairline overflow-hidden bg-surface shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-hairline bg-(--surface-alt)">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-blue-600 text-[14px] font-medium inline-flex items-center gap-0.5 hover:opacity-70"
            aria-label="Back"
          >
            <span aria-hidden>‹</span> Back
          </button>
        )}
        <span className="mx-auto text-[14px] font-semibold text-foreground truncate max-w-[60%]">
          {title}
        </span>
        {onBack && <span className="w-12" aria-hidden />}
      </div>
      <div className="min-h-[300px]">{children}</div>
    </div>
  );
}

function ContextView({ entry }: { entry?: ContextEntry }) {
  const view = usePreviewView();
  if (!entry) {
    return (
      <div className="px-4 py-4 prose prose-sm max-w-none text-foreground">
        <p className="text-muted italic">No content.</p>
      </div>
    );
  }
  if (view === 'source') {
    return (
      <div className="flex flex-col">
        <div className="px-3 py-2 border-b border-hairline bg-(--surface-alt) flex items-center justify-end">
          <PreviewSourceToggle />
        </div>
        <MarkdownSource raw={entry.raw} filename={entry.filename} />
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <div className="px-3 py-2 border-b border-hairline bg-(--surface-alt) flex items-center justify-end">
        <PreviewSourceToggle />
      </div>
      <div className="px-4 py-4 prose prose-sm max-w-none text-foreground">
        {entry.rendered}
      </div>
    </div>
  );
}

function LeafView({
  project,
  previewSlot,
  previewRaw,
}: {
  project: Project;
  previewSlot?: ReactNode;
  previewRaw?: string;
}) {
  const view = usePreviewView();
  const fm = project.frontmatter;

  if (view === 'source' && previewRaw) {
    return (
      <div className="flex flex-col">
        <div className="px-3 py-2 border-b border-hairline bg-(--surface-alt) flex items-center justify-end">
          <PreviewSourceToggle />
        </div>
        <MarkdownSource raw={previewRaw} filename={`${fm.slug}.md`} />
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-2 mb-2">
        {fm.status && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold uppercase tracking-wider">
            {fm.status}
          </span>
        )}
        <span className="ml-auto">
          <PreviewSourceToggle />
        </span>
      </div>
      <h2 className="text-xl font-bold text-foreground mb-1">{fm.name}</h2>
      {fm.tagline && <p className="text-sm text-muted mb-3">{fm.tagline}</p>}
      {fm.tech && fm.tech.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {fm.tech.map((t) => (
            <span
              key={t}
              className="text-[11px] px-2 py-0.5 border border-hairline rounded bg-(--surface-alt) text-foreground"
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
            className="text-[12px] px-3 py-1.5 bg-foreground text-background rounded font-medium"
          >
            ↗ github
          </a>
        )}
        {fm.demo && (
          <a
            href={fm.demo}
            className="text-[12px] px-3 py-1.5 border border-hairline rounded text-foreground"
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
  );
}
