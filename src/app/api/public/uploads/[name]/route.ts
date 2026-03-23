import { NextResponse } from 'next/server';

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

export async function GET(req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const assetName = normalizeAssetName(name);

  if (!assetName) {
    return NextResponse.json({ error: 'Invalid asset name.' }, { status: 400 });
  }

  const url = new URL(req.url);
  url.pathname = `/uploads/${encodeURIComponent(assetName)}`;
  url.search = '';
  return NextResponse.redirect(url);
}
