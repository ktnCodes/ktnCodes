export interface PostFrontmatter {
  title: string;
  date: string;
  tags: string[];
  summary: string;
  showToc?: boolean;
}

export interface PostMeta extends PostFrontmatter {
  slug: string;
  readingTime: string;
}

export interface Post extends PostMeta {
  content: string;
}
