import { Router } from 'express';
import { 
  getProfile, 
  updateProfile, 
  deleteAccount, 
  changePassword,
  getTelegramSettings,
  updateTelegramSettings,
  testTelegramConnection
} from '../controllers/userController';
import { authenticateToken } from '../middlewares/auth';
// import { validateProfileUpdate } from '../middlewares/validation';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// GET /api/users/profile
router.get('/profile', getProfile);

// PUT /api/users/profile
router.put('/profile', updateProfile);

// POST /api/users/change-password
router.post('/change-password', changePassword);

// DELETE /api/users/account
router.delete('/account', deleteAccount);

// Telegram settings routes
// GET /api/users/telegram-settings
router.get('/telegram-settings', getTelegramSettings);

// PUT /api/users/telegram-settings
router.put('/telegram-settings', updateTelegramSettings);

// POST /api/users/test-telegram
router.post('/test-telegram', testTelegramConnection);

export default router;
