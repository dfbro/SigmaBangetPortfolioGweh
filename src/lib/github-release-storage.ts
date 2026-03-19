import { getGHConfig, validateGHConfig } from '@/config/config';

export const getGithubHeaders = (
  token: string,
  accept = 'application/vnd.github+json'
): Record<string, string> => ({
  Authorization: `Bearer ${token}`,
  Accept: accept,
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'SigmaBangetPortfolioGweh',
});

export interface GetReleaseOptions {
  Tag?: string;
  Token?: string;
  Owner?: string;
  Repo?: string;
}

export interface GHRelease {
  tag_name: string;
  created_at: string;
  updated_at: string;
  id: number;
  url: string;
  assets_url: string;
  upload_url: string;
  assets?: Array<{
    id: number;
    name: string;
    content_type: string;
    browser_download_url: string;
    created_at: string;
    updated_at: string;
    size: number;
    digest?: string;
    url: string;
  }>;
}

export interface GHAssetSuccess {
  name?: string;
  isOK: true;
  objectId: number;
  objectUrl: string;
  content_type: string;
  downloadUrl?: string;
}

export interface GHAssetError {
  isOK: false;
  error: string;
  originErr?: unknown;
  originErrStatusCode?: number;
}

export type GHAsset = GHAssetSuccess | GHAssetError;

export interface CheckAssetExistsResult {
  doesExist: boolean;
}

export interface DeleteGHAssetSuccess {
  isOK: true;
  message: string;
}

export interface DeleteGHAssetError {
  isOK: false;
  error: string;
  details?: unknown;
}

export type DeleteGHAssetResult = DeleteGHAssetSuccess | DeleteGHAssetError;

export interface UploadGHAssetResponse {
  id: number;
  url: string;
  content_type: string;
  name: string;
  message?: string;
  errors?: Array<{ resource: string; code: string; field: string; message: string }>;
}

export interface DownloadGHAssetSuccess {
  isOK: true;
  response: Response;
  contentType: string;
}

export interface DownloadGHAssetError {
  isOK: false;
  error: string;
  status?: number;
}

export type DownloadGHAssetResult = DownloadGHAssetSuccess | DownloadGHAssetError;

function resolveGithubConfig(options: GetReleaseOptions = {}) {
  const envConfig = getGHConfig();

  const config = {
    Owner: options.Owner ?? envConfig.OWNER,
    Repo: options.Repo ?? envConfig.REPO,
    Token: options.Token ?? envConfig.TOKEN,
    Tag: options.Tag ?? envConfig.Release_Tag,
  };

  validateGHConfig({
    OWNER: config.Owner,
    REPO: config.Repo,
    TOKEN: config.Token,
    Release_Tag: config.Tag,
  });

  return config;
}

async function tryReadJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function buildStorageAssetUrl(name: string): string {
  return `/api/public/uploads/${encodeURIComponent(name)}`;
}

