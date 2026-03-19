'use server';

export type ContentRefinementType =
  | 'about_me'
  | 'project_description'
  | 'ctf_writeup_summary';

export interface ContentRefinementInput {
  originalContent: string;
  contentType: ContentRefinementType;
  keywords?: string[];
  desiredTone?: string;
}

export interface ContentRefinementOutput {
  refinedContent: string;
  usedKeywords?: string[];
}

const contentTypeLabels: Record<ContentRefinementType, string> = {
  about_me: 'About Me',
  project_description: 'Project Description',
  ctf_writeup_summary: 'CTF Write-up Summary',
};

function normalizeWhitespace(input: string): string {
  return input
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');
}

function normalizeKeywords(keywords: string[] | undefined): string[] {
  if (!keywords?.length) {
    return [];
  }

  return Array.from(
    new Set(
      keywords
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 0)
    )
  );
}

function ensureTerminalPunctuation(text: string): string {
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

export async function refineContent(
  input: ContentRefinementInput
): Promise<ContentRefinementOutput> {
  const originalContent = input.originalContent?.trim();
  if (!originalContent) {
    throw new Error('Original content is required.');
  }

  const tone = input.desiredTone?.trim() || 'professional hacker';
  const keywords = normalizeKeywords(input.keywords);
  const normalizedBody = ensureTerminalPunctuation(
    normalizeWhitespace(originalContent)
  );

  const header = `${contentTypeLabels[input.contentType]} — refined draft`;
  const toneLine = `Tone target: ${tone}.`;
  const keywordLine = keywords.length
    ? `Focus keywords: ${keywords.join(', ')}.`
    : null;

  const refinedContent = [header, normalizedBody, toneLine, keywordLine]
    .filter((line): line is string => Boolean(line))
    .join('\n\n');

  return {
    refinedContent,
    usedKeywords: keywords,
  };
}
