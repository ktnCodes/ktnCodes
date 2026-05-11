import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { getAllProjects, getProjectBySlug } from './projects';

const FIXTURES = path.join(__dirname, '__fixtures__/projects');

describe('getAllProjects', () => {
  it('returns parsed projects from the given directory', () => {
    const projects = getAllProjects(FIXTURES);
    const slugs = projects.map((p) => p.frontmatter.slug).sort();
    expect(slugs).toEqual(['alpha', 'beta']);
  });
});

describe('getProjectBySlug', () => {
  it('returns the matching project by slug', () => {
    const project = getProjectBySlug('alpha', FIXTURES);
    expect(project).not.toBeNull();
    expect(project!.frontmatter.name).toBe('Alpha');
    expect(project!.body.trim()).toBe('Alpha body content.');
  });

  it('returns null for unknown slug', () => {
    expect(getProjectBySlug('nonexistent', FIXTURES)).toBeNull();
  });
});

describe('frontmatter validation', () => {
  const INVALID = path.join(__dirname, '__fixtures__/projects-invalid');

  it('throws on missing required fields (slug/name/folder)', () => {
    expect(() => getAllProjects(INVALID)).toThrow(/slug/i);
  });
});
