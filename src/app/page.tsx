import { Suspense, type ReactNode } from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { FinderWindow } from '@/components/finder/FinderWindow';
import { MacChrome } from '@/components/finder/MacChrome';
import { MobileFinder } from '@/components/finder/MobileFinder';
import { BrandBand } from '@/components/hero/BrandBand';
import { MdxContent } from '@/components/posts/mdx-content';
import { Section } from '@/components/sections/Section';
import { CapabilitiesSection } from '@/components/sections/CapabilitiesSection';
import { PipelineSection } from '@/components/sections/PipelineSection';
import { SystemsSection } from '@/components/sections/SystemsSection';
import { HumanSection } from '@/components/sections/HumanSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { getTree, type Tree } from '@/lib/tree';
import { getAllProjects } from '@/lib/projects';
import { getConfig } from '@/lib/config';

// The workspace README leads: visitors land on the 30-second pitch inside
// the Finder metaphor instead of a project file.
const DEFAULT_OPEN = '_root/readme';
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
    <div>
      {/* Hero: positioning + Memoji chat affordance */}
      <div className="px-(--space-lg) pt-(--space-md)">
        <div className="max-w-6xl mx-auto">
          <BrandBand
            github={config.social.github}
            linkedin={config.social.linkedin}
          />
        </div>
      </div>

      {/* 01 -- The workspace, README.md pre-opened */}
      <Section number="01" name="Workspace" tone="light-50" className="anim-reveal">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
          This is my actual workspace.
        </h2>
        <p className="mt-2 mb-(--space-md) max-w-prose text-sm leading-relaxed text-muted">
          Position-addressed, harness-agnostic -- the knowledge architecture I
          build for teams, running my own life. Browse it. README.md is open
          for you.
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
      </Section>

      <CapabilitiesSection />
      <PipelineSection />
      <SystemsSection />
      <HumanSection />
      <ContactSection
        email={config.personal.email}
        github={config.social.github}
        linkedin={config.social.linkedin}
      />
    </div>
  );
}
