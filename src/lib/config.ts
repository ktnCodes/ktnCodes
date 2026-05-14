import type { PortfolioConfig, Project as LegacyProject } from "@/types/portfolio";
import configData from "../../portfolio-config.json";
import { getAllProjects } from "./projects";

/**
 * The portfolio-config.json `projects` array was migrated to
 * `content/projects/<slug>.md` files (see scripts/migrate-projects.ts and the
 * PRD content-model lock). To avoid touching every consumer of the legacy
 * shape (chat tool, system prompt, <Projects /> renderer), we synthesize an
 * array in the legacy shape from the .md frontmatter on each call.
 */
function loadProjectsFromMarkdown(): LegacyProject[] {
  return getAllProjects()
    .map((p) => {
      const fm = p.frontmatter;
      return {
        title: fm.name,
        category: ((fm as unknown) as Record<string, unknown>).category as string ?? "",
        description: fm.tagline ?? "",
        techStack: fm.tech ?? [],
        date: fm.started ?? "",
        status: fm.status ?? "active",
        featured: fm.featured ?? false,
        links: {
          github: fm.github ?? undefined,
          live: fm.demo ?? undefined,
        },
        // Sort key. Legacy Project type doesn't carry order, so we attach as
        // a non-enumerable hint only used by the sort below.
        _order: fm.order ?? Number.MAX_SAFE_INTEGER,
      } as LegacyProject & { _order: number };
    })
    .sort((a, b) => (a as { _order: number })._order - (b as { _order: number })._order)
    .map(({ _order, ...rest }) => {
      void _order; // discard the helper sort key; keeps it out of the public type
      return rest as LegacyProject;
    });
}

export function getConfig(): PortfolioConfig {
  const raw = configData as Omit<PortfolioConfig, "projects">;
  return {
    ...raw,
    personal: {
      ...raw.personal,
      // Email kept out of the committed config to avoid scraping.
      email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? raw.personal.email,
    },
    projects: loadProjectsFromMarkdown(),
  };
}

const config = getConfig();

export const personalInfo = config.personal;
export const education = config.education;
export const experience = config.experience;
export const skills = config.skills;
export const projects = config.projects;
export const social = config.social;
export const presetQuestions = config.presetQuestions;
