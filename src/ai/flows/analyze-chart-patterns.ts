
'use server';

/**
 * @fileOverview Analyzes cryptocurrency chart patterns and identifies potential trading opportunities.
 *
 * - analyzeChartPatterns - Analyzes chart patterns and identifies opportunities.
 * - AnalyzeChartPatternsInput - The input type for the analyzeChartPatterns function.
 * - AnalyzeChartPatternsOutput - The return type for the analyzeChartPatterns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeChartPatternsInputSchema = z.object({
  chartDataUri: z
    .string()
    .describe(
      "A data URI of the cryptocurrency chart image. It must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  ticker: z.string().describe('The ticker symbol of the cryptocurrency (e.g., BTC, ETH).'),
  news: z.string().describe('The latest news related to the cryptocurrency.'),
});
export type AnalyzeChartPatternsInput = z.infer<typeof AnalyzeChartPatternsInputSchema>;

const AnalyzeChartPatternsOutputSchema = z.object({
  analysis: z.string().describe('Analysis of the chart patterns.'),
  tradingOpportunity: z.string().describe('Potential trading opportunities based on the analysis.'),
  confidenceLevel: z.string().describe('The confidence level in the identified trading opportunity (High, Medium, Low).'),
});
export type AnalyzeChartPatternsOutput = z.infer<typeof AnalyzeChartPatternsOutputSchema>;

export async function analyzeChartPatterns(
  input: AnalyzeChartPatternsInput
): Promise<AnalyzeChartPatternsOutput> {
  return analyzeChartPatternsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeChartPatternsPrompt',
  input: {schema: AnalyzeChartPatternsInputSchema},
  output: {schema: AnalyzeChartPatternsOutputSchema},
  prompt: `You are a cryptocurrency trading expert. Analyze the provided chart pattern, news, and ticker symbol to identify potential trading opportunities. Consider the following:

Chart Data: {{media url=chartDataUri}}
Ticker Symbol: {{{ticker}}}
News: {{{news}}}

Provide a detailed analysis of the chart patterns, identify potential trading opportunities, and rate your confidence level in the identified opportunity (High, Medium, Low).

Ensure that your analysis includes potential risks and rewards associated with the identified trading opportunity.

Analysis:
Trading Opportunity:
Confidence Level: `,
});

const analyzeChartPatternsFlow = ai.defineFlow(
  {
    name: 'analyzeChartPatternsFlow',
    inputSchema: AnalyzeChartPatternsInputSchema,
    outputSchema: AnalyzeChartPatternsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
