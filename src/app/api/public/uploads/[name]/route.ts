import { NextResponse } from 'next/server';
import { downloadAssetByName } from '@/lib/github-release-storage';

export const dynamic = 'force-dynamic';

function normalizeStatusCode(status?: number): number {
  if (!status) {
    return 502;
  }

  return status >= 400 && status <= 599 ? status : 502;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name: rawName } = await params;
  const assetName = decodeURIComponent(rawName);

  const downloaded = await downloadAssetByName(assetName);

  if (!downloaded.isOK) {
    return NextResponse.json(
      {
        error: downloaded.error,
      },
      {
        status:
          downloaded.error.toLowerCase().includes('not found')
            ? 404
            : normalizeStatusCode(downloaded.status),
      }
    );
  }

  const headers = new Headers();
  headers.set('Content-Type', downloaded.contentType || 'application/octet-stream');

  const contentLength = downloaded.response.headers.get('content-length');
  if (contentLength) {
    headers.set('Content-Length', contentLength);
  }

  const contentDisposition = downloaded.response.headers.get('content-disposition');
  if (contentDisposition) {
    headers.set('Content-Disposition', contentDisposition);
  }

  headers.set('Cache-Control', 'public, max-age=3600');

  return new NextResponse(downloaded.response.body, {
    status: 200,
    headers,
  });
}
