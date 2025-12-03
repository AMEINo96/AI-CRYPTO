
'use server';

/**
 * @fileOverview Summarizes the latest cryptocurrency news articles.
 *
 * - summarizeCryptoNews - A function that summarizes the latest cryptocurrency news.
 * - SummarizeCryptoNewsInput - The input type for the summarizeCryptoNews function.
 * - SummarizeCryptoNewsOutput - The return type for the summarizeCryptoNews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCryptoNewsInputSchema = z.object({
  newsArticles: z
    .string()
    .describe('The latest cryptocurrency news articles to summarize.'),
});
export type SummarizeCryptoNewsInput = z.infer<typeof SummarizeCryptoNewsInputSchema>;

const SummarizeCryptoNewsOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the latest cryptocurrency news.'),
});
export type SummarizeCryptoNewsOutput = z.infer<typeof SummarizeCryptoNewsOutputSchema>;

export async function summarizeCryptoNews(
  input: SummarizeCryptoNewsInput
): Promise<SummarizeCryptoNewsOutput> {
  return summarizeCryptoNewsFlow(input);
}

const summarizeCryptoNewsPrompt = ai.definePrompt({
  name: 'summarizeCryptoNewsPrompt',
  input: {schema: SummarizeCryptoNewsInputSchema},
  output: {schema: SummarizeCryptoNewsOutputSchema},
  prompt: `You are an AI expert in cryptocurrency news.

  Summarize the following news articles into a concise and informative summary:

  News Articles:
  {{newsArticles}}`,
});

const summarizeCryptoNewsFlow = ai.defineFlow(
  {
    name: 'summarizeCryptoNewsFlow',
    inputSchema: SummarizeCryptoNewsInputSchema,
    outputSchema: SummarizeCryptoNewsOutputSchema,
  },
  async input => {
    const {output} = await summarizeCryptoNewsPrompt(input);
    return output!;
  }
);
