// src/ai/flows/suggest-listings.ts
'use server';
/**
 * @fileOverview AI agent that suggests nearby service listings from Firestore based on user input.
 *
 * - suggestListings - A function that suggests nearby service listings.
 * - SuggestListingsInput - The input type for the suggestListings function.
 * - SuggestListingsOutput - The return type for the suggestListings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestListingsInputSchema = z.object({
  query: z.string().describe('The user query, e.g., \'I need an AC mechanic near me\''),
});
export type SuggestListingsInput = z.infer<typeof SuggestListingsInputSchema>;

const SuggestListingsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of suggested service listings.'),
});
export type SuggestListingsOutput = z.infer<typeof SuggestListingsOutputSchema>;

export async function suggestListings(input: SuggestListingsInput): Promise<SuggestListingsOutput> {
  return suggestListingsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestListingsPrompt',
  input: {schema: SuggestListingsInputSchema},
  output: {schema: SuggestListingsOutputSchema},
  prompt: `You are a helpful assistant that suggests local services based on user queries.

  Given the following user query, suggest relevant service listings:

  Query: {{{query}}}

  Provide a list of suggestions. Each suggestion should be a concise description of the service.`,
});

const suggestListingsFlow = ai.defineFlow(
  {
    name: 'suggestListingsFlow',
    inputSchema: SuggestListingsInputSchema,
    outputSchema: SuggestListingsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
