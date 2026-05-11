import { NextResponse } from "next/server";
import { getAllPostMeta } from "@/lib/posts";

export async function GET() {
  const posts = getAllPostMeta();
  return NextResponse.json(posts);
}
