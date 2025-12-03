import { RSI, MACD, SMA } from 'technicalindicators';
import { HistoricalDataPoint } from './api/coingecko';

export interface TechnicalIndicators {
    rsi: number;
    macd: {
        MACD?: number;
        signal?: number;
        histogram?: number;
    };
    sma50: number;
    sma200: number;
}

export function calculateIndicators(data: HistoricalDataPoint[]): TechnicalIndicators {
    if (data.length < 200) {
        console.warn("Not enough data for comprehensive technical analysis (need 200+ points for SMA200).");
    }

    const closePrices = data.map(d => d.close);

    // RSI (14 periods)
    const rsiValues = RSI.calculate({
        values: closePrices,
        period: 14,
    });
    const currentRsi = rsiValues[rsiValues.length - 1] || 0;

    // MACD (12, 26, 9)
    const macdValues = MACD.calculate({
        values: closePrices,
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        SimpleMAOscillator: false,
        SimpleMASignal: false,
    });
    const currentMacd = macdValues[macdValues.length - 1] || {};

    // SMA 50
    const sma50Values = SMA.calculate({
        period: 50,
        values: closePrices,
    });
    const currentSma50 = sma50Values[sma50Values.length - 1] || 0;

    // SMA 200
    const sma200Values = SMA.calculate({
        period: 200,
        values: closePrices,
    });
    const currentSma200 = sma200Values[sma200Values.length - 1] || 0;

    return {
        rsi: currentRsi,
        macd: currentMacd,
        sma50: currentSma50,
        sma200: currentSma200,
    };
}
