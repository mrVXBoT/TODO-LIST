import { Response } from 'express';
import prisma from '../utils/db';
import { createApiResponse } from '../utils/auth';
import { AuthenticatedRequest, NoteTopicCreateInput, NoteEntryCreateInput } from '../types';

// Note Topic Controllers
export const getNoteTopics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const noteTopics = await prisma.noteTopic.findMany({
      where: { userId },
      include: {
        entries: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(createApiResponse(true, 'Note topics retrieved successfully', noteTopics));
  } catch (error) {
    console.error('Get note topics error:', error);
    res.status(500).json(
      createApiResponse(false, 'Failed to retrieve note topics', undefined, 'INTERNAL_ERROR')
    );
  }
};

export const getNoteTopic = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const noteTopic = await prisma.noteTopic.findFirst({
      where: { id, userId },
      include: {
        entries: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!noteTopic) {
      res.status(404).json(
        createApiResponse(false, 'Note topic not found', undefined, 'NOT_FOUND')
      );
      return;
    }

    res.json(createApiResponse(true, 'Note topic retrieved successfully', noteTopic));
  } catch (error) {
    console.error('Get note topic error:', error);
    res.status(500).json(
      createApiResponse(false, 'Failed to retrieve note topic', undefined, 'INTERNAL_ERROR')
    );
  }
};

export const createNoteTopic = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { topic }: NoteTopicCreateInput = req.body;

    const noteTopic = await prisma.noteTopic.create({
      data: {
        topic,
        userId,
      },
      include: {
        entries: true,
      },
    });

    res.status(201).json(createApiResponse(true, 'Note topic created successfully', noteTopic));
  } catch (error) {
    console.error('Create note topic error:', error);
    res.status(500).json(
      createApiResponse(false, 'Failed to create note topic', undefined, 'INTERNAL_ERROR')
    );
  }
};

export const updateNoteTopic = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { topic }: NoteTopicCreateInput = req.body;

    // Check if note topic exists and belongs to user
    const existingNoteTopic = await prisma.noteTopic.findFirst({
      where: { id, userId },
    });

    if (!existingNoteTopic) {
      res.status(404).json(
        createApiResponse(false, 'Note topic not found', undefined, 'NOT_FOUND')
      );
      return;
    }

    const noteTopic = await prisma.noteTopic.update({
      where: { id },
      data: { topic },
      include: {
        entries: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    res.json(createApiResponse(true, 'Note topic updated successfully', noteTopic));
  } catch (error) {
    console.error('Update note topic error:', error);
    res.status(500).json(
      createApiResponse(false, 'Failed to update note topic', undefined, 'INTERNAL_ERROR')
    );
  }
};

export const deleteNoteTopic = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Check if note topic exists and belongs to user
    const existingNoteTopic = await prisma.noteTopic.findFirst({
      where: { id, userId },
    });

    if (!existingNoteTopic) {
      res.status(404).json(
        createApiResponse(false, 'Note topic not found', undefined, 'NOT_FOUND')
      );
      return;
    }

    await prisma.noteTopic.delete({
      where: { id },
    });

    res.json(createApiResponse(true, 'Note topic deleted successfully'));
  } catch (error) {
    console.error('Delete note topic error:', error);
    res.status(500).json(
      createApiResponse(false, 'Failed to delete note topic', undefined, 'INTERNAL_ERROR')
    );
  }
};

// Note Entry Controllers
export const createNoteEntry = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { topicId } = req.params;
    const { content }: NoteEntryCreateInput = req.body;

    // Check if note topic exists and belongs to user
    const noteTopic = await prisma.noteTopic.findFirst({
      where: { id: topicId, userId },
    });

    if (!noteTopic) {
      res.status(404).json(
        createApiResponse(false, 'Note topic not found', undefined, 'NOT_FOUND')
      );
      return;
    }

    const noteEntry = await prisma.noteEntry.create({
      data: {
        content,
        topicId: topicId!,
      },
    });

    res.status(201).json(createApiResponse(true, 'Note entry created successfully', noteEntry));
  } catch (error) {
    console.error('Create note entry error:', error);
    res.status(500).json(
      createApiResponse(false, 'Failed to create note entry', undefined, 'INTERNAL_ERROR')
    );
  }
};

export const deleteNoteEntry = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { topicId, entryId } = req.params;

    // Check if note topic exists and belongs to user
    const noteTopic = await prisma.noteTopic.findFirst({
      where: { id: topicId, userId },
    });

    if (!noteTopic) {
      res.status(404).json(
        createApiResponse(false, 'Note topic not found', undefined, 'NOT_FOUND')
      );
      return;
    }

    // Check if note entry exists and belongs to the topic
    const noteEntry = await prisma.noteEntry.findFirst({
      where: { id: entryId, topicId },
    });

    if (!noteEntry) {
      res.status(404).json(
        createApiResponse(false, 'Note entry not found', undefined, 'NOT_FOUND')
      );
      return;
    }

    await prisma.noteEntry.delete({
      where: { id: entryId },
    });

    res.json(createApiResponse(true, 'Note entry deleted successfully'));
  } catch (error) {
    console.error('Delete note entry error:', error);
    res.status(500).json(
      createApiResponse(false, 'Failed to delete note entry', undefined, 'INTERNAL_ERROR')
    );
  }
};
