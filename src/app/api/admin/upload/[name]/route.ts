import { NextRequest, NextResponse } from 'next/server';
import { deleteAssetByName } from '@/lib/github-release-storage';
import { getSessionFromRequest } from '@/lib/session';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  if (!getSessionFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { name: rawName } = await params;
  const assetName = decodeURIComponent(rawName);

  const result = await deleteAssetByName(assetName);

  if (!result.isOK) {
    return NextResponse.json(
      {
        error: result.error,
      },
      {
        status: result.error.toLowerCase().includes('not found') ? 404 : 502,
      }
    );
  }

  return NextResponse.json({ ok: true, message: result.message });
}
