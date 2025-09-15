import { Response, NextFunction } from 'express';
import prisma from '../utils/db';
import { createApiResponse } from '../utils/auth';
import { AuthenticatedRequest } from '../types';

export const requireAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      res.status(401).json(createApiResponse(false, 'غیر مجاز'));
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      res.status(403).json(createApiResponse(false, 'دسترسی مجاز نیست - فقط ادمین‌ها'));
      return;
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json(createApiResponse(false, 'خطا در سرور'));
  }
};
