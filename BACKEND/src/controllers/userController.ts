import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createApiResponse } from '../utils/auth';
import { AuthenticatedRequest } from '../types';
import { TelegramPolling } from '../services/telegramPolling';

const prisma = new PrismaClient();

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json(createApiResponse(false, 'غیر مجاز'));
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        habits: true,
        profilePicture: true,
        role: true,
        createdAt: true,
      }
    });

    if (!user) {
      res.status(404).json(createApiResponse(false, 'کاربر یافت نشد'));
      return;
    }

    res.json(createApiResponse(true, 'اطلاعات کاربر دریافت شد', user));
    return;
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json(createApiResponse(false, 'خطا در سرور'));
    return;
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { name, email, habits, profilePicture } = req.body;

    if (!userId) {
      res.status(401).json(createApiResponse(false, 'غیر مجاز'));
      return;
    }

    // Validate required fields - name is required, but email is optional for updates
    if (!name) {
      res.status(400).json(createApiResponse(false, 'نام الزامی است'));
      return;
    }

    // Check if email already exists for another user
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: userId }
        }
      });

      if (existingUser) {
        res.status(400).json(createApiResponse(false, 'این ایمیل توسط کاربر دیگری استفاده می‌شود'));
        return;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(habits !== undefined && { habits }),
        ...(profilePicture !== undefined && { profilePicture }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        habits: true,
        profilePicture: true,
        role: true,
        createdAt: true,
      }
    });

    res.json(createApiResponse(true, 'پروفایل با موفقیت بروزرسانی شد', updatedUser));
    return;
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json(createApiResponse(false, 'خطا در سرور'));
    return;
  }
};

export const getTelegramSettings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json(createApiResponse(false, 'غیر مجاز'));
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        telegramBotToken: true,
        telegramUserId: true,
      }
    });

    if (!user) {
      res.status(404).json(createApiResponse(false, 'کاربر یافت نشد'));
      return;
    }

    res.json(createApiResponse(true, 'تنظیمات تلگرام دریافت شد', {
      telegramBotToken: user.telegramBotToken || '',
      telegramUserId: user.telegramUserId || ''
    }));
    return;
  } catch (error) {
    console.error('Error getting telegram settings:', error);
    res.status(500).json(createApiResponse(false, 'خطا در سرور'));
    return;
  }
};

export const updateTelegramSettings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { telegramBotToken, telegramUserId } = req.body;

    if (!userId) {
      res.status(401).json(createApiResponse(false, 'غیر مجاز'));
      return;
    }

    // Validate telegram settings
    if (telegramBotToken && !telegramBotToken.includes(':')) {
      res.status(400).json(createApiResponse(false, 'توکن ربات تلگرام معتبر نیست'));
      return;
    }

    if (telegramUserId && isNaN(Number(telegramUserId))) {
      res.status(400).json(createApiResponse(false, 'شناسه کاربری تلگرام باید عددی باشد'));
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        telegramBotToken: telegramBotToken || null,
        telegramUserId: telegramUserId || null,
      },
      select: {
        telegramBotToken: true,
        telegramUserId: true,
      }
    });

    // Restart telegram polling to include new bot
    if (telegramBotToken && telegramUserId) {
      setTimeout(async () => {
        await TelegramPolling.restartPolling();
        console.log('Telegram polling restarted after settings update');
      }, 1000);
    }

    res.json(createApiResponse(true, 'تنظیمات تلگرام با موفقیت بروزرسانی شد', {
      telegramBotToken: updatedUser.telegramBotToken || '',
      telegramUserId: updatedUser.telegramUserId || ''
    }));
    return;
  } catch (error) {
    console.error('Error updating telegram settings:', error);
    res.status(500).json(createApiResponse(false, 'خطا در سرور'));
    return;
  }
};

export const testTelegramConnection = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json(createApiResponse(false, 'غیر مجاز'));
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        telegramBotToken: true,
        telegramUserId: true,
        name: true,
      }
    });

    if (!user || !user.telegramBotToken || !user.telegramUserId) {
      res.status(400).json(createApiResponse(false, 'تنظیمات تلگرام کامل نیست'));
      return;
    }

    // Test telegram connection by sending a test message with reply keyboard
    const testMessage = `سلام ${user.name}! 🎉\n\nاتصال ربات تلگرام با موفقیت برقرار شد.\nحالا می‌توانید اعلان‌های وظایف خود را از طریق تلگرام دریافت کنید.\n\n👇 از منوی زیر استفاده کنید:`;
    
    const telegramUrl = `https://api.telegram.org/bot${user.telegramBotToken}/sendMessage`;
    const telegramPayload = {
      chat_id: user.telegramUserId,
      text: testMessage,
      parse_mode: 'HTML',
      reply_markup: {
        keyboard: [
          [{ text: '📋 وظایف من' }, { text: '📝 یادداشت‌ها' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
      }
    };

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(telegramPayload),
    });

    const result: any = await response.json();

    if (result.ok) {
      res.json(createApiResponse(true, 'اتصال تلگرام با موفقیت تست شد'));
    } else {
      res.status(400).json(createApiResponse(false, 'خطا در اتصال تلگرام: ' + (result.description || 'نامشخص')));
    }
    return;
  } catch (error) {
    console.error('Error testing telegram connection:', error);
    res.status(500).json(createApiResponse(false, 'خطا در تست اتصال تلگرام'));
    return;
  }
};

export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      res.status(401).json(createApiResponse(false, 'غیر مجاز'));
      return;
    }

    if (!currentPassword || !newPassword) {
      res.status(400).json(createApiResponse(false, 'رمز عبور فعلی و جدید الزامی است'));
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json(createApiResponse(false, 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد'));
      return;
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true }
    });

    if (!user) {
      res.status(404).json(createApiResponse(false, 'کاربر یافت نشد'));
      return;
    }

    // Verify current password
    const { comparePassword, hashPassword } = await import('../utils/auth');
    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      res.status(400).json(createApiResponse(false, 'رمز عبور فعلی اشتباه است'));
      return;
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    res.json(createApiResponse(true, 'رمز عبور با موفقیت تغییر کرد'));
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json(createApiResponse(false, 'خطا در سرور'));
  }
};

export const deleteAccount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json(createApiResponse(false, 'غیر مجاز'));
      return;
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    res.json(createApiResponse(true, 'حساب کاربری حذف شد'));
    return;
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json(createApiResponse(false, 'خطا در سرور'));
    return;
  }
};