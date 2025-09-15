import { Router } from 'express';
import authRoutes from './auth';
import taskRoutes from './tasks';
import noteRoutes from './notes';
import userRoutes from './users';
import journalRoutes from './journal';
import adminRoutes from './admin';
import telegramRoutes from './telegram';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Todo List API is running' });
});

// Route modules
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/notes', noteRoutes);
router.use('/users', userRoutes);
router.use('/journal', journalRoutes);
router.use('/admin', adminRoutes);
router.use('/telegram', telegramRoutes);

export default router;
