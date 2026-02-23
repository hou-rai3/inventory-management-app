"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { Category } from "@/lib/types";

type Props = { params: { id: string } };

export default function EditCategoryPage({ params }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("読み込みに失敗しました");
        const data = (await res.json()) as { categories: Category[] };
        const cat = data.categories.find((c) => c.id === Number(params.id));
        if (!cat) throw new Error("指定されたカテゴリが見つかりません");
        setName(cat.name);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [params.id]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const res = await fetch(`/api/admin/categories/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "更新に失敗しました");
      return;
    }
    router.push("/admin/categories");
  };

  const handleDelete = async () => {
    const ok = window.confirm("このカテゴリと関連投稿を削除しますか？");
    if (!ok) return;
    const res = await fetch(`/api/admin/categories/${params.id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "削除に失敗しました");
      return;
    }
    router.push("/admin/categories");
  };

  if (loading) return <p className="muted">読み込み中...</p>;

  return (
    <section className="card" style={{ padding: 24 }}>
      <p className="badge">Admin</p>
      <h1>カテゴリを編集</h1>
      <form className="stack" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">カテゴリ名</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        {error && <p className="muted">{error}</p>}
        <div className="btn-row">
          <button className="btn" type="submit">
            保存する
          </button>
          <button className="btn danger" type="button" onClick={handleDelete}>
            削除する
          </button>
        </div>
      </form>
    </section>
  );
}
