import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// This is safe to run on the server
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  model: 'googleai/gemini-2.5-flash',
});
