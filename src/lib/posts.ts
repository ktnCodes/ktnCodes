import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { calculateReadingTime } from "./utils";
import type { Post, PostMeta } from "@/types/posts";

const postsDirectory = path.join(process.cwd(), "content", "posts");

export function getAllPostMeta(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx?$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "",
      tags: data.tags ?? [],
      summary: data.summary ?? "",
      showToc: data.showToc ?? false,
      readingTime: calculateReadingTime(content),
    } satisfies PostMeta;
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  const mdxPath = path.join(postsDirectory, `${slug}.mdx`);
  const mdPath = path.join(postsDirectory, `${slug}.md`);
  const fullPath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;

  if (!fullPath) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    tags: data.tags ?? [],
    summary: data.summary ?? "",
    showToc: data.showToc ?? false,
    readingTime: calculateReadingTime(content),
    content,
  };
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPostMeta();
  const tagCounts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPostMeta().filter((post) => post.tags.includes(tag));
}

export function getArchivesByYear(): { year: string; posts: PostMeta[] }[] {
  const posts = getAllPostMeta();
  const grouped = new Map<string, PostMeta[]>();

  for (const post of posts) {
    const year = new Date(post.date).getFullYear().toString();
    if (!grouped.has(year)) grouped.set(year, []);
    grouped.get(year)!.push(post);
  }

  return Array.from(grouped.entries())
    .map(([year, posts]) => ({ year, posts }))
    .sort((a, b) => Number(b.year) - Number(a.year));
}

export function searchPosts(query: string): PostMeta[] {
  const q = query.toLowerCase();
  return getAllPostMeta().filter(
    (post) =>
      post.title.toLowerCase().includes(q) ||
      post.summary.toLowerCase().includes(q) ||
      post.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}
