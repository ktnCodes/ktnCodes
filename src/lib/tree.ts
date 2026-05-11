import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { isValidProjectFrontmatter } from './projects';

export type LeafType = 'project' | 'link' | 'context';

export interface FolderLeaf {
  slug: string;
  label: string;
  type: LeafType;
  href?: string;
  contentPath?: string;
}

export interface Folder {
  slug: string;
  label: string;
  contextMd?: string;
  leaves: FolderLeaf[];
}

export interface Tree {
  folders: Folder[];
}

export interface GetTreeOptions {
  treeFile?: string;
  projectsDir?: string;
}

interface RawFolder {
  slug: string;
  label: string;
  contextMd?: string;
  leaves?: FolderLeaf[];
}

interface RawTree {
  folders: RawFolder[];
}

interface DiscoveredProject {
  slug: string;
  folder: string;
  order: number;
}

const DEFAULT_TREE_FILE = path.join(process.cwd(), 'content/tree.json');
const DEFAULT_PROJECTS_DIR = path.join(process.cwd(), 'content/projects');

function discoverProjects(dir: string): DiscoveredProject[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((file): DiscoveredProject | null => {
      try {
        const raw = fs.readFileSync(path.join(dir, file), 'utf8');
        const { data } = matter(raw);
        if (!isValidProjectFrontmatter(data)) return null;
        return {
          slug: data.slug as string,
          folder: data.folder as string,
          order: typeof data.order === 'number' ? data.order : Number.MAX_SAFE_INTEGER,
        };
      } catch {
        return null;
      }
    })
    .filter((p): p is DiscoveredProject => p !== null);
}

export function getTree(options: GetTreeOptions = {}): Tree {
  const treeFile = options.treeFile ?? DEFAULT_TREE_FILE;
  const projectsDir = options.projectsDir ?? DEFAULT_PROJECTS_DIR;

  const raw = JSON.parse(fs.readFileSync(treeFile, 'utf8')) as RawTree;
  const projects = discoverProjects(projectsDir);

  return {
    folders: raw.folders.map((folder) => {
      const projectLeaves: FolderLeaf[] = projects
        .filter((p) => p.folder === folder.slug)
        .sort((a, b) => a.order - b.order)
        .map((p) => ({
          slug: p.slug,
          label: `${p.slug}.md`,
          type: 'project',
        }));
      return {
        slug: folder.slug,
        label: folder.label,
        contextMd: folder.contextMd,
        leaves: [...(folder.leaves ?? []), ...projectLeaves],
      };
    }),
  };
}
