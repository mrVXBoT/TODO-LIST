import { Request, Response, NextFunction } from 'express';
import { verifyToken, createApiResponse } from '../utils/auth';
import { AuthenticatedRequest } from '../types';

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json(createApiResponse(false, 'Access token required', undefined, 'UNAUTHORIZED'));
    return;
  }

  const decoded = verifyToken(token);
  
  if (!decoded) {
    res.status(403).json(createApiResponse(false, 'Invalid or expired token', undefined, 'FORBIDDEN'));
    return;
  }

  req.userId = decoded.userId;
  next();
};