export const getReleaseByTag = async ({
  Tag,
  Token,
  Owner,
  Repo,
}: GetReleaseOptions = {}): Promise<GHRelease | null> => {
  try {
    const config = resolveGithubConfig({ Tag, Token, Owner, Repo });
    const ghUrl = `https://api.github.com/repos/${config.Owner}/${config.Repo}/releases/tags/${config.Tag}`;

    const response = await fetch(ghUrl, {
      headers: getGithubHeaders(config.Token),
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as GHRelease;
  } catch {
    return null;
  }
};

export const getAssetByName = async (
  name: string,
  { Tag, Token, Owner, Repo }: GetReleaseOptions = {}
): Promise<GHAsset> => {
  try {
    const release = await getReleaseByTag({ Tag, Token, Owner, Repo });

    if (!release || !release.assets) {
      return { error: 'Release not found.', isOK: false };
    }

    const objectData = release.assets.find((asset) => asset.name === name);
    if (!objectData) {
      return { error: 'Asset not found in release.', isOK: false };
    }

    return {
      objectUrl: objectData.url,
      objectId: objectData.id,
      content_type: objectData.content_type,
      downloadUrl: objectData.browser_download_url,
      name: objectData.name,
      isOK: true,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to resolve GitHub asset.',
      originErr: error,
      isOK: false,
    };
  }
};

export const checkAssetExists = async (
  name: string,
  options: GetReleaseOptions = {}
): Promise<CheckAssetExistsResult> => {
  const check = await getAssetByName(name, options);
  return { doesExist: check.isOK };
};

export const deleteAssetByName = async (
  name: string,
  { Tag, Token, Owner, Repo }: GetReleaseOptions = {}
): Promise<DeleteGHAssetResult> => {
  const asset = await getAssetByName(name, { Tag, Token, Owner, Repo });

  if (!asset.isOK) {
    return { error: asset.error, isOK: false };
  }

  try {
    const config = resolveGithubConfig({ Tag, Token, Owner, Repo });
    const response = await fetch(asset.objectUrl, {
      method: 'DELETE',
      headers: getGithubHeaders(config.Token),
    });

    if (response.status === 204) {
      return { message: `Asset '${name}' deleted successfully.`, isOK: true };
    }

    const errorData = await tryReadJson(response);
    return { error: 'Failed to delete asset.', details: errorData, isOK: false };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Internal Server Error',
      details: error,
      isOK: false,
    };
  }
};

export const uploadAssetStream = async (
  name: string,
  fileStream: ReadableStream<Uint8Array>,
  contentType: string,
  contentLength: number,
  { Tag, Token, Owner, Repo }: GetReleaseOptions = {}
): Promise<GHAsset> => {
  try {
    const config = resolveGithubConfig({ Tag, Token, Owner, Repo });

    const release = await getReleaseByTag({
      Tag: config.Tag,
      Token: config.Token,
      Owner: config.Owner,
      Repo: config.Repo,
    });

    if (!release) {
      return { error: 'Release not found.', isOK: false };
    }

    const uploadUrl = release.upload_url.replace(
      '{?name,label}',
      `?name=${encodeURIComponent(name)}`
    );

    const requestInit = {
      method: 'POST',
      headers: {
        ...getGithubHeaders(config.Token),
        'Content-Type': contentType || 'application/octet-stream',
        'Content-Length': String(contentLength),
      },
      body: fileStream as unknown as BodyInit,
      duplex: 'half' as const,
    };

    const response = await fetch(uploadUrl, requestInit as RequestInit);
    const result = (await tryReadJson(response)) as UploadGHAssetResponse | null;

    if (!response.ok) {
      return {
        error: result?.message ?? 'GitHub upload failed.',
        originErr: result?.errors ?? null,
        originErrStatusCode: response.status,
        isOK: false,
      };
    }

    if (!result) {
      return {
        error: 'GitHub upload returned an empty response.',
        originErrStatusCode: response.status,
        isOK: false,
      };
    }

    return {
      objectId: result.id,
      objectUrl: result.url,
      content_type: result.content_type,
      name: result.name,
      isOK: true,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Stream upload error.',
      originErr: error,
      isOK: false,
    };
  }
};

export const downloadAssetByName = async (
  name: string,
  { Tag, Token, Owner, Repo }: GetReleaseOptions = {}
): Promise<DownloadGHAssetResult> => {
  try {
    const config = resolveGithubConfig({ Tag, Token, Owner, Repo });
    const asset = await getAssetByName(name, {
      Tag: config.Tag,
      Token: config.Token,
      Owner: config.Owner,
      Repo: config.Repo,
    });

    if (!asset.isOK) {
      return { error: asset.error, status: asset.originErrStatusCode, isOK: false };
    }

    const response = await fetch(asset.objectUrl, {
      headers: getGithubHeaders(config.Token, 'application/octet-stream'),
    });

    if (!response.ok || !response.body) {
      return {
        error: `Failed to fetch asset content (${response.status}).`,
        status: response.status,
        isOK: false,
      };
    }

    return {
      isOK: true,
      response,
      contentType: response.headers.get('content-type') ?? asset.content_type,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to download asset from GitHub.',
      status: 500,
      isOK: false,
    };
  }
};
