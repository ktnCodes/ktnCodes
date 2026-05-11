import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { PostMeta } from "@/types/posts";

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group relative bg-surface border border-hairline rounded-3xl p-(--space-md) transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5">
      <div className="flex flex-col gap-(--space-sm)">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="h-px w-6 bg-hairline" />
          <span>{post.readingTime}</span>
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-foreground leading-tight">
          <Link
            href={`/posts/${post.slug}`}
            className="after:absolute after:inset-0 after:rounded-3xl group-hover:text-foreground/80 transition-colors"
          >
            {post.title}
          </Link>
        </h2>

        {post.summary && (
          <p className="text-sm text-foreground/75 leading-relaxed line-clamp-2">
            {post.summary}
          </p>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="relative z-10 text-[11px] text-muted bg-(--surface-alt) border border-hairline rounded-full px-2.5 py-1 hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
