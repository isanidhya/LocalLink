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
  extractedData: z.object({
    name: z.string().optional().describe("The full name of the person offering the service."),
    serviceName: z.string().optional().describe("The name of the service or product being offered."),
    description: z.string().optional().describe("A detailed description of the service or product."),
    location: z.string().optional().describe("The location (PIN code or area) where the service is offered."),
    availability: z.string().optional().describe("The days and times the service is available (e.g., 'Mon-Fri, 9am-5pm')."),
    charges: z.string().optional().describe("The charges for the service (e.g., '$50/hour', 'Starts from $20')."),
    contact: z.string().optional().describe("The contact information (phone number or email) for the provider."),
  }),
  responseText: z.string().describe("A friendly response to the user, confirming what was understood and suggesting to finalize the listing in the form."),
});
export type GuideListingCreationOutput = z.infer<typeof GuideListingCreationOutputSchema>;

export async function guideListingCreation(input: GuideListingCreationInput): Promise<GuideListingCreationOutput> {
  return guideListingCreationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'guideListingCreationPrompt',
  input: {schema: GuideListingCreationInputSchema},
  output: {schema: GuideListingCreationOutputSchema},
  prompt: `You are a helpful assistant for LocalLink, a platform to connect local skills with community needs. A user wants to offer a service. Your job is to analyze their request and extract key information to pre-fill a listing form.

From the user's input, extract as much of the following information as possible:
- name: The full name of the person offering the service.
- serviceName: The name of the service or product.
- description: A detailed description.
- location: The neighborhood, city, or PIN code.
- availability: The hours or days they are available.
- charges: The price or rate for their service.
- contact: A phone number or email address.

It is crucial that you DO NOT make up any information. If a field is not mentioned, leave it blank.

After extracting the data, compose a friendly 'responseText'. In the response, briefly summarize the information you've gathered and let them know you're preparing a form for them to review and complete their listing.

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
