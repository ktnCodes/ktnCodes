export type ProjectStatus = 'planned' | 'in-progress' | 'active' | 'released' | 'archived';

export interface ProjectFrontmatter {
  slug: string;
  name: string;
  folder: string;
  tagline?: string;
  status?: ProjectStatus;
  tech?: string[];
  github?: string | null;
  demo?: string | null;
  started?: string;
  order?: number;
  icon?: string;
  featured?: boolean;
  screenshot?: string;
  cover_color?: string;
}

export interface Project {
  frontmatter: ProjectFrontmatter;
  body: string;
}

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const DEFAULT_DIR = path.join(process.cwd(), 'content/projects');

export const PROJECT_REQUIRED_FIELDS = ['slug', 'name', 'folder'] as const;

export function isValidProjectFrontmatter(data: Record<string, unknown>): boolean {
  return PROJECT_REQUIRED_FIELDS.every(
    (key) => typeof data[key] === 'string' && data[key] !== '',
  );
}

function validateFrontmatter(data: Record<string, unknown>, file: string): ProjectFrontmatter {
  for (const key of PROJECT_REQUIRED_FIELDS) {
    if (typeof data[key] !== 'string' || !data[key]) {
      throw new Error(`Project ${file}: missing required field "${key}"`);
    }
  }
  return data as unknown as ProjectFrontmatter;
}

export function getAllProjects(dir: string = DEFAULT_DIR): Project[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.md') && !/^[A-Z]/.test(file))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      const { data, content } = matter(raw);
      return {
        frontmatter: validateFrontmatter(data, file),
        body: content,
      };
    });
}

export function getProjectBySlug(slug: string, dir: string = DEFAULT_DIR): Project | null {
  return getAllProjects(dir).find((p) => p.frontmatter.slug === slug) ?? null;
}
