import type { Metadata } from "next";
import Link from "next/link";
import { getArchivesByYear } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export const metadata: Metadata = {
  title: "Archives",
  description: "All posts by date.",
};

export default function ArchivesPage() {
  const archives = getArchivesByYear();

  return (
    <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 py-16 overflow-y-auto">
      <div className="mb-12 space-y-3">
        <SectionEyebrow>ARCHIVES</SectionEyebrow>
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-light tracking-tight">
          Everything, by date.
        </h1>
      </div>
      <div className="space-y-12">
        {archives.map(({ year, posts }) => (
          <section
            key={year}
            className="space-y-5 border-t border-[var(--hairline)] pt-8"
          >
            <div className="flex items-baseline gap-4">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-light tracking-tight text-accent">
                {year}
              </h2>
              <span className="small-caps text-[11px] text-muted">
                {posts.length} POST{posts.length !== 1 ? "S" : ""}
              </span>
            </div>
            <ul className="space-y-3">
              {posts.map((post) => (
                <li
                  key={post.slug}
                  className="flex items-baseline gap-4 group"
                >
                  <time
                    dateTime={post.date}
                    className="small-caps text-[11px] text-muted whitespace-nowrap min-w-[110px]"
                  >
                    {formatDate(post.date)}
                  </time>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-sm text-foreground hover:text-accent transition-colors"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      {archives.length === 0 && (
        <p className="small-caps text-[11px] text-muted">No posts yet.</p>
      )}
    </div>
  );
}
