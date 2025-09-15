import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: 'HTML' | 'Markdown';
  reply_markup?: {
    inline_keyboard?: Array<Array<{
      text: string;
      callback_data?: string;
      url?: string;
    }>>;
    keyboard?: Array<Array<{
      text: string;
    }>>;
    resize_keyboard?: boolean;
    one_time_keyboard?: boolean;
  };
}

export class TelegramNotifier {
  static async sendTaskNotification(taskId: string): Promise<boolean> {
    try {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
          user: {
            select: {
              name: true,
              telegramBotToken: true,
              telegramUserId: true,
            }
          }
        }
      });

      if (!task || !task.user.telegramBotToken || !task.user.telegramUserId) {
        console.log('Task or user telegram settings not found for notification');
        return false;
      }

      if (task.isCompleted) {
        console.log('Task is already completed, skipping notification');
        return false;
      }

      if (task.notificationSent) {
        console.log('Notification already sent for this task');
        return false;
      }

      const priorityEmoji = this.getPriorityEmoji(task.priority);
      const priorityText = this.getPriorityText(task.priority);
      const dueDateText = task.dueDate 
        ? `\n📅 <b>سررسید:</b> ${new Date(task.dueDate).toLocaleDateString('fa-IR')}`
        : '';

      const message = `${priorityEmoji} <b>یادآوری وظیفه ${priorityText}</b>

🎯 <b>${task.title}</b>
${task.description ? `\n📝 ${task.description}` : ''}${dueDateText}

⏰ زمان انجام این وظیفه فرا رسیده است!

👆 برای تکمیل وظیفه روی دکمه زیر کلیک کنید:`;

      // Create inline keyboard for task completion
      const keyboard = {
        inline_keyboard: [
          [
            {
              text: "✅ انجام شد",
              callback_data: `complete_task_${taskId}`
            }
          ],
          [
            {
              text: "🌐 باز کردن سایت",
              url: process.env.FRONTEND_URL || 'http://localhost:9002'
            }
          ]
        ]
      };

      const success = await this.sendMessage(
        task.user.telegramBotToken,
        task.user.telegramUserId,
        message,
        keyboard
      );

      if (success) {
        // Mark notification as sent
        await prisma.task.update({
          where: { id: taskId },
          data: { notificationSent: true }
        });
      }

      return success;
    } catch (error) {
      console.error('Error sending task notification:', error);
      return false;
    }
  }

  static async sendMessage(botToken: string, chatId: string, text: string, replyMarkup?: any): Promise<boolean> {
    try {
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const payload: TelegramMessage = {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      };

      if (replyMarkup) {
        payload.reply_markup = replyMarkup;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result: any = await response.json();
      
      if (result.ok) {
        console.log('Telegram message sent successfully');
        return true;
      } else {
        console.error('Telegram API error:', result.description);
        return false;
      }
    } catch (error) {
      console.error('Error sending telegram message:', error);
      return false;
    }
  }

  static getPriorityEmoji(priority: string): string {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
        return '🔴';
      case 'MEDIUM':
        return '🟡';
      case 'LOW':
        return '🟢';
      default:
        return '📌';
    }
  }

  static getPriorityText(priority: string): string {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
        return 'فوری';
      case 'MEDIUM':
        return 'متوسط';
      case 'LOW':
        return 'کم اهمیت';
      default:
        return '';
    }
  }

  static async checkAndSendNotifications(): Promise<void> {
    try {
      console.log('Checking for pending notifications...');

      const now = new Date();
      console.log(`Current server time: ${now.toISOString()}`);
      console.log(`Current local time: ${now.toLocaleString('fa-IR', { timeZone: 'Asia/Tehran' })}`);
      
      const tasksToNotify = await prisma.task.findMany({
        where: {
          notifyAt: {
            lte: now // notification time has passed
          },
          notificationSent: false,
          isCompleted: false,
        },
        include: {
          user: {
            select: {
              telegramBotToken: true,
              telegramUserId: true,
            }
          }
        }
      });

      console.log(`Found ${tasksToNotify.length} tasks to notify`);
      
      // Log details of tasks found for debugging
      if (tasksToNotify.length > 0) {
        tasksToNotify.forEach(task => {
          console.log(`Task: ${task.title}, NotifyAt: ${task.notifyAt?.toISOString()}, Local: ${task.notifyAt?.toLocaleString('fa-IR', { timeZone: 'Asia/Tehran' })}`);
        });
      }

      for (const task of tasksToNotify) {
        if (task.user.telegramBotToken && task.user.telegramUserId) {
          console.log(`Sending notification for task: ${task.title}`);
          await this.sendTaskNotification(task.id);
          
          // Add a small delay between messages to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      console.log('Notification check completed');
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  }
}
