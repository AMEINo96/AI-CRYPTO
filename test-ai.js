const { generateTradeSuggestion } = require('./src/ai/flows/generate-trade-suggestion');

async function test() {
    try {
        console.log("Testing generateTradeSuggestion...");
        const result = await generateTradeSuggestion({
            ticker: 'BTC',
            news: 'Bitcoin hits $100k. Market is bullish.',
            pastPerformance: 'No past data.',
        });
        console.log("Result:", JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Error:", error);
    }
}

test();
