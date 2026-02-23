import Link from "next/link";
import { getBaseUrl } from "@/lib/base-url";
import type { PostWithCategory } from "@/lib/types";

export const dynamic = "force-dynamic";

async function fetchPosts(): Promise<PostWithCategory[]> {
  const base = await getBaseUrl();
  const res = await fetch(`${base}/api/posts`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = (await res.json()) as { posts: PostWithCategory[] };
  return data.posts;
}

export default async function BlogPage() {
  const posts = await fetchPosts();

  return (
    <div className="stack">
      <h1>ブログ記事一覧</h1>
      <p className="muted">古い /blog パス用のエイリアスです。リンクは /posts/{'{id}'} に向きます。</p>
      <div className="grid">
        {posts.map((post) => (
          <article key={post.id} className="card">
            <div className="meta">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              {post.category && <span className="badge">{post.category.name}</span>}
            </div>
            <h2>
              <Link href={`/posts/${post.id}`}>{post.title}</Link>
            </h2>
            <p className="muted">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
