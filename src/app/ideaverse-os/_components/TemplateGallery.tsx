"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type Domain = {
  num: string;
  name: string;
  intent: string;
};

type Template = {
  slug: string;
  name: string;
  tagline: string;
  exampleUser: string;
  domains: Domain[];
};

const constantFoldersTop: { num: string; name: string }[] = [
  { num: "00", name: "agentic-OS" },
  { num: "10", name: "cortex" },
];

const constantFoldersBottom: { num: string; name: string }[] = [
  { num: "40", name: "raw" },
  { num: "50", name: "research-library" },
  { num: "60", name: "skills" },
  { num: "70", name: "daily" },
  { num: "80", name: "visualization" },
  { num: "99", name: "archive" },
];

const templates: Template[] = [
  {
    slug: "custom",
    name: "Custom",
    tagline: "Blank slate, build your own split.",
    exampleUser: "anyone whose life does not map to the presets",
    domains: [
      { num: "20", name: "<your-first-domain>", intent: "named in the interview" },
      { num: "30", name: "<your-second-domain>", intent: "named in the interview" },
    ],
  },
  {
    slug: "work-personal",
    name: "Work + Personal",
    tagline: "The classic split.",
    exampleUser: "engineer with a day job and weekend projects",
    domains: [
      { num: "20", name: "work", intent: "your day job" },
      { num: "30", name: "personal", intent: "weekends, hobbies, household" },
    ],
  },
  {
    slug: "creative",
    name: "Creative",
    tagline: "Make-things-first.",
    exampleUser: "artist, writer, or musician with life on the side",
    domains: [
      { num: "20", name: "craft", intent: "the work itself" },
      { num: "30", name: "personal", intent: "the rest of life" },
    ],
  },
  {
    slug: "researcher-builder",
    name: "Researcher + Builder",
    tagline: "Reading meets shipping.",
    exampleUser: "indie hacker who research-then-builds",
    domains: [
      { num: "20", name: "research", intent: "what you are reading and learning" },
      { num: "30", name: "build", intent: "what you are shipping" },
    ],
  },
  {
    slug: "trader-investor",
    name: "Trader / Investor",
    tagline: "Markets first, life second.",
    exampleUser: "full-time trader, part-time everything else",
    domains: [
      { num: "20", name: "markets", intent: "theses, positions, post-mortems" },
      { num: "30", name: "personal", intent: "everything outside markets" },
    ],
  },
  {
    slug: "dayjob-sideproject",
    name: "Day-job + Side-project",
    tagline: "Both fit-for-purpose.",
    exampleUser: "PM with a serious side project",
    domains: [
      { num: "20", name: "day-job", intent: "the job that pays" },
      { num: "30", name: "side-project", intent: "the bet you are making" },
    ],
  },
  {
    slug: "solo",
    name: "Solo",
    tagline: "One life, one folder.",
    exampleUser: "founder, freelancer, generalist",
    domains: [{ num: "20", name: "life", intent: "everything, one stream" }],
  },
];

function FolderRow({
  num,
  name,
  highlight,
  intent,
}: {
  num: string;
  name: string;
  highlight?: boolean;
  intent?: string;
}) {
  return (
    <div
      className={`flex items-baseline gap-3 py-1 ${
        highlight ? "bg-iv-rose/30 -mx-3 px-3" : ""
      }`}
    >
      <span className="font-mono text-[14px] text-iv-wine/60">+--</span>
      <span
        className={`font-mono text-[14px] ${
          highlight ? "text-iv-wine" : "text-iv-ink"
        }`}
      >
        {num}-{name}/
      </span>
      {intent ? (
        <span className="hidden font-sans text-[11.5px] italic text-iv-ink-soft sm:inline">
          {intent}
        </span>
      ) : null}
    </div>
  );
}

function VaultTree({ template }: { template: Template }) {
  return (
    <div className="font-mono text-[14px] leading-[1.7] text-iv-ink">
      <div className="text-iv-wine">my-vault/</div>
      {constantFoldersTop.map((f) => (
        <FolderRow key={f.num} num={f.num} name={f.name} />
      ))}
      {template.domains.map((d) => (
        <FolderRow
          key={d.num}
          num={d.num}
          name={d.name}
          intent={d.intent}
          highlight
        />
      ))}
      {constantFoldersBottom.map((f) => (
        <FolderRow key={f.num} num={f.num} name={f.name} />
      ))}
    </div>
  );
}

export function TemplateGallery() {
  const [selectedSlug, setSelectedSlug] = useState<string>(templates[1].slug);
  const selected = templates.find((t) => t.slug === selectedSlug) ?? templates[0];

  return (
    <>
      {/* Desktop: list + morphing tree */}
      <div className="hidden md:grid md:grid-cols-[260px_1fr] md:gap-10">
        <ul className="flex flex-col gap-1.5">
          {templates.map((tpl) => {
            const isActive = tpl.slug === selectedSlug;
            return (
              <li key={tpl.slug}>
                <button
                  type="button"
                  onMouseEnter={() => setSelectedSlug(tpl.slug)}
                  onFocus={() => setSelectedSlug(tpl.slug)}
                  onClick={() => setSelectedSlug(tpl.slug)}
                  aria-pressed={isActive}
                  className={`block w-full border px-4 py-3 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iv-amber ${
                    isActive
                      ? "border-iv-wine/50 bg-iv-cream-pale"
                      : "border-iv-wine/15 bg-iv-cream-pale/50 hover:border-iv-wine/30"
                  }`}
                >
                  <div
                    className={`font-iv-display text-[1.0625rem] font-semibold ${
                      isActive ? "text-iv-wine" : "text-iv-ink"
                    }`}
                  >
                    {tpl.name}
                  </div>
                  <div
                    className={`mt-0.5 font-sans text-[12.5px] ${
                      isActive ? "text-iv-ink" : "text-iv-ink-soft"
                    }`}
                  >
                    {tpl.tagline}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="border border-iv-wine/20 bg-iv-cream-pale p-7">
          <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-iv-wine/15 pb-4">
            <h3 className="font-iv-display text-[1.5rem] font-bold text-iv-wine">
              {selected.name}
            </h3>
            <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-iv-teal">
              for: <span className="normal-case text-iv-ink-soft tracking-normal italic font-normal">{selected.exampleUser}</span>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.slug}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <VaultTree template={selected} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile: stacked cards, all visible */}
      <div className="space-y-6 md:hidden">
        {templates.map((tpl) => (
          <article
            key={tpl.slug}
            className="border border-iv-wine/20 bg-iv-cream-pale p-5"
          >
            <h3 className="font-iv-display text-[1.25rem] font-bold text-iv-wine">
              {tpl.name}
            </h3>
            <p className="mt-1 font-sans text-[13.5px] text-iv-ink">
              {tpl.tagline}
            </p>
            <p className="mt-1 font-sans text-[12px] italic text-iv-ink-soft">
              for: {tpl.exampleUser}
            </p>
            <div className="mt-4 border-t border-iv-wine/15 pt-4">
              <VaultTree template={tpl} />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
