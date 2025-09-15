import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ApiResponse } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE } as jwt.SignOptions);
};

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    return null;
  }
};

export const createApiResponse = <T>(
  success: boolean,
  message: string,
  data?: T | undefined,
  error?: string | undefined
): ApiResponse<T> => {
  return {
    success,
    message,
    data: data as T | undefined,
    error: error as string | undefined,
  };
};
