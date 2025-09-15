'use server';

/**
 * @fileOverview A smart task sorter AI agent.
 *
 * - smartSortTasks - A function that handles the smart sorting of tasks.
 * - SmartSortTasksInput - The input type for the smartSortTasks function.
 * - SmartSortTasksOutput - The return type for the smartSortTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TaskSchema = z.object({
  title: z.string().describe('The title of the task.'),
  description: z.string().optional().describe('The description of the task.'),
  dueDate: z.string().optional().describe('The due date of the task in ISO format.'),
  priority: z.enum(['high', 'medium', 'low']).describe('The priority level of the task.'),
  isCompleted: z.boolean().describe('Whether the task is completed or not.'),
});

const SmartSortTasksInputSchema = z.object({
  tasks: z.array(TaskSchema).describe('A list of tasks to be sorted.'),
  userHabits: z.string().describe('A description of the user habits and work style.'),
});
export type SmartSortTasksInput = z.infer<typeof SmartSortTasksInputSchema>;

const SmartSortTasksOutputSchema = z.array(TaskSchema).describe('A list of tasks sorted by importance based on user habits, deadlines and priorities.');
export type SmartSortTasksOutput = z.infer<typeof SmartSortTasksOutputSchema>;

export async function smartSortTasks(input: SmartSortTasksInput): Promise<SmartSortTasksOutput> {
  return smartSortTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartSortTasksPrompt',
  input: {schema: SmartSortTasksInputSchema},
  output: {schema: SmartSortTasksOutputSchema},
  prompt: `You are an AI assistant that reorders a list of tasks based on user habits, deadlines, and priorities.
Analyze the provided user habits and the list of tasks.
Your goal is to return the same list of tasks, but reordered in the most logical and efficient sequence for the user to complete them.
The most important task should be first. Do not add, remove, or modify any tasks.

User Habits:
{{userHabits}}

Tasks to sort:
{{#each tasks}}
- Title: {{this.title}}
  Description: {{this.description}}
  Due Date: {{this.dueDate}}
  Priority: {{this.priority}}
  Completed: {{this.isCompleted}}
{{/each}}

Return the sorted list of tasks as a valid JSON array of objects that conforms to the specified output schema.
The JSON output should contain ONLY the array of task objects.`,
});

const smartSortTasksFlow = ai.defineFlow(
  {
    name: 'smartSortTasksFlow',
    inputSchema: SmartSortTasksInputSchema,
    outputSchema: SmartSortTasksOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      // If the AI returns a valid (but possibly empty) array, use it.
      // Otherwise, fall back to the original task list.
      return output ?? input.tasks;
    } catch (error) {
      console.error('Error in smartSortTasksFlow:', error);
      // In case of an exception during the prompt call, return the original tasks.
      return input.tasks;
    }
  }
);
