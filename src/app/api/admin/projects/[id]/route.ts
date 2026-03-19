import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';
import { deleteProject, updateProject } from '@/lib/server-storage';
import type { ProjectRecord } from '@/lib/portfolio-types';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!getSessionFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await params;
  const data = (await req.json()) as Partial<ProjectRecord>;
  await updateProject(id, data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!getSessionFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await params;
  await deleteProject(id);
  return NextResponse.json({ ok: true });
}
