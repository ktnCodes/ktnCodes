import type { Metadata } from "next";
import { getAllPostMeta } from "@/lib/posts";
import { PostCard } from "@/components/posts/post-card";

export const metadata: Metadata = {
  title: "Posts",
  description:
    "Articles on agentic engineering, embedded systems, and software development.",
};

export default function PostsPage() {
  const posts = getAllPostMeta();

  return (
    <div className="px-(--space-lg) py-(--space-2xl)">
      <div className="max-w-5xl mx-auto">
        <header className="mb-(--space-2xl)">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted mb-(--space-sm)">
            Posts
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight leading-[1.05] mb-(--space-md)">
            Notes from the workshop.
          </h1>
          <p className="text-base md:text-lg text-muted leading-relaxed max-w-2xl">
            Agentic engineering, embedded debugging war stories, and tooling writeups.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            No posts yet.
          </p>
        ) : (
          <div className="grid gap-(--space-sm)">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
