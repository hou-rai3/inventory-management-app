import { NextResponse } from 'next/server';
import { getPost } from '@/lib/storage';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'IDが不正です' }, { status: 400 });
  }

  const post = await getPost(id);
  if (!post) {
    return NextResponse.json({ error: '投稿が見つかりません' }, { status: 404 });
  }

  return NextResponse.json(post);
}
