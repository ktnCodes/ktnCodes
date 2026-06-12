"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { PostCard } from "@/components/posts/post-card";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import type { PostMeta } from "@/types/posts";

function filterPosts(all: PostMeta[], value: string): PostMeta[] {
  const q = value.toLowerCase();
  return all.filter(
    (post) =>
      post.title.toLowerCase().includes(q) ||
      post.summary.toLowerCase().includes(q) ||
      post.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

function SearchPageInner() {
  // Deep-linkable: /search?q=term (used by the Finder toolbar search).
  const initialQuery = useSearchParams().get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const allPostsRef = useRef<PostMeta[] | null>(null);

  // Run the initial search for a deep-linked query once posts are fetched.
  useEffect(() => {
    if (!initialQuery.trim()) return;
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/posts");
      const all = (await res.json()) as PostMeta[];
      if (cancelled) return;
      allPostsRef.current = all;
      setPosts(filterPosts(all, initialQuery));
    })();
    return () => {
      cancelled = true;
    };
  }, [initialQuery]);

  const handleSearch = useCallback(async (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setPosts([]);
      return;
    }
    if (!allPostsRef.current) {
      const res = await fetch("/api/posts");
      allPostsRef.current = (await res.json()) as PostMeta[];
    }
    setPosts(filterPosts(allPostsRef.current, value));
  }, []);

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

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageInner />
    </Suspense>
  );
}
