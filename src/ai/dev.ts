import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-chart-patterns.ts';
import '@/ai/flows/generate-prediction-rationale.ts';
import '@/ai/flows/summarize-crypto-news.ts';
import '@/ai/flows/generate-trade-suggestion.ts';
import '@/ai/tools/get-historical-price-data.ts';
