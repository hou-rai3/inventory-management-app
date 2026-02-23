import Link from "next/link";
import { notFound } from "next/navigation";
import { getBaseUrl } from "@/lib/base-url";
import type { PostWithCategory } from "@/lib/types";

export const dynamic = "force-dynamic";

type Params = { params: { id: string } };

async function fetchPost(id: string): Promise<PostWithCategory | null> {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/posts/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) {
    console.error("Failed to fetch post", await res.text());
    return null;
  }
  return (await res.json()) as PostWithCategory;
}

export default async function PostDetail({ params }: Params) {
  const post = await fetchPost(params.id);
  if (!post) return notFound();

  return (
    <article className="card" style={{ padding: 24 }}>
      <div className="meta">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        {post.category && <span className="badge">{post.category.name}</span>}
      </div>
      <h1 style={{ marginBottom: 6 }}>{post.title}</h1>
      <p className="muted" style={{ marginTop: 0 }}>
        更新日: {new Date(post.updatedAt).toLocaleDateString()}
      </p>
      <div style={{ marginTop: 16, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{post.content}</div>
      <div className="btn-row" style={{ marginTop: 24 }}>
        <Link className="btn secondary" href="/">
          一覧へ戻る
        </Link>
        <Link className="btn" href={`/admin/posts/${post.id}`}>
          管理画面で編集
        </Link>
      </div>
    </article>
  );
}