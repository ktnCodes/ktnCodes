import type { MetadataRoute } from "next";
import { getAllPostMeta, getAllTags } from "@/lib/posts";

const BASE_URL = "https://ktncodes.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/posts`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/search`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/tags`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/archives`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const posts: MetadataRoute.Sitemap = getAllPostMeta().map((post) => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const tags: MetadataRoute.Sitemap = getAllTags().map(({ tag }) => ({
    url: `${BASE_URL}/tags/${encodeURIComponent(tag)}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticRoutes, ...posts, ...tags];
}
