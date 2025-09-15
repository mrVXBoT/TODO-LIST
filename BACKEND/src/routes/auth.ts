import { Router } from 'express';
import { register, login, forgotPassword } from '../controllers/authController';
import { validateUserRegistration, validateUserLogin } from '../middlewares/validation';

const router = Router();

// POST /api/auth/register
router.post('/register', validateUserRegistration, register);

// POST /api/auth/login
router.post('/login', validateUserLogin, login);

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

export default router;
