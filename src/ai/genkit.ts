import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// This is safe to run on the server
if (!process.env.GOOGLE_GENAI_API_KEY) {
  console.warn("WARNING: GOOGLE_GENAI_API_KEY is not set in the environment variables. AI features will fail.");
}

export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  model: 'googleai/gemini-2.5-flash',
});
