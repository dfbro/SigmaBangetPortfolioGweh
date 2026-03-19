import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';
import { buildStorageAssetUrl, uploadAssetStream } from '@/lib/github-release-storage';

const MAX_SIZE = 100 * 1024 * 1024; // 100 MB

function sanitizeFileName(name: string): string {
  const sanitized = name
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-{2,}/g, '-');

  return sanitized || 'file.bin';
}

function resolveAssetName(file: File): string {
  const originalName = sanitizeFileName(file.name || 'file.bin');
  return `${crypto.randomUUID()}-${originalName}`;
}

function normalizeStatusCode(statusCode?: number): number {
  if (!statusCode) {
    return 500;
  }

  return statusCode >= 400 && statusCode <= 599 ? statusCode : 500;
}

export async function POST(req: NextRequest) {
  if (!getSessionFromRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const contentLengthHeader = req.headers.get('content-length');
  const contentLength = contentLengthHeader ? Number(contentLengthHeader) : null;
  if (contentLength && Number.isFinite(contentLength) && contentLength > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Maximum size is 100 MB.' }, { status: 413 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid multipart form data.' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  }

  if (file.size <= 0) {
    return NextResponse.json({ error: 'File is empty.' }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Maximum size is 100 MB.' }, { status: 413 });
  }

  const assetName = resolveAssetName(file);
  const uploaded = await uploadAssetStream(
    assetName,
    file.stream() as ReadableStream<Uint8Array>,
    file.type || 'application/octet-stream',
    file.size
  );

  if (!uploaded.isOK) {
    return NextResponse.json(
      {
        error: uploaded.error,
      },
      { status: normalizeStatusCode(uploaded.originErrStatusCode) }
    );
  }

  return NextResponse.json(
    {
      url: buildStorageAssetUrl(assetName),
      assetName,
      contentType: uploaded.content_type,
    },
    { status: 201 }
  );
}
