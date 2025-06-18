'use server';

/**
 * @fileOverview AI command suggestion flow.
 *
 * - suggestCommand - A function that suggests terminal commands based on natural language queries.
 * - SuggestCommandInput - The input type for the suggestCommand function.
 * - SuggestCommandOutput - The return type for the suggestCommand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCommandInputSchema = z.object({
  query: z.string().describe('The natural language query for the desired command.'),
  platform: z.string().optional().describe('The target platform (e.g., Linux, MacOS, Windows). Optional, but improves accuracy.'),
});
export type SuggestCommandInput = z.infer<typeof SuggestCommandInputSchema>;

const SuggestCommandOutputSchema = z.object({
  command: z.string().describe('The suggested terminal command.'),
  explanation: z.string().describe('An explanation of what the command does.'),
});
export type SuggestCommandOutput = z.infer<typeof SuggestCommandOutputSchema>;

export async function suggestCommand(input: SuggestCommandInput): Promise<SuggestCommandOutput> {
  return suggestCommandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCommandPrompt',
  input: {schema: SuggestCommandInputSchema},
  output: {schema: SuggestCommandOutputSchema},
  prompt: `You are a command-line expert.  A user will provide a natural language query, and you will respond with the most appropriate terminal command and an explanation of what the command does.  The response should be formatted as JSON.

{{#if platform}}
The target platform is: {{{platform}}}
{{/if}}

User query: {{{query}}}`,
});

const suggestCommandFlow = ai.defineFlow(
  {
    name: 'suggestCommandFlow',
    inputSchema: SuggestCommandInputSchema,
    outputSchema: SuggestCommandOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
