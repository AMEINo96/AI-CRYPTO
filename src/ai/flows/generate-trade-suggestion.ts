
'use server';

/**
 * @fileOverview Generates a trade suggestion for a given cryptocurrency.
 *
 * - generateTradeSuggestion - A function that generates the trade suggestion.
 * - GenerateTradeSuggestionInput - The input type for the generateTradeSuggestion function.
 * - GenerateTradeSuggestionOutput - The return type for the generateTradeSuggestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getHistoricalPriceDataTool } from '@/ai/tools/get-historical-price-data';
import { getTechnicalIndicatorsTool } from '@/ai/tools/get-technical-indicators';

const GenerateTradeSuggestionInputSchema = z.object({
  ticker: z.string().describe('The ticker symbol of the cryptocurrency (e.g., BTC, ETH).'),
  news: z.string().describe('The latest news related to the cryptocurrency.'),
  pastPerformance: z.string().optional().describe('A summary of past prediction accuracy to learn from.'),
});
export type GenerateTradeSuggestionInput = z.infer<typeof GenerateTradeSuggestionInputSchema>;

const GenerateTradeSuggestionOutputSchema = z.object({
  action: z.enum(["Buy", "Sell", "Hold"]).describe("The suggested trading action: Buy, Sell, or Hold."),
  strategy: z.enum(["Long", "Short", "None"]).describe("The suggested trading strategy: Long, Short, or None."),
  leverage: z.union([z.string(), z.number()]).describe("The recommended leverage (e.g., '2x', '5x', 'None', or a number). Provide 'None' or 0 for non-leveraged trades."),
  timeframe: z.string().describe("The suggested timeframe for the trade (e.g., 'Short-term (1-7 days)', 'Medium-term (1-4 weeks)', 'Long-term (1+ months)')."),
  confidence: z.enum(["High", "Medium", "Low"]).describe("The confidence level in this suggestion."),
  summary: z.string().describe("A concise summary explaining the rationale behind the suggestion, including key factors from news and historical price analysis."),
  entryPrice: z.string().describe("A suggested entry price point or range. Can be 'current market price'."),
  stopLoss: z.string().describe("A suggested stop-loss price to manage risk."),
  takeProfit: z.string().describe("A suggested take-profit price target."),
});
export type GenerateTradeSuggestionOutput = z.infer<typeof GenerateTradeSuggestionOutputSchema>;

export async function generateTradeSuggestion(
  input: GenerateTradeSuggestionInput
): Promise<GenerateTradeSuggestionOutput> {
  return generateTradeSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTradeSuggestionPrompt',
  input: { schema: GenerateTradeSuggestionInputSchema },
  output: { schema: GenerateTradeSuggestionOutputSchema },
  tools: [getHistoricalPriceDataTool, getTechnicalIndicatorsTool],
  prompt: `You are a crypto market commentator. Provide a technical analysis summary based on the provided data.
  
**CRITICAL INSTRUCTIONS:**
- **TEXT ONLY:** This is a text-only interaction.
- **EDUCATIONAL ONLY:** This is for informational purposes only. Do NOT provide financial advice.
- **NO RECOMMENDATIONS:** Do NOT say "Buy", "Sell", or "Hold". Instead, discuss "Bullish" or "Bearish" signs.
- **USE TOOLS:** You MUST use \`getHistoricalPriceData\` and \`getTechnicalIndicators\`.

**Context:**
- **Past Performance:** {{{pastPerformance}}}

**Instructions:**
1.  **Technical Analysis:** Use the \`getTechnicalIndicators\` tool to get RSI, MACD, and SMA.
2.  **Trend Analysis:** Use \`getHistoricalPriceData\` to check the 90-day trend.
3.  **News Analysis:** Incorporate the provided news: {{{news}}}

**Goal:**
Provide a market commentary identifying key support/resistance levels and market sentiment.
`,
});

const generateTradeSuggestionFlow = ai.defineFlow(
  {
    name: 'generateTradeSuggestionFlow',
    inputSchema: GenerateTradeSuggestionInputSchema,
    outputSchema: GenerateTradeSuggestionOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
