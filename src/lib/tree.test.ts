import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { getTree } from './tree';

const FIXTURES = path.join(__dirname, '__fixtures__');

const basicOpts = {
  treeFile: path.join(FIXTURES, 'tree-basic/tree.json'),
  projectsDir: path.join(FIXTURES, 'tree-basic/projects'),
};

describe('getTree', () => {
  it('returns folders defined in tree.json', () => {
    const tree = getTree(basicOpts);
    expect(tree.folders.map((f) => f.slug)).toEqual(['a', 'b', 'c']);
  });

  it('preserves special leaves (type=link) from tree.json', () => {
    const tree = getTree({
      treeFile: path.join(FIXTURES, 'tree-with-leaves/tree.json'),
      projectsDir: path.join(FIXTURES, 'tree-with-leaves/projects'),
    });
    const leaves = tree.folders[0].leaves;
    expect(leaves).toHaveLength(1);
    expect(leaves[0]).toMatchObject({
      slug: 'blog',
      type: 'link',
      href: '/posts',
    });
  });

  it('auto-discovers project leaves from .md files via the folder field', () => {
    const tree = getTree({
      treeFile: path.join(FIXTURES, 'tree-with-projects/tree.json'),
      projectsDir: path.join(FIXTURES, 'tree-with-projects/projects'),
    });
    const folderA = tree.folders.find((f) => f.slug === 'a');
    const folderB = tree.folders.find((f) => f.slug === 'b');
    expect(folderA?.leaves.map((l) => l.slug).sort()).toEqual(['eta', 'zeta']);
    expect(folderB?.leaves.map((l) => l.slug)).toEqual(['theta']);
    expect(folderA?.leaves[0].type).toBe('project');
  });

  it('sorts project leaves within a folder by order ascending', () => {
    const tree = getTree({
      treeFile: path.join(FIXTURES, 'tree-with-projects/tree.json'),
      projectsDir: path.join(FIXTURES, 'tree-with-projects/projects'),
    });
    const folderA = tree.folders.find((f) => f.slug === 'a');
    expect(folderA?.leaves.map((l) => l.slug)).toEqual(['eta', 'zeta']);
  });

  it('skips project files with invalid frontmatter rather than throwing', () => {
    const tree = getTree({
      treeFile: path.join(FIXTURES, 'tree-with-invalid/tree.json'),
      projectsDir: path.join(FIXTURES, 'tree-with-invalid/projects'),
    });
    const folderA = tree.folders.find((f) => f.slug === 'a');
    expect(folderA?.leaves.map((l) => l.slug)).toEqual(['good']);
  });

  it('works when projects directory does not exist', () => {
    const tree = getTree(basicOpts);
    expect(tree.folders.every((f) => Array.isArray(f.leaves))).toBe(true);
  });
});
