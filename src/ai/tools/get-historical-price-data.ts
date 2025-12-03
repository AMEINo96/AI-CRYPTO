/**
 * @fileOverview A tool for retrieving historical cryptocurrency price data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { chartData, type ChartData } from '@/lib/data';

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
    
    // In a real application, you would fetch this from an API.
    // Here, we simulate it using our mock data.
    const data = chartData[cryptoId] || [];
    
    // The prompt asks for 90 days, but our mock data is 30 days.
    // We will return what we have.
    return data.map(d => ({ date: d.date, price: d.price }));
  }
);
