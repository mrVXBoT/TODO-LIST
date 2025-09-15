import { Router } from 'express';
import {
  getNoteTopics,
  getNoteTopic,
  createNoteTopic,
  updateNoteTopic,
  deleteNoteTopic,
  createNoteEntry,
  deleteNoteEntry,
} from '../controllers/noteController';
import { authenticateToken } from '../middlewares/auth';
import { validateNoteTopicCreate, validateNoteEntryCreate } from '../middlewares/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Note Topic routes
// GET /api/notes
router.get('/', getNoteTopics);

// GET /api/notes/:id
router.get('/:id', getNoteTopic);

// POST /api/notes
router.post('/', validateNoteTopicCreate, createNoteTopic);

// PUT /api/notes/:id
router.put('/:id', validateNoteTopicCreate, updateNoteTopic);

// DELETE /api/notes/:id
router.delete('/:id', deleteNoteTopic);

// Note Entry routes
// POST /api/notes/:topicId/entries
router.post('/:topicId/entries', validateNoteEntryCreate, createNoteEntry);

// DELETE /api/notes/:topicId/entries/:entryId
router.delete('/:topicId/entries/:entryId', deleteNoteEntry);

export default router;
