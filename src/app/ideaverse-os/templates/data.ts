export type TemplateDomain = {
  slot: "20" | "30";
  defaultSlug: string;
  label: string;
};

export type TemplateFolder = {
  path: string;
  domain: "20" | "30";
  highlight?: boolean;
};

export type StarterTemplate = {
  name: string;
  displayName: string;
  tagline: string;
  useCase: string;
  domains: TemplateDomain[];
  folders: TemplateFolder[];
  compassExcerpt: string;
};

export const TEMPLATES: StarterTemplate[] = [
  {
    name: "work-personal",
    displayName: "Work + Personal",
    tagline: "Default Western knowledge-worker split. Two domains: your job and the rest of your life.",
    useCase:
      "Software engineers, managers, analysts, and most employed professionals. Works best when your job and personal life have distinct goals, tools, and cadences.",
    domains: [
      { slot: "20", defaultSlug: "work", label: "Work" },
      { slot: "30", defaultSlug: "personal", label: "Personal" },
    ],
    folders: [
      { path: "20-work/_bugs", domain: "20" },
      { path: "20-work/_features", domain: "20" },
      { path: "20-work/_other-work-items", domain: "20" },
      { path: "20-work/reference/guides", domain: "20" },
      { path: "20-work/reference/concepts", domain: "20" },
      { path: "20-work/reference/tools", domain: "20" },
      { path: "20-work/product", domain: "20" },
      { path: "30-personal/career", domain: "30", highlight: true },
      { path: "30-personal/learning", domain: "30", highlight: true },
      { path: "30-personal/portfolio", domain: "30", highlight: true },
      { path: "30-personal/finances", domain: "30" },
    ],
    compassExcerpt: `### This week
**Work** -- top bet: ship the build interview
**Personal** -- top bet: close Vizio loop

### When priorities collide
work-emergency wins; log the swap in 70-daily/.`,
  },
  {
    name: "creative",
    displayName: "Creative",
    tagline: "Two domains: the craft and the business of selling the craft.",
    useCase:
      "Writers, designers, illustrators, musicians, photographers. Separates the actual creative output from the clients, contracts, and finances needed to sustain it.",
    domains: [
      { slot: "20", defaultSlug: "craft", label: "Craft" },
      { slot: "30", defaultSlug: "business", label: "Business" },
    ],
    folders: [
      { path: "20-craft/drafts", domain: "20", highlight: true },
      { path: "20-craft/finished", domain: "20", highlight: true },
      { path: "20-craft/references", domain: "20" },
      { path: "20-craft/process-notes", domain: "20" },
      { path: "30-business/clients", domain: "30", highlight: true },
      { path: "30-business/finances", domain: "30" },
      { path: "30-business/contracts", domain: "30" },
      { path: "30-business/marketing", domain: "30" },
    ],
    compassExcerpt: `### This week
**Craft** -- finish chapter 3 draft
**Business** -- invoice two outstanding clients

### When priorities collide
Craft blocks come first unless a client deadline is within 48 hours.`,
  },
  {
    name: "researcher-builder",
    displayName: "Researcher + Builder",
    tagline: "Two domains: the questions you are investigating and the things you are shipping.",
    useCase:
      "Academics, scientists, independent researchers, developer-researchers. Keeps literature review and experiment logs separate from the prototypes and products they produce.",
    domains: [
      { slot: "20", defaultSlug: "research", label: "Research" },
      { slot: "30", defaultSlug: "building", label: "Building" },
    ],
    folders: [
      { path: "20-research/papers", domain: "20", highlight: true },
      { path: "20-research/experiments", domain: "20", highlight: true },
      { path: "20-research/notes", domain: "20" },
      { path: "20-research/reading-list", domain: "20" },
      { path: "30-building/projects", domain: "30", highlight: true },
      { path: "30-building/prototypes", domain: "30", highlight: true },
      { path: "30-building/archives", domain: "30" },
      { path: "30-building/tooling", domain: "30" },
    ],
    compassExcerpt: `### This week
**Research** -- complete experiment 3, write results section
**Building** -- ship prototype to 5 testers

### When priorities collide
Conference deadlines win. Otherwise: research AM, building PM.`,
  },
  {
    name: "trader-investor",
    displayName: "Trader / Investor",
    tagline: "Two domains: what you hold and what you are studying.",
    useCase:
      "Active traders, angel investors, crypto participants, finance-focused individuals. Separates the live portfolio and trade log from the macro thesis and company research that informs it.",
    domains: [
      { slot: "20", defaultSlug: "portfolio", label: "Portfolio" },
      { slot: "30", defaultSlug: "research", label: "Research" },
    ],
    folders: [
      { path: "20-portfolio/positions", domain: "20", highlight: true },
      { path: "20-portfolio/trades", domain: "20", highlight: true },
      { path: "20-portfolio/pnl", domain: "20" },
      { path: "20-portfolio/watchlist", domain: "20" },
      { path: "30-research/macro", domain: "30", highlight: true },
      { path: "30-research/companies", domain: "30", highlight: true },
      { path: "30-research/thesis", domain: "30" },
      { path: "30-research/sectors", domain: "30" },
    ],
    compassExcerpt: `### This week
**Portfolio** -- rebalance tech allocation, close two positions
**Research** -- build thesis on energy sector rotation

### When priorities collide
Portfolio risk management always comes first.`,
  },
  {
    name: "dayjob-sideproject",
    displayName: "Day-job + Side Project",
    tagline: "Two domains: the thing paying the bills and the thing you are building toward.",
    useCase:
      "Consultants, employed-but-building professionals, indie hackers. Works when your side project has its own product, growth, and operations that need to stay separated from employer work.",
    domains: [
      { slot: "20", defaultSlug: "dayjob", label: "Day Job" },
      { slot: "30", defaultSlug: "sideproject", label: "Side Project" },
    ],
    folders: [
      { path: "20-dayjob/clients-or-employer", domain: "20", highlight: true },
      { path: "20-dayjob/reference", domain: "20" },
      { path: "20-dayjob/meetings", domain: "20" },
      { path: "30-sideproject/product", domain: "30", highlight: true },
      { path: "30-sideproject/growth", domain: "30", highlight: true },
      { path: "30-sideproject/operations", domain: "30" },
      { path: "30-sideproject/legal", domain: "30" },
    ],
    compassExcerpt: `### This week
**Day job** -- deliver Q2 design spec
**Side project** -- launch waitlist, reach 50 signups

### When priorities collide
Day job commitments win unless side project has a time-gated window.`,
  },
  {
    name: "solo",
    displayName: "Solo",
    tagline: "One domain. For people whose life and work blur into a single focus area.",
    useCase:
      "Focused builders, solopreneurs, single-mission researchers. Skips the 30- slot entirely. Everything lives under 20-work/.",
    domains: [{ slot: "20", defaultSlug: "work", label: "Work" }],
    folders: [
      { path: "20-work/projects", domain: "20", highlight: true },
      { path: "20-work/reference", domain: "20" },
      { path: "20-work/archive", domain: "20" },
    ],
    compassExcerpt: `### This week
Top bet: ship v1.0 of the core feature
Success metric: 3 external users have run it end-to-end

### When priorities collide
Top bet always wins. Everything else is support work.`,
  },
];

export function getTemplate(slug: string): StarterTemplate | undefined {
  return TEMPLATES.find((t) => t.name === slug);
}

export function buildFolderTree(template: StarterTemplate): string {
  const lines: string[] = [];
  let lastDomain = "";
  for (const f of template.folders) {
    const parts = f.path.split("/");
    const root = parts[0];
    if (root !== lastDomain) {
      if (lastDomain) lines.push("");
      lines.push(root + "/");
      lastDomain = root;
    }
    const indent = "  ".repeat(parts.length - 1);
    lines.push(indent + parts[parts.length - 1] + "/");
  }
  return lines.join("\n");
}
