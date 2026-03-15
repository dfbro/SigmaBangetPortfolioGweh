'use server';
/**
 * @fileOverview An AI assistant flow for drafting and refining professional summaries and descriptions for a portfolio.
 *
 * - refineContent - A function that handles the content refinement process.
 * - ContentRefinementInput - The input type for the refineContent function.
 * - ContentRefinementOutput - The return type for the refineContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentRefinementInputSchema = z.object({
  originalContent: z
    .string()
    .describe('The original text content to be refined or drafted.'),
  contentType: z
    .enum(['about_me', 'project_description', 'ctf_writeup_summary'])
    .describe(
      'The type of content being refined (e.g., "about me", "project description", "CTF write-up summary").'
    ),
  keywords: z
    .array(z.string())
    .optional()
    .describe(
      'An optional list of cybersecurity-related keywords to optimize for.'
    ),
  desiredTone: z
    .string()
    .default('professional hacker')
    .optional()
    .describe(
      'The desired tone for the refined content. Defaults to "professional hacker".'
    ),
});
export type ContentRefinementInput = z.infer<
  typeof ContentRefinementInputSchema
>;

const ContentRefinementOutputSchema = z.object({
  refinedContent: z
    .string()
    .describe('The refined or drafted content with the specified tone and keywords.'),
  usedKeywords: z
    .array(z.string())
    .optional()
    .describe(
      'A list of keywords from the input that were successfully incorporated into the refined content.'
    ),
});
export type ContentRefinementOutput = z.infer<
  typeof ContentRefinementOutputSchema
>;

export async function refineContent(
  input: ContentRefinementInput
): Promise<ContentRefinementOutput> {
  return contentRefinementAssistantFlow(input);
}

const contentRefinementPrompt = ai.definePrompt({
  name: 'contentRefinementPrompt',
  input: {schema: ContentRefinementInputSchema},
  output: {schema: ContentRefinementOutputSchema},
  prompt: `You are an AI content assistant for a professional cybersecurity portfolio. Your task is to help the user draft or refine content for their portfolio, ensuring it has a professional yet 'hacker' tone and is optimized for relevant cybersecurity keywords.

Here is the original content to refine:
{{{originalContent}}}

This content is for a "{{{contentType}}}" section.

{{#if keywords}}
Please optimize the content for the following keywords: {{#each keywords}} "{{{this}}}"{{#unless @last}},{{/unless}}{{/each}}.
{{/if}}

The desired tone is: "{{{desiredTone}}}".

Please provide the refined content, focusing on clarity, impact, and integrating the requested keywords and tone.
Also, identify and list the keywords from the provided list that you successfully incorporated into the refined content.
`,
});

const contentRefinementAssistantFlow = ai.defineFlow(
  {
    name: 'contentRefinementAssistantFlow',
    inputSchema: ContentRefinementInputSchema,
    outputSchema: ContentRefinementOutputSchema,
  },
  async input => {
    const {output} = await contentRefinementPrompt(input);
    return output!;
  }
);
