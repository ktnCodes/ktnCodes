import { Suspense, type ReactNode } from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { FinderWindow } from '@/components/finder/FinderWindow';
import { MacChrome } from '@/components/finder/MacChrome';
import { MobileFinder } from '@/components/finder/MobileFinder';
import { BrandBand } from '@/components/hero/BrandBand';
import { MdxContent } from '@/components/posts/mdx-content';
import { AboutSection } from '@/components/sections/AboutSection';
import { TechStackSection } from '@/components/sections/TechStackSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { BeliefsSection } from '@/components/sections/BeliefsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { getTree, type Tree } from '@/lib/tree';
import { getAllProjects } from '@/lib/projects';
import { getConfig } from '@/lib/config';

const DEFAULT_OPEN = 'shipped/ideaverse-os';
const PROJECTS_DIR = path.join(process.cwd(), 'content/projects');

interface ContextEntry {
  rendered: ReactNode;
  raw: string;
  filename: string;
}

function buildContextSlots(tree: Tree): Record<string, ContextEntry> {
  const slots: Record<string, ContextEntry> = {};
  for (const folder of tree.folders) {
    if (folder.contextMd) {
      try {
        const raw = fs.readFileSync(path.join(process.cwd(), folder.contextMd), 'utf8');
        slots[`folder:${folder.slug}`] = {
          rendered: <MdxContent source={raw} />,
          raw,
          filename: 'CONTEXT.md',
        };
      } catch {
        // missing context file -- silently skip
      }
    }
    for (const leaf of folder.leaves) {
      if (leaf.type === 'context' && leaf.contentPath) {
        try {
          const raw = fs.readFileSync(path.join(process.cwd(), leaf.contentPath), 'utf8');
          slots[`leaf:${folder.slug}/${leaf.slug}`] = {
            rendered: <MdxContent source={raw} />,
            raw,
            filename: leaf.label,
          };
        } catch {
          // missing leaf content -- silently skip
        }
      }
    }
  }
  return slots;
}

interface SearchParams {
  open?: string;
  view?: string;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const tree = getTree();
  const projects = getAllProjects();
  const config = getConfig();
  const contextSlots = buildContextSlots(tree);

  // Identify the currently-selected leaf to pre-render its MDX server-side.
  const open = params.open ?? DEFAULT_OPEN;
  const [, leafSlug] = open.split('/');
  const activeProject = projects.find((p) => p.frontmatter.slug === leafSlug);

  let previewSlot: React.ReactNode = null;
  let previewRaw: string | undefined;
  if (activeProject) {
    previewSlot = <MdxContent source={activeProject.body} />;
    try {
      previewRaw = fs.readFileSync(
        path.join(PROJECTS_DIR, `${activeProject.frontmatter.slug}.md`),
        'utf8',
      );
    } catch {
      previewRaw = undefined;
    }
  }

  return (
    <div className="px-(--space-lg) py-(--space-xl)">
      <div className="max-w-6xl mx-auto">
        <BrandBand />
        <section className="mt-(--space-xl) mb-(--space-2xl)">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted mb-(--space-sm)">
            Position-addressed memory -- interactive desktop
          </p>
          <Suspense fallback={null}>
            <MacChrome>
              <FinderWindow
                tree={tree}
                projects={projects}
                defaultOpen={DEFAULT_OPEN}
                previewSlot={previewSlot}
                previewRaw={previewRaw}
                contextSlots={contextSlots}
              />
            </MacChrome>
          </Suspense>
          {/* Mobile: iOS Files pattern (drill-in / back nav) */}
          <div className="md:hidden mt-4">
            <Suspense fallback={null}>
              <MobileFinder
                tree={tree}
                projects={projects}
                defaultOpen={DEFAULT_OPEN}
                previewSlot={previewSlot}
                previewRaw={previewRaw}
                contextSlots={contextSlots}
              />
            </Suspense>
          </div>
        </section>
      </div>
      <AboutSection />
      <TechStackSection />
      <ExperienceSection />
      <BeliefsSection />
      <ContactSection
        email={config.personal.email}
        github={config.social.github}
        linkedin={config.social.linkedin}
      />
    </div>
  );
}
