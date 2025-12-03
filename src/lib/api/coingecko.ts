import axios from 'axios';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export interface CoinData {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    market_cap: number;
    total_volume: number;
    price_change_percentage_24h: number;
}

export interface HistoricalDataPoint {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export async function getCoinData(coinId: string): Promise<CoinData | null> {
    try {
        const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
            params: {
                vs_currency: 'usd',
                ids: coinId,
                order: 'market_cap_desc',
                per_page: 1,
                page: 1,
                sparkline: false,
            },
        });

        if (response.data && response.data.length > 0) {
            return response.data[0];
        }
        return null;
    } catch (error) {
        console.error(`Error fetching data for ${coinId}:`, error);
        return null;
    }
}

export async function getHistoricalData(coinId: string, days: number = 30): Promise<HistoricalDataPoint[]> {
    try {
        const response = await axios.get(`${COINGECKO_API_URL}/coins/${coinId}/ohlc`, {
            params: {
                vs_currency: 'usd',
                days: days,
            },
        });

        // CoinGecko OHLC format: [time, open, high, low, close]
        // Note: CoinGecko free API doesn't return volume in OHLC, so we'll simulate it or fetch separately if critical.
        // For now, we will map it without volume or use a placeholder.
        return response.data.map((item: number[]) => ({
            timestamp: item[0],
            open: item[1],
            high: item[2],
            low: item[3],
            close: item[4],
            volume: 0, // Volume not available in free OHLC endpoint
        }));
    } catch (error) {
        console.error(`Error fetching historical data for ${coinId}:`, error);
        return [];
    }
}
