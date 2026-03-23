import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { getSessionFromRequest } from '@/lib/session';

const MAX_SIZE = 100 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

function sanitizeFileName(fileName: string): string {
  const normalized = (fileName || 'file.bin')
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-{2,}/g, '-');

  return normalized || 'file.bin';
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

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: `Unsupported file type "${file.type}". Allowed: jpeg, png, gif, webp, avif.` },
      { status: 415 }
    );
  }

  const bytes = await file.arrayBuffer();
  const uploadsDir = join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDir, { recursive: true });

  const sanitizedBaseName = sanitizeFileName(file.name).replace(/\.[a-zA-Z0-9]+$/, '');
  const storedName = `${randomUUID()}-${sanitizedBaseName}.${ext}`;
  await writeFile(join(uploadsDir, storedName), Buffer.from(bytes));

  return NextResponse.json(
    {
      url: `/uploads/${storedName}`,
      assetName: storedName,
      contentType: file.type || 'application/octet-stream',
    },
    { status: 201 }
  );
}
