import { Response } from 'express';
import prisma from '../utils/db';
import { createApiResponse } from '../utils/auth';
import { AuthenticatedRequest } from '../types';

export const getJournalEntries = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const entries = await prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(createApiResponse(true, 'Journal entries retrieved successfully', entries));
  } catch (error) {
    console.error('Get journal entries error:', error);
    res.status(500).json(
      createApiResponse(false, 'Failed to retrieve journal entries', undefined, 'INTERNAL_ERROR')
    );
  }
};

export const getJournalEntry = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const entry = await prisma.journalEntry.findFirst({
      where: { id, userId },
    });

    if (!entry) {
      res.status(404).json(
        createApiResponse(false, 'Journal entry not found', undefined, 'NOT_FOUND')
      );
      return;
    }

    res.json(createApiResponse(true, 'Journal entry retrieved successfully', entry));
  } catch (error) {
    console.error('Get journal entry error:', error);
    res.status(500).json(
      createApiResponse(false, 'Failed to retrieve journal entry', undefined, 'INTERNAL_ERROR')
    );
  }
};

export const createJournalEntry = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      res.status(400).json(
        createApiResponse(false, 'Content is required', undefined, 'VALIDATION_ERROR')
      );
      return;
    }

    const entry = await prisma.journalEntry.create({
      data: {
        content: content.trim(),
        userId,
      },
    });

    res.status(201).json(createApiResponse(true, 'Journal entry created successfully', entry));
  } catch (error) {
    console.error('Create journal entry error:', error);
    res.status(500).json(
      createApiResponse(false, 'Failed to create journal entry', undefined, 'INTERNAL_ERROR')
    );
  }
};

export const updateJournalEntry = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      res.status(400).json(
        createApiResponse(false, 'Content is required', undefined, 'VALIDATION_ERROR')
      );
      return;
    }

    // Check if entry exists and belongs to user
    const existingEntry = await prisma.journalEntry.findFirst({
      where: { id, userId },
    });

    if (!existingEntry) {
      res.status(404).json(
        createApiResponse(false, 'Journal entry not found', undefined, 'NOT_FOUND')
      );
      return;
    }

    const entry = await prisma.journalEntry.update({
      where: { id },
      data: { content: content.trim() },
    });

    res.json(createApiResponse(true, 'Journal entry updated successfully', entry));
  } catch (error) {
    console.error('Update journal entry error:', error);
    res.status(500).json(
      createApiResponse(false, 'Failed to update journal entry', undefined, 'INTERNAL_ERROR')
    );
  }
};

export const deleteJournalEntry = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Check if entry exists and belongs to user
    const existingEntry = await prisma.journalEntry.findFirst({
      where: { id, userId },
    });

    if (!existingEntry) {
      res.status(404).json(
        createApiResponse(false, 'Journal entry not found', undefined, 'NOT_FOUND')
      );
      return;
    }

    await prisma.journalEntry.delete({
      where: { id },
    });

    res.json(createApiResponse(true, 'Journal entry deleted successfully'));
  } catch (error) {
    console.error('Delete journal entry error:', error);
    res.status(500).json(
      createApiResponse(false, 'Failed to delete journal entry', undefined, 'INTERNAL_ERROR')
    );
  }
};
