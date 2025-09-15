import { Response } from 'express';
import prisma from '../utils/db';
import { createApiResponse } from '../utils/auth';
import { AuthenticatedRequest } from '../types';

// Get all users
export const getAllUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        profilePicture: true,
        _count: {
          select: {
            tasks: true,
            noteTopics: true,
            journalEntries: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(createApiResponse(true, 'کاربران با موفقیت دریافت شدند', users));
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json(createApiResponse(false, 'خطا در دریافت کاربران'));
  }
};

// Get system statistics
export const getSystemStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const [
      totalUsers,
      totalTasks,
      totalNotes,
      totalJournalEntries,
      completedTasks,
      adminUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.task.count(),
      prisma.noteTopic.count(),
      prisma.journalEntry.count(),
      prisma.task.count({ where: { isCompleted: true } }),
      prisma.user.count({ where: { role: 'ADMIN' } })
    ]);

    const stats = {
      totalUsers,
      totalTasks,
      totalNotes,
      totalJournalEntries,
      completedTasks,
      adminUsers,
      taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };

    res.json(createApiResponse(true, 'آمار سیستم با موفقیت دریافت شد', stats));
  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json(createApiResponse(false, 'خطا در دریافت آمار سیستم'));
  }
};

// Delete user
export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const adminId = req.userId!;

    // Check if trying to delete self
    if (id === adminId) {
      res.status(400).json(createApiResponse(false, 'نمی‌توانید خودتان را حذف کنید'));
      return;
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) {
      res.status(404).json(createApiResponse(false, 'کاربر یافت نشد'));
      return;
    }

    // Delete user (cascade will handle related data)
    await prisma.user.delete({
      where: { id }
    });

    res.json(createApiResponse(true, `کاربر ${user.name} (${user.email}) حذف شد`));
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json(createApiResponse(false, 'خطا در حذف کاربر'));
  }
};

// Update user role
export const updateUserRole = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const adminId = req.userId!;

    if (!role || !['USER', 'ADMIN'].includes(role)) {
      res.status(400).json(createApiResponse(false, 'نقش نامعتبر'));
      return;
    }

    // Check if trying to change own role
    if (id === adminId) {
      res.status(400).json(createApiResponse(false, 'نمی‌توانید نقش خودتان را تغییر دهید'));
      return;
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });

    res.json(createApiResponse(true, `نقش کاربر ${user.name} به ${role === 'ADMIN' ? 'ادمین' : 'کاربر عادی'} تغییر کرد`, user));
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json(createApiResponse(false, 'خطا در تغییر نقش کاربر'));
  }
};

// Get recent activities
export const getRecentActivities = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const [recentTasks, recentNotes, recentUsers] = await Promise.all([
      // Recent tasks
      prisma.task.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      }),
      // Recent notes
      prisma.noteTopic.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      }),
      // Recent users
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          role: true
        }
      })
    ]);

    const activities = {
      recentTasks,
      recentNotes,
      recentUsers
    };

    res.json(createApiResponse(true, 'فعالیت‌های اخیر با موفقیت دریافت شد', activities));
  } catch (error) {
    console.error('Get recent activities error:', error);
    res.status(500).json(createApiResponse(false, 'خطا در دریافت فعالیت‌های اخیر'));
  }
};
