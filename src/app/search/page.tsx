"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { PostCard } from "@/components/posts/post-card";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import type { PostMeta } from "@/types/posts";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [allPosts, setAllPosts] = useState<PostMeta[] | null>(null);

  const loadPosts = async () => {
    if (allPosts) return allPosts;
    const res = await fetch("/api/posts");
    const data = await res.json();
    setAllPosts(data);
    return data as PostMeta[];
  };

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setPosts([]);
      return;
    }
    const all = await loadPosts();
    const q = value.toLowerCase();
    const filtered = all.filter(
      (post: PostMeta) =>
        post.title.toLowerCase().includes(q) ||
        post.summary.toLowerCase().includes(q) ||
        post.tags.some((tag: string) => tag.toLowerCase().includes(q))
    );
    setPosts(filtered);
  };

  return (
    <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 py-16 overflow-y-auto">
      <div className="mb-10 space-y-3">
        <SectionEyebrow>SEARCH</SectionEyebrow>
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-light tracking-tight">
          Find a post.
        </h1>
      </div>
      <div className="relative mb-8">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[var(--surface)] border border-[var(--hairline)] text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors text-sm"
        />
      </div>
      {query && (
        <p className="small-caps text-[11px] text-muted mb-6">
          {posts.length} RESULT{posts.length !== 1 ? "S" : ""} FOR &ldquo;{query}&rdquo;
        </p>
      )}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
