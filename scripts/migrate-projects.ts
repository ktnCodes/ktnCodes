/**
 * One-time migration: portfolio-config.json `projects[]` → content/projects/<slug>.md files.
 *
 * Run with: `npx tsx scripts/migrate-projects.ts`
 *
 * After running, manually remove the `projects` array from portfolio-config.json so the
 * .md files become the single source of truth (per PRD content-model lock).
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

interface OldProject {
  title: string;
  category: string;
  description: string;
  techStack: string[];
  date: string;
  status: string;
  featured?: boolean;
  links: { github?: string; live?: string };
}

const ROOT = path.join(__dirname, '..');
const CONFIG = path.join(ROOT, 'portfolio-config.json');
const OUT_DIR = path.join(ROOT, 'content/projects');

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const STATUS_MAP: Record<string, string> = {
  active: 'active',
  ongoing: 'active',
  internal: 'active',
  planned: 'planned',
  completed: 'released',
};

function normalizeStatus(raw: string): string {
  const lower = raw.toLowerCase();
  for (const key of Object.keys(STATUS_MAP)) {
    if (lower.startsWith(key)) return STATUS_MAP[key];
  }
  return 'active';
}

function startedFromDate(date: string): string {
  // dates in config are like "2024", "2026", "2022" — convert to YYYY-01
  const m = date.match(/^(\d{4})/);
  return m ? `${m[1]}-01` : date;
}

function tagline(description: string, max = 100): string {
  const firstSentence = description.split(/[.!?]/)[0].trim();
  return firstSentence.length <= max ? firstSentence : firstSentence.slice(0, max - 1) + '…';
}

function buildFrontmatter(p: OldProject, order: number) {
  const slug = slugify(p.title);
  const fm: Record<string, unknown> = {
    slug,
    name: p.title,
    folder: 'coding-projects',
    tagline: tagline(p.description),
    status: normalizeStatus(p.status),
    tech: p.techStack,
    started: startedFromDate(p.date),
    order,
  };
  if (p.featured) fm.featured = true;
  if (p.links?.github) fm.github = p.links.github;
  else fm.github = null;
  if (p.links?.live) fm.demo = p.links.live;
  else fm.demo = null;
  if (p.category) fm.category = p.category;
  return { slug, fm };
}

function buildBody(p: OldProject): string {
  // Use the full description as the body. Kevin will polish later (T19).
  return `# ${p.title}\n\n${p.description}\n`;
}

function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const config = JSON.parse(fs.readFileSync(CONFIG, 'utf8')) as { projects?: OldProject[] };
  if (!config.projects || config.projects.length === 0) {
    console.log('No projects[] in portfolio-config.json. Nothing to migrate.');
    return;
  }

  let written = 0;
  let skippedSeed = 0;
  config.projects.forEach((p, idx) => {
    const { slug, fm } = buildFrontmatter(p, idx + 1);
    const body = buildBody(p);
    const out = path.join(OUT_DIR, `${slug}.md`);
    // Preserve existing seed file (e.g., ideaverse-os.md from T1) if author has touched it.
    // Heuristic: skip overwrite if file exists AND its body length > 200 chars (the migrated
    // ideaverse-os description is ~480 chars, so this only protects user-edited files).
    if (fs.existsSync(out)) {
      const existing = matter(fs.readFileSync(out, 'utf8'));
      const existingBodyLen = existing.content.trim().length;
      if (existingBodyLen > 800) {
        console.log(`SKIP  ${slug}.md (existing body > 800 chars — looks hand-edited)`);
        skippedSeed += 1;
        return;
      }
    }
    fs.writeFileSync(out, matter.stringify(body, fm));
    console.log(`WRITE ${slug}.md`);
    written += 1;
  });

  console.log(`\nDone: ${written} files written, ${skippedSeed} skipped.`);
  console.log(`Next: remove the "projects" array from portfolio-config.json.`);
}

main();
