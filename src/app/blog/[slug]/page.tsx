import { notFound, redirect } from "next/navigation";
import { getBaseUrl } from "@/lib/base-url";
import type { PostWithCategory } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = {
  params: { slug: string };
};

async function fetchPostBySlug(slug: string): Promise<PostWithCategory | null> {
  // Treat slug as the numeric ID to keep backward compatibility with older links.
  const id = Number(slug);
  if (!Number.isFinite(id)) return null;
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/posts/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as PostWithCategory;
}

export default async function PostPage({ params }: Props) {
  const post = await fetchPostBySlug(params.slug);
  if (!post) return notFound();

  // Encourage navigation to the new route shape.
  redirect(`/posts/${post.id}`);
}
