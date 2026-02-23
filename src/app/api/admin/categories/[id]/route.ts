import { NextResponse } from 'next/server';
import { deleteCategory, updateCategory } from '@/lib/storage';
import type { CategoryPayload } from '@/lib/types';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'IDが不正です' }, { status: 400 });
  }

  try {
    const payload = (await request.json()) as CategoryPayload;
    const category = await updateCategory(id, payload);
    return NextResponse.json(category);
  } catch (error) {
    const message = error instanceof Error ? error.message : '更新に失敗しました';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'IDが不正です' }, { status: 400 });
  }

  try {
    await deleteCategory(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : '削除に失敗しました';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
