/**
 * @fileOverview A tool for retrieving historical cryptocurrency price data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getHistoricalData } from '@/lib/api/coingecko';

const GetHistoricalPriceDataInputSchema = z.object({
  ticker: z.string().describe('The ticker symbol of the cryptocurrency (e.g., BTC, ETH).'),
});

const GetHistoricalPriceDataOutputSchema = z.array(z.object({
  date: z.string(),
  price: z.number(),
})).describe('An array of historical price data points for the last 90 days.');


export const getHistoricalPriceDataTool = ai.defineTool(
  {
    name: 'getHistoricalPriceData',
    description: 'Returns the historical price data for a given cryptocurrency for the last 90 days.',
    inputSchema: GetHistoricalPriceDataInputSchema,
    outputSchema: GetHistoricalPriceDataOutputSchema,
  },
  async (input) => {
    const cryptoId = input.ticker.toLowerCase();

    // Map ticker to CoinGecko ID (simple mapping for now, can be expanded)
    const idMap: Record<string, string> = {
      'btc': 'bitcoin',
      'eth': 'ethereum',
      'doge': 'dogecoin',
      'sol': 'solana',
    };
    const coinId = idMap[cryptoId] || cryptoId;

    try {
      // Fetch 90 days of data
      const historicalData = await getHistoricalData(coinId, 90);

      return historicalData.map(d => ({
        date: new Date(d.timestamp).toISOString().split('T')[0],
        price: d.close
      }));
    } catch (error) {
      console.error("Failed to fetch historical data:", error);
      return [];
    }
  }
);
