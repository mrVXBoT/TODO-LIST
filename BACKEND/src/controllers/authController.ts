import { Request, Response } from 'express';
import prisma from '../utils/db';
import { hashPassword, comparePassword, generateToken, createApiResponse } from '../utils/auth';
import { LoginCredentials, RegisterCredentials } from '../types';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name }: RegisterCredentials = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json(
        createApiResponse(false, 'User with this email already exists', undefined, 'EMAIL_EXISTS')
      );
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Generate token
    const token = generateToken(user.id);

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json(
      createApiResponse(true, 'User registered successfully', {
        user: userWithoutPassword,
        token,
      })
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json(
      createApiResponse(false, 'Internal server error', undefined, 'INTERNAL_ERROR')
    );
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginCredentials = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json(
        createApiResponse(false, 'کاربری با این ایمیل یافت نشد', undefined, 'USER_NOT_FOUND')
      );
      return;
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      res.status(401).json(
        createApiResponse(false, 'رمز عبور اشتباه است', undefined, 'INVALID_PASSWORD')
      );
      return;
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;

    res.json(
      createApiResponse(true, 'Login successful', {
        user: userWithoutPassword,
        token,
      })
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(
      createApiResponse(false, 'Internal server error', undefined, 'INTERNAL_ERROR')
    );
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success for security (don't reveal if email exists)
    res.json(
      createApiResponse(true, 'If an account with that email exists, a password reset link has been sent')
    );

    // TODO: Implement actual email sending functionality
    if (user) {
      console.log(`Password reset requested for user: ${user.email}`);
      // Here you would typically send an email with a reset token
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json(
      createApiResponse(false, 'Internal server error', undefined, 'INTERNAL_ERROR')
    );
  }
};
