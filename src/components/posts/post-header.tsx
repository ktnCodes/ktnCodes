import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { PostMeta } from "@/types/posts";

export function PostHeader({ post }: { post: PostMeta }) {
  return (
    <header className="mb-(--space-xl) flex flex-col gap-(--space-sm)">
      <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span className="h-px w-6 bg-hairline" />
        <span>{post.readingTime}</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight leading-[1.05]">
        {post.title}
      </h1>
      {post.summary && (
        <p className="text-base md:text-lg text-muted leading-relaxed max-w-2xl">
          {post.summary}
        </p>
      )}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-(--space-sm)">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag}`}
              className="text-[11px] text-muted bg-(--surface-alt) border border-hairline rounded-full px-2.5 py-1 hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
