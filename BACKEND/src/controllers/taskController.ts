import { Response } from 'express';
import prisma from '../utils/db';
import { createApiResponse } from '../utils/auth';
import { AuthenticatedRequest, TaskCreateInput, TaskUpdateInput } from '../types';

export const getTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { status, priority, search } = req.query;

    let whereClause: any = { userId };

    // Filter by completion status
    if (status === 'completed') {
      whereClause.isCompleted = true;
    } else if (status === 'incomplete') {
      whereClause.isCompleted = false;
    }

    // Filter by priority
    if (priority && priority !== 'all') {
      whereClause.priority = (priority as string).toUpperCase();
    }

    // Search in title and description
    if (search) {
      whereClause.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: [
        { isCompleted: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    res.json(createApiResponse(true, 'Tasks retrieved successfully', tasks));
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json(
      createApiResponse(false, 'Failed to retrieve tasks', undefined, 'INTERNAL_ERROR')
    );
  }
};

export const getTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      res.status(404).json(
        createApiResponse(false, 'Task not found', undefined, 'NOT_FOUND')
      );
      return;
    }

    res.json(createApiResponse(true, 'Task retrieved successfully', task));
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json(
      createApiResponse(false, 'Failed to retrieve task', undefined, 'INTERNAL_ERROR')
    );
  }
};

export const createTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { title, description, dueDate, priority, notifyAt }: TaskCreateInput = req.body;

    console.log(`Creating task with notifyAt: ${notifyAt}`);
    
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
        notifyAt: notifyAt ? new Date(notifyAt) : undefined,
        userId,
      },
    });

    console.log(`Task created with notifyAt: ${task.notifyAt?.toISOString()}`);

    res.status(201).json(createApiResponse(true, 'Task created successfully', task));
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json(
      createApiResponse(false, 'Failed to create task', undefined, 'INTERNAL_ERROR')
    );
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const updates: TaskUpdateInput = req.body;

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      res.status(404).json(
        createApiResponse(false, 'Task not found', undefined, 'NOT_FOUND')
      );
      return;
    }

    // Prepare update data
    const updateData: any = { ...updates };
    if (updates.dueDate) {
      updateData.dueDate = new Date(updates.dueDate);
    }
    if (updates.notifyAt) {
      console.log(`Updating task with notifyAt: ${updates.notifyAt}`);
      updateData.notifyAt = new Date(updates.notifyAt);
      // Reset notification sent flag if notification time is changed
      updateData.notificationSent = false;
      console.log(`Task notifyAt updated to: ${updateData.notifyAt.toISOString()}`);
    }

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    res.json(createApiResponse(true, 'Task updated successfully', task));
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json(
      createApiResponse(false, 'Failed to update task', undefined, 'INTERNAL_ERROR')
    );
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      res.status(404).json(
        createApiResponse(false, 'Task not found', undefined, 'NOT_FOUND')
      );
      return;
    }

    await prisma.task.delete({
      where: { id },
    });

    res.json(createApiResponse(true, 'Task deleted successfully'));
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json(
      createApiResponse(false, 'Failed to delete task', undefined, 'INTERNAL_ERROR')
    );
  }
};

export const toggleTaskComplete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      res.status(404).json(
        createApiResponse(false, 'Task not found', undefined, 'NOT_FOUND')
      );
      return;
    }

    const task = await prisma.task.update({
      where: { id },
      data: { isCompleted: !existingTask.isCompleted },
    });

    res.json(createApiResponse(true, 'Task status updated successfully', task));
  } catch (error) {
    console.error('Toggle task complete error:', error);
    res.status(500).json(
      createApiResponse(false, 'Failed to update task status', undefined, 'INTERNAL_ERROR')
    );
  }
};
