import { describe, it, expect } from "vitest";
import { getAllPostMeta, getPostBySlug } from "./posts";

describe("getPostBySlug slug guard", () => {
  it("rejects path traversal and junk slugs", () => {
    expect(getPostBySlug("../../package")).toBeNull();
    expect(getPostBySlug("..\\..\\secrets")).toBeNull();
    expect(getPostBySlug("a/b")).toBeNull();
    expect(getPostBySlug("post.name")).toBeNull();
    expect(getPostBySlug("")).toBeNull();
  });

  it("returns a real post for a valid slug", () => {
    const meta = getAllPostMeta();
    expect(meta.length).toBeGreaterThan(0);
    const first = meta[0]!;
    const post = getPostBySlug(first.slug);
    expect(post).not.toBeNull();
    expect(post!.title).toBe(first.title);
    expect(post!.content.length).toBeGreaterThan(0);
  });
});

describe("post content validation", () => {
  it("every committed post passes schema validation", () => {
    // getAllPostMeta throws on any frontmatter that fails the zod schema,
    // so this doubles as a lint over the whole content/posts corpus.
    const meta = getAllPostMeta();
    for (const m of meta) {
      expect(m.title).toBeTruthy();
      expect(m.date).toBeTruthy();
      expect(Array.isArray(m.tags)).toBe(true);
    }
  });

  it("sorts posts newest first", () => {
    const meta = getAllPostMeta();
    for (let i = 1; i < meta.length; i++) {
      const prev = new Date(meta[i - 1]!.date).getTime();
      const cur = new Date(meta[i]!.date).getTime();
      expect(prev).toBeGreaterThanOrEqual(cur);
    }
  });
});
