import { Router } from 'express';
import {
  getAllUsers,
  getSystemStats,
  deleteUser,
  updateUserRole,
  getRecentActivities
} from '../controllers/adminController';
import { authenticateToken } from '../middlewares/auth';
import { requireAdmin } from '../middlewares/admin';

const router = Router();

// Apply authentication and admin requirement to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/users - Get all users
router.get('/users', getAllUsers);

// GET /api/admin/stats - Get system statistics
router.get('/stats', getSystemStats);

// GET /api/admin/activities - Get recent activities
router.get('/activities', getRecentActivities);

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', deleteUser);

// PUT /api/admin/users/:id/role - Update user role
router.put('/users/:id/role', updateUserRole);

export default router;
