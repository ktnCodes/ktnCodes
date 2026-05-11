import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "../_components/SectionLabel";
import { TEMPLATES, buildFolderTree } from "./data";

export const metadata: Metadata = {
  title: "Starter templates -- ideaverse-os",
  description:
    "Six starter templates for ideaverse-os vaults. Pick the mental model that fits your life, then let the build interview shape it to your specifics.",
};

export default function TemplatesPage() {
  return (
    <div className="grain bg-iv-cream pb-32">
      {/* Back nav */}
      <div className="px-6 pt-10">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/ideaverse-os"
            className="inline-flex min-h-[44px] items-center gap-2 font-sans text-[13px] text-iv-teal hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
          >
            <span aria-hidden>{"<--"}</span>
            ideaverse-os
          </Link>
        </div>
      </div>

      {/* Header */}
      <section className="px-6 pt-10 pb-16 sm:pt-14 sm:pb-20">
        <div className="mx-auto max-w-5xl">
          <SectionLabel number="30" label="Templates" />
          <h1 className="mt-6 font-iv-display text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.015em] text-iv-wine">
            Start from a shape that fits.
          </h1>
          <p className="mt-5 max-w-[38rem] text-[1.0625rem] leading-[1.65] text-iv-ink">
            Phase 4 of the build interview offers these six presets plus Custom.
            Each one names your{" "}
            <code className="font-mono text-[15px]">20-</code> and{" "}
            <code className="font-mono text-[15px]">30-</code> domains and
            scaffolds the right sub-folder structure. You can rename any
            folder before confirming.
          </p>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="border-t border-iv-wine/15 px-6 pt-16 pb-20 sm:pt-20 sm:pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((template) => {
              const tree = buildFolderTree(template);
              return (
                <Link
                  key={template.name}
                  href={`/ideaverse-os/templates/${template.name}`}
                  className="group flex flex-col border border-iv-wine/20 bg-iv-cream-pale p-5 transition-colors hover:border-iv-wine/50 hover:bg-iv-cream-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
                >
                  {/* Domain chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {template.domains.map((d) => (
                      <span
                        key={d.slot}
                        className="inline-flex items-center gap-1 border border-iv-wine/25 px-2 py-0.5 font-mono text-[10px] text-iv-wine"
                      >
                        <span className="text-iv-wine/50">{d.slot}-</span>
                        {d.defaultSlug}
                      </span>
                    ))}
                  </div>

                  {/* Name */}
                  <h2 className="mt-3 font-iv-display text-[1.25rem] font-semibold leading-[1.1] text-iv-wine group-hover:underline">
                    {template.displayName}
                  </h2>

                  {/* Tagline */}
                  <p className="mt-2 text-[13.5px] leading-[1.5] text-iv-ink-soft">
                    {template.tagline}
                  </p>

                  {/* Folder tree preview */}
                  <div
                    className="mt-4 grow overflow-hidden rounded-lg border border-iv-wine/15"
                    style={{ backgroundColor: "#1a1a1f" }}
                  >
                    <div className="border-b border-iv-cream/10 px-3 py-1.5">
                      <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-iv-cream/50">
                        folder tree
                      </span>
                    </div>
                    <pre className="overflow-hidden px-3 py-2.5 font-mono text-[10.5px] leading-[1.6] text-iv-cream/80 whitespace-pre">
                      {tree}
                    </pre>
                  </div>

                  {/* CTA */}
                  <p className="mt-3 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
                    View details {"-->"}
                  </p>
                </Link>
              );
            })}

            {/* Custom tile */}
            <div className="flex flex-col border border-dashed border-iv-wine/25 bg-iv-cream-pale p-5">
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 border border-dashed border-iv-wine/25 px-2 py-0.5 font-mono text-[10px] text-iv-wine/60">
                  20-???
                </span>
                <span className="inline-flex items-center gap-1 border border-dashed border-iv-wine/25 px-2 py-0.5 font-mono text-[10px] text-iv-wine/60">
                  30-???
                </span>
              </div>
              <h2 className="mt-3 font-iv-display text-[1.25rem] font-semibold leading-[1.1] text-iv-wine">
                Custom
              </h2>
              <p className="mt-2 text-[13.5px] leading-[1.5] text-iv-ink-soft">
                No preset. The build interview asks how you split your life and
                generates a bespoke folder structure from your answers.
              </p>
              <p className="mt-auto pt-4 text-[13px] leading-[1.5] text-iv-ink">
                Available as an option in Phase 4 of{" "}
                <code className="font-mono text-[12px] text-iv-wine">
                  /ideaverse-os build
                </code>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Install CTA */}
      <section className="border-t border-iv-wine/15 px-6 pt-16 pb-20 sm:pt-20">
        <div className="mx-auto max-w-3xl">
          <p className="max-w-[38rem] text-[1.0625rem] leading-[1.65] text-iv-ink">
            Templates are applied during{" "}
            <code className="font-mono text-[15px] text-iv-wine">
              /ideaverse-os build --phase=domains
            </code>
            . Run init first to scaffold the skeleton, then build to
            pick your template and fill in your identity.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/ideaverse-os"
              className="inline-flex min-h-[44px] items-center rounded-sm bg-iv-wine px-5 py-2.5 font-iv-display text-[1rem] text-iv-cream hover:bg-iv-wine-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
            >
              Get started
            </Link>
            <Link
              href="/ideaverse-os/concepts/init-vs-build"
              className="inline-flex min-h-[44px] items-center px-5 py-2.5 font-iv-display text-[1rem] text-iv-wine hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber"
            >
              How init vs build works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
