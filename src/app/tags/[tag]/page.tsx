import type { Metadata } from "next";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { PostCard } from "@/components/posts/post-card";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export async function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `#${decoded}`,
    description: `Posts tagged with "${decoded}".`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getPostsByTag(decoded);

  return (
    <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 py-16 overflow-y-auto">
      <div className="mb-10 space-y-3">
        <SectionEyebrow>TAG</SectionEyebrow>
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-light tracking-tight">
          <span className="text-accent">#</span>
          {decoded}
        </h1>
        <p className="small-caps text-[11px] text-muted">
          {posts.length} POST{posts.length !== 1 ? "S" : ""}
        </p>
      </div>
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
