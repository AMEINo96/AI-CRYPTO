import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getHistoricalData } from '@/lib/api/coingecko';
import { calculateIndicators } from '@/lib/technical-analysis';

const GetTechnicalIndicatorsInputSchema = z.object({
    ticker: z.string().describe('The ticker symbol of the cryptocurrency (e.g., BTC, ETH).'),
});

const GetTechnicalIndicatorsOutputSchema = z.object({
    rsi: z.number().describe('Relative Strength Index (14-period).'),
    macd: z.object({
        MACD: z.number().optional(),
        signal: z.number().optional(),
        histogram: z.number().optional(),
    }).describe('Moving Average Convergence Divergence.'),
    sma50: z.number().describe('50-day Simple Moving Average.'),
    sma200: z.number().describe('200-day Simple Moving Average.'),
});

export const getTechnicalIndicatorsTool = ai.defineTool(
    {
        name: 'getTechnicalIndicators',
        description: 'Returns technical indicators (RSI, MACD, SMA) for a given cryptocurrency based on recent price data.',
        inputSchema: GetTechnicalIndicatorsInputSchema,
        outputSchema: GetTechnicalIndicatorsOutputSchema,
    },
    async (input) => {
        const cryptoId = input.ticker.toLowerCase();
        const idMap: Record<string, string> = {
            'btc': 'bitcoin',
            'eth': 'ethereum',
            'doge': 'dogecoin',
            'sol': 'solana',
        };
        const coinId = idMap[cryptoId] || cryptoId;

        try {
            // Fetch enough data for SMA200
            const historicalData = await getHistoricalData(coinId, 300);
            const indicators = calculateIndicators(historicalData);
            return indicators;
        } catch (error) {
            console.error("Failed to calculate indicators:", error);
            throw new Error("Failed to calculate technical indicators.");
        }
    }
);
