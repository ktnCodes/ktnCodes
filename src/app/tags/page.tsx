import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags } from "@/lib/posts";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export const metadata: Metadata = {
  title: "Tags",
  description: "Browse posts by topic.",
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 py-16 overflow-y-auto">
      <div className="mb-10 space-y-3">
        <SectionEyebrow>TAGS</SectionEyebrow>
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-light tracking-tight">
          Browse by topic.
        </h1>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className="small-caps text-[11px] text-foreground border border-[var(--hairline)] px-3 py-1.5 hover:border-accent hover:text-accent transition-colors"
          >
            {tag}
            <span className="ml-2 text-muted text-[10px]">{count}</span>
          </Link>
        ))}
      </div>
      {tags.length === 0 && (
        <p className="small-caps text-[11px] text-muted">No tags yet.</p>
      )}
    </div>
  );
}
