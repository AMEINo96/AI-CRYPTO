import { generateTradeSuggestion } from '../ai/flows/generate-trade-suggestion';
import * as dotenv from 'dotenv';

dotenv.config();

async function test() {
    try {
        console.log("Testing AI Flow with model...");
        const result = await generateTradeSuggestion({
            ticker: 'BTC',
            news: 'Bitcoin is stable.',
            pastPerformance: 'None',
        });
        console.log("Success:", result);
    } catch (error: any) {
        console.error("AI Flow Failed:");
        console.error(error);
    }
}

test();
