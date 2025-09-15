"use server";

import { smartSortTasks, type SmartSortTasksInput } from '@/ai/flows/smart-sort-tasks';
import type { Task } from '@/lib/types';

export async function getSortedTasks(tasks: Task[], userHabits: string): Promise<Task[]> {
  if (tasks.length === 0) {
    return [];
  }

  try {
    // For now, let's implement a smart sorting algorithm without AI
    // This will work reliably until AI is properly configured
    const sortedTasks = [...tasks].sort((a, b) => {
      // First, incomplete tasks come before completed ones
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }

      // If both are incomplete, sort by priority and due date
      if (!a.isCompleted && !b.isCompleted) {
        // Priority weights: high = 3, medium = 2, low = 1
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        const aPriority = priorityWeight[a.priority] || 2;
        const bPriority = priorityWeight[b.priority] || 2;

        // If priorities are different, sort by priority (higher first)
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }

        // If priorities are same, sort by due date (sooner first)
        if (a.dueDate && b.dueDate) {
          return a.dueDate.getTime() - b.dueDate.getTime();
        } else if (a.dueDate) {
          return -1; // Tasks with due dates come first
        } else if (b.dueDate) {
          return 1;
        }
      }

      // If both completed or no other criteria, maintain original order
      return 0;
    });

    console.log(`Smart sorted ${tasks.length} tasks based on priority and due dates`);
    return sortedTasks;

  } catch (error) {
    console.error("Error sorting tasks:", error);
    // Return original order if sorting fails
    return tasks;
  }
}
