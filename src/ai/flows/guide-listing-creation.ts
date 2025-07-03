// src/ai/flows/guide-listing-creation.ts
'use server';

/**
 * @fileOverview Guides the user through creating a service listing using AI.
 *
 * - guideListingCreation - Guides the user through creating a service listing.
 * - GuideListingCreationInput - The input type for the guideListingCreation function.
 * - GuideListingCreationOutput - The return type for the guideListingCreation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GuideListingCreationInputSchema = z.object({
  userInput: z.string().describe('The user input describing the service or product they want to offer.'),
});
export type GuideListingCreationInput = z.infer<typeof GuideListingCreationInputSchema>;

const GuideListingCreationOutputSchema = z.object({
  listingGuidance: z.string().describe('Guidance for the user on how to create a listing, including what information is needed and the benefits of listing.'),
});
export type GuideListingCreationOutput = z.infer<typeof GuideListingCreationOutputSchema>;

export async function guideListingCreation(input: GuideListingCreationInput): Promise<GuideListingCreationOutput> {
  return guideListingCreationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'guideListingCreationPrompt',
  input: {schema: GuideListingCreationInputSchema},
  output: {schema: GuideListingCreationOutputSchema},
  prompt: `You are a helpful assistant that guides users in creating service or product listings.

  Based on the user's input, provide guidance on how to create an effective listing, including what information they should include (name, service/product name, description, location, availability, charges, contact info) and the benefits of doing so.

  User Input: {{{userInput}}}`,
});

const guideListingCreationFlow = ai.defineFlow(
  {
    name: 'guideListingCreationFlow',
    inputSchema: GuideListingCreationInputSchema,
    outputSchema: GuideListingCreationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
