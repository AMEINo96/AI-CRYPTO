
'use server';

/**
 * @fileOverview Generates a rationale for a cryptocurrency price prediction.
 *
 * - generatePredictionRationale - A function that generates the rationale.
 * - GeneratePredictionRationaleInput - The input type for the generatePredictionRationale function.
 * - GeneratePredictionRationaleOutput - The return type for the generatePredictionRationale function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePredictionRationaleInputSchema = z.object({
  ticker: z.string().describe('The ticker symbol of the cryptocurrency.'),
  predictedPrice: z.number().describe('The predicted price of the cryptocurrency.'),
  relevantData: z.string().describe('Relevant market data for the cryptocurrency.'),
  newsEvents: z.string().describe('Recent news events related to the cryptocurrency.'),
  chartAnalysis: z.string().describe('Technical chart analysis of the cryptocurrency.'),
});
export type GeneratePredictionRationaleInput = z.infer<typeof GeneratePredictionRationaleInputSchema>;

const GeneratePredictionRationaleOutputSchema = z.object({
  rationale: z.string().describe('The rationale behind the price prediction.'),
});
export type GeneratePredictionRationaleOutput = z.infer<typeof GeneratePredictionRationaleOutputSchema>;

export async function generatePredictionRationale(
  input: GeneratePredictionRationaleInput
): Promise<GeneratePredictionRationaleOutput> {
  return generatePredictionRationaleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePredictionRationalePrompt',
  input: {schema: GeneratePredictionRationaleInputSchema},
  output: {schema: GeneratePredictionRationaleOutputSchema},
  prompt: `You are an AI assistant that provides rationales for cryptocurrency price predictions.

  Based on the following information, explain the rationale behind the predicted price of {{predictedPrice}} for {{ticker}}:

  Relevant Data: {{relevantData}}
  News Events: {{newsEvents}}
  Chart Analysis: {{chartAnalysis}}
  `,
});

const generatePredictionRationaleFlow = ai.defineFlow(
  {
    name: 'generatePredictionRationaleFlow',
    inputSchema: GeneratePredictionRationaleInputSchema,
    outputSchema: GeneratePredictionRationaleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
