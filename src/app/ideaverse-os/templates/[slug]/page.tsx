import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SectionLabel } from "../../_components/SectionLabel";
import { TEMPLATES, getTemplate, buildFolderTree } from "../data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.name }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) return {};
  return {
    title: `${template.displayName} template -- ideaverse-os`,
    description: template.tagline,
  };
}

export default async function TemplateDetailPage({ params }: Props) {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) notFound();

  const tree = buildFolderTree(template);

  // Adjacent templates for prev/next
  const idx = TEMPLATES.findIndex((t) => t.name === slug);
  const prev = idx > 0 ? TEMPLATES[idx - 1] : null;
  const next = idx < TEMPLATES.length - 1 ? TEMPLATES[idx + 1] : null;

  return (
    <div className="grain bg-iv-cream pb-32">
      {/* Back nav */}
      <div className="px-6 pt-10">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/ideaverse-os/templates"
            className="inline-flex min-h-[44px] items-center gap-2 font-sans text-[13px] text-iv-teal hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
          >
            <span aria-hidden>{"<--"}</span>
            All templates
          </Link>
        </div>
      </div>

      {/* Header */}
      <section className="px-6 pt-10 pb-16 sm:pt-14 sm:pb-20">
        <div className="mx-auto max-w-3xl">
          <SectionLabel number="30" label="Template" />

          {/* Domain slots */}
          <div className="mt-6 flex flex-wrap gap-2">
            {template.domains.map((d) => (
              <span
                key={d.slot}
                className="inline-flex items-center gap-1.5 border border-iv-wine/25 px-3 py-1 font-mono text-[12px] text-iv-wine"
              >
                <span className="text-iv-wine/50">{d.slot}-</span>
                {d.defaultSlug}
              </span>
            ))}
            {template.domains.length === 1 && (
              <span className="inline-flex items-center border border-dashed border-iv-wine/20 px-3 py-1 font-mono text-[12px] text-iv-wine/40">
                no 30- slot
              </span>
            )}
          </div>

          <h1 className="mt-4 font-iv-display text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.015em] text-iv-wine">
            {template.displayName}
          </h1>
          <p className="mt-4 max-w-[38rem] font-iv-display text-[clamp(1.125rem,2vw,1.375rem)] leading-[1.2] text-iv-teal">
            {template.tagline}
          </p>
        </div>
      </section>

      {/* Use case + folder tree */}
      <section className="border-t border-iv-wine/15 px-6 pt-16 pb-20 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-3xl grid gap-12 lg:max-w-5xl lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)]">
          {/* Left: description */}
          <div>
            <SectionLabel number="10" label="Use case" />
            <p className="mt-5 text-[1.0625rem] leading-[1.65] text-iv-ink">
              {template.useCase}
            </p>

            {/* Domain breakdown */}
            <div className="mt-10 space-y-5">
              {template.domains.map((d) => {
                const domainFolders = template.folders.filter(
                  (f) => f.domain === d.slot
                );
                return (
                  <div key={d.slot} className="border-t border-iv-wine/15 pt-5">
                    <div className="flex items-baseline gap-3">
                      <code className="font-mono text-[13px] text-iv-wine">
                        {d.slot}-{d.defaultSlug}/
                      </code>
                      <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
                        {d.label}
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {domainFolders.map((f) => {
                        const name = f.path.split("/").pop();
                        return (
                          <li
                            key={f.path}
                            className={`flex items-center gap-2 font-mono text-[12.5px] ${
                              f.highlight ? "text-iv-wine" : "text-iv-ink-soft"
                            }`}
                          >
                            <span aria-hidden className="text-iv-wine/30">
                              +--
                            </span>
                            {name}/
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: folder tree */}
          <div className="lg:sticky lg:top-12 lg:self-start">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
              Folder tree
            </p>
            <div
              className="mt-3 overflow-hidden rounded-lg border border-iv-wine/25"
              style={{ backgroundColor: "#1a1a1f" }}
            >
              <div className="border-b border-iv-cream/10 px-4 py-2">
                <span className="font-mono text-[10px] text-iv-cream/50">
                  your-vault/
                </span>
              </div>
              <pre className="overflow-x-auto px-4 py-4 font-mono text-[12px] leading-[1.7] text-iv-cream/80 whitespace-pre">
                {tree}
              </pre>
            </div>
            <p className="mt-3 font-sans text-[11px] italic text-iv-ink-soft">
              Folder names are suggestions. Rename any slot during the build interview.
            </p>
          </div>
        </div>
      </section>

      {/* Compass example */}
      <section className="border-t border-iv-wine/15 px-6 pt-16 pb-20 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <SectionLabel number="20" label="Sample compass" />
          <h2 className="mt-5 font-iv-display text-[clamp(1.375rem,3vw,2rem)] font-bold leading-[1.08] tracking-[-0.012em] text-iv-wine">
            How this template's domains tend to appear in compass.md
          </h2>
          <p className="mt-3 max-w-[36rem] text-[15px] leading-[1.55] text-iv-ink-soft">
            This is a reference example, not auto-written to your vault. The
            build interview compiles your actual answers into compass.md.
          </p>

          <div className="mt-6 border border-iv-wine/25 bg-iv-cream-pale">
            <div className="flex items-center justify-between border-b border-iv-wine/15 bg-iv-cream-deep px-4 py-2">
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-wine/65">
                example
              </span>
              <span className="font-mono text-[11px] text-iv-wine">
                compass.md
              </span>
            </div>
            <pre className="overflow-x-auto px-4 py-4 font-mono text-[12px] leading-[1.7] text-iv-ink whitespace-pre">
              {template.compassExcerpt}
            </pre>
          </div>
        </div>
      </section>

      {/* Get started */}
      <section className="border-t border-iv-wine/15 px-6 pt-16 pb-20 sm:pt-20">
        <div className="mx-auto max-w-3xl">
          <SectionLabel number="30" label="Use this template" />
          <h2 className="mt-5 font-iv-display text-[clamp(1.375rem,3vw,2rem)] font-bold leading-[1.08] tracking-[-0.012em] text-iv-wine">
            One command to scaffold. One conversation to pick your template.
          </h2>

          <div className="mt-6 border border-iv-wine/25 bg-iv-cream-pale">
            <div className="border-b border-iv-wine/15 bg-iv-cream-deep px-4 py-2">
              <span className="font-mono text-[11px] text-iv-wine">terminal</span>
            </div>
            <pre className="overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-[1.7] text-iv-ink whitespace-pre">{`$ npx ideaverse-os init ~/my-vault

# open in your harness, then:
/ideaverse-os build --phase=domains
# -> select "${template.name}" when prompted`}</pre>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/ideaverse-os"
              className="inline-flex min-h-[44px] items-center rounded-sm bg-iv-wine px-5 py-2.5 font-iv-display text-[1rem] text-iv-cream hover:bg-iv-wine-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
            >
              Get started
            </Link>
            <Link
              href="/ideaverse-os/templates"
              className="inline-flex min-h-[44px] items-center px-5 py-2.5 font-iv-display text-[1rem] text-iv-wine hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
            >
              All templates
            </Link>
          </div>
        </div>
      </section>

      {/* Prev / Next */}
      {(prev || next) && (
        <div className="mx-auto max-w-3xl border-t border-iv-wine/15 px-6 pt-8">
          <div className="flex justify-between gap-4">
            {prev ? (
              <Link
                href={`/ideaverse-os/templates/${prev.name}`}
                className="group flex min-h-[44px] flex-col justify-center"
              >
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
                  {"<-- Previous"}
                </span>
                <span className="font-iv-display text-[1rem] text-iv-wine group-hover:underline">
                  {prev.displayName}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next && (
              <Link
                href={`/ideaverse-os/templates/${next.name}`}
                className="group flex min-h-[44px] flex-col items-end justify-center"
              >
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
                  {"Next -->"}
                </span>
                <span className="font-iv-display text-[1rem] text-iv-wine group-hover:underline">
                  {next.displayName}
                </span>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
