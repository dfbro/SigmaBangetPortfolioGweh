import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { getSessionFromRequest } from '@/lib/session';

function normalizeAssetName(rawName: string): string | null {
  const candidate = rawName.trim();

  if (!candidate) {
    return null;
  }

  if (candidate.includes('/') || candidate.includes('\\') || /[\u0000-\u001f\u007f]/.test(candidate)) {
    return null;
  }

  return candidate;
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  if (!getSessionFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { name } = await params;
  const assetName = normalizeAssetName(name);

  if (!assetName) {
    return NextResponse.json({ error: 'Invalid asset name.' }, { status: 400 });
  }

  try {
    const filePath = join(process.cwd(), 'public', 'uploads', assetName);
    await unlink(filePath);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === 'ENOENT') {
      return NextResponse.json({ error: 'Asset not found.' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to delete asset.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, name: assetName, message: `Asset '${assetName}' deleted successfully.` });
}
