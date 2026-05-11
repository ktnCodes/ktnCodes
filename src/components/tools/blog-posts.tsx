import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { PostMeta } from "@/types/posts";

interface Props {
  posts: PostMeta[];
  query: string;
}

export function BlogPosts({ posts, query }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted mb-2">
        {query === "recent"
          ? "Recent posts:"
          : `Posts related to "${query}":`}
      </p>
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/posts/${post.slug}`}
          className="block rounded-lg border border-border bg-surface p-3 hover:border-accent/40 transition-colors"
        >
          <h4 className="font-medium text-sm mb-1">{post.title}</h4>
          <div className="flex items-center gap-2 text-xs text-muted">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>&middot;</span>
            <span>{post.readingTime}</span>
          </div>
          {post.summary && (
            <p className="text-xs text-foreground/60 mt-1 line-clamp-1">
              {post.summary}
            </p>
          )}
        </Link>
      ))}
      {posts.length === 0 && (
        <p className="text-sm text-muted">No posts found on that topic yet.</p>
      )}
    </div>
  );
}
