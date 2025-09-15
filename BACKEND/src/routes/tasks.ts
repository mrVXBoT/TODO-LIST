import { Router } from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
} from '../controllers/taskController';
import { authenticateToken } from '../middlewares/auth';
import { validateTaskCreate, validateTaskUpdate } from '../middlewares/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// GET /api/tasks
router.get('/', getTasks);

// GET /api/tasks/:id
router.get('/:id', getTask);

// POST /api/tasks
router.post('/', validateTaskCreate, createTask);

// PUT /api/tasks/:id
router.put('/:id', validateTaskUpdate, updateTask);

// DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

// PATCH /api/tasks/:id/toggle
router.patch('/:id/toggle', toggleTaskComplete);

export default router;
