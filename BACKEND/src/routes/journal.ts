import { Router } from 'express';
import {
  getJournalEntries,
  getJournalEntry,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from '../controllers/journalController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// GET /api/journal
router.get('/', getJournalEntries);

// GET /api/journal/:id
router.get('/:id', getJournalEntry);

// POST /api/journal
router.post('/', createJournalEntry);

// PUT /api/journal/:id
router.put('/:id', updateJournalEntry);

// DELETE /api/journal/:id
router.delete('/:id', deleteJournalEntry);

export default router;
