import { PrismaClient } from '@prisma/client';
import { TelegramNotifier } from '../utils/telegramNotifier';

const prisma = new PrismaClient();

export class TelegramBot {
  static async setupWebhook(botToken: string): Promise<boolean> {
    try {
      const webhookUrl = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/telegram/webhook`;
      
      const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl,
        }),
      });

      const result: any = await response.json();
      return result.ok;
    } catch (error) {
      console.error('Error setting up webhook:', error);
      return false;
    }
  }

  static async handleUpdate(update: any): Promise<void> {
    try {
      if (update.callback_query) {
        await this.handleCallbackQuery(update.callback_query);
      } else if (update.message) {
        await this.handleMessage(update.message);
      }
    } catch (error) {
      console.error('Error handling telegram update:', error);
    }
  }

  static async handleCallbackQuery(callbackQuery: any): Promise<void> {
    try {
      const chatId = callbackQuery.from.id.toString();
      const messageId = callbackQuery.message.message_id;
      const data = callbackQuery.data;

      // Find user by telegram ID
      const user = await prisma.user.findFirst({
        where: { telegramUserId: chatId }
      });

      if (!user || !user.telegramBotToken) {
        // Can't send message if we don't have bot token
        console.log('User not found or bot token missing for callback query');
        return;
      }

      if (data.startsWith('complete_task_')) {
        const taskId = data.replace('complete_task_', '');
        await this.completeTask(taskId, chatId, user.telegramBotToken!, messageId);
      } else if (data.startsWith('view_task_')) {
        const taskId = data.replace('view_task_', '');
        await this.showTaskDetails(taskId, chatId, user.telegramBotToken!, messageId);
      } else if (data === 'back_to_tasks') {
        await this.showUserTasks(chatId, user.id, user.telegramBotToken!, messageId);
      } else if (data === 'view_notes') {
        await this.showNoteTopics(chatId, user.id, user.telegramBotToken!, messageId);
      } else if (data.startsWith('view_topic_')) {
        const [, topicId, page = '0'] = data.split('_');
        await this.showNoteEntries(topicId, chatId, user.telegramBotToken!, parseInt(page), messageId);
      } else if (data.startsWith('back_to_notes')) {
        await this.showNoteTopics(chatId, user.id, user.telegramBotToken!, messageId);
      }

      // Answer callback query to remove loading state
      await fetch(`https://api.telegram.org/bot${user.telegramBotToken}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query_id: callbackQuery.id,
        }),
      });
    } catch (error) {
      console.error('Error handling callback query:', error);
    }
  }

  static async handleMessage(message: any): Promise<void> {
    try {
      const chatId = message.chat.id.toString();
      const text = message.text;

      // Find user by telegram ID
      const user = await prisma.user.findFirst({
        where: { telegramUserId: chatId }
      });

      if (!user || !user.telegramBotToken) {
        // Can't send message if we don't have bot token
        console.log('User not found or bot token missing for message');
        return;
      }

      // Handle reply keyboard commands
      if (text === '📝 یادداشت‌ها') {
        await this.showNoteTopics(chatId, user.id, user.telegramBotToken!);
      } else if (text === '📋 وظایف من') {
        await this.showUserTasks(chatId, user.id, user.telegramBotToken!);
      } else if (text === '/start') {
        await this.sendWelcomeMessage(chatId, user.name, user.telegramBotToken!);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  static async completeTask(taskId: string, chatId: string, botToken: string, messageId?: number): Promise<void> {
    try {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
          user: true
        }
      });

      if (!task) {
        const message = '❌ وظیفه یافت نشد.';
        if (messageId) {
          await this.editMessage(botToken, chatId, messageId, message);
        } else {
          await this.sendMessage(botToken, chatId, message);
        }
        return;
      }

      if (task.isCompleted) {
        const message = '✅ این وظیفه قبلاً تکمیل شده است.';
        if (messageId) {
          await this.editMessage(botToken, chatId, messageId, message);
        } else {
          await this.sendMessage(botToken, chatId, message);
        }
        return;
      }

      await prisma.task.update({
        where: { id: taskId },
        data: { isCompleted: true }
      });

      const keyboard = {
        inline_keyboard: [
          [{
            text: "🔙 بازگشت به وظایف",
            callback_data: `back_to_tasks`
          }],
          [{
            text: "🌐 ورود به سایت",
            url: process.env.FRONTEND_URL || 'https://example.com'
          }]
        ]
      };

      const message = `✅ <b>وظیفه تکمیل شد!</b>\n\n🎯 <b>${task.title}</b>\n\n🎉 آفرین! وظیفه با موفقیت انجام شد.`;

      if (messageId) {
        await this.editMessage(botToken, chatId, messageId, message, keyboard);
      } else {
        await this.sendMessage(botToken, chatId, message, keyboard);
      }
    } catch (error) {
      console.error('Error completing task:', error);
      const errorMessage = '❌ خطا در تکمیل وظیفه.';
      if (messageId) {
        await this.editMessage(botToken, chatId, messageId, errorMessage);
      } else {
        await this.sendMessage(botToken, chatId, errorMessage);
      }
    }
  }

  static async showNoteTopics(chatId: string, userId: string, botToken: string, messageId?: number): Promise<void> {
    try {
      const noteTopics = await prisma.noteTopic.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      if (noteTopics.length === 0) {
        const message = '📝 <b>یادداشت‌ها</b>\n\n❌ هیچ یادداشتی یافت نشد.\nبرای ایجاد یادداشت جدید به سایت مراجعه کنید.';
        const keyboard = {
          inline_keyboard: [[{
            text: "🌐 ورود به سایت",
            url: process.env.FRONTEND_URL || 'https://example.com'
          }]]
        };
        
        if (messageId) {
          await this.editMessage(botToken, chatId, messageId, message, keyboard);
        } else {
          await this.sendMessage(botToken, chatId, message, keyboard);
        }
        return;
      }

      const keyboard = {
        inline_keyboard: [
          ...noteTopics.map(topic => [{
            text: `📄 ${topic.topic}`,
            callback_data: `view_topic_${topic.id}`
          }]),
          [{
            text: "🌐 ورود به سایت",
            url: process.env.FRONTEND_URL || 'https://example.com'
          }]
        ]
      };

      const message = `📝 <b>یادداشت‌های شما (${noteTopics.length})</b>\n\n👆 روی هر یادداشت کلیک کنید تا مطالب آن را ببینید:`;

      if (messageId) {
        await this.editMessage(botToken, chatId, messageId, message, keyboard);
      } else {
        await this.sendMessage(botToken, chatId, message, keyboard);
      }
    } catch (error) {
      console.error('Error showing note topics:', error);
      await this.sendMessage(botToken, chatId, '❌ خطا در نمایش یادداشت‌ها.');
    }
  }

  static async showNoteEntries(topicId: string, chatId: string, botToken: string, page: number = 0, messageId?: number): Promise<void> {
    try {
      const ENTRIES_PER_PAGE = 5;
      const skip = page * ENTRIES_PER_PAGE;

      const noteTopic = await prisma.noteTopic.findUnique({
        where: { id: topicId },
        include: {
          entries: {
            orderBy: { createdAt: 'desc' },
            skip: skip,
            take: ENTRIES_PER_PAGE
          }
        }
      });

      if (!noteTopic) {
        const message = '❌ یادداشت یافت نشد.';
        if (messageId) {
          await this.editMessage(botToken, chatId, messageId, message);
        } else {
          await this.sendMessage(botToken, chatId, message);
        }
        return;
      }

      // Get total count for pagination
      const totalEntries = await prisma.noteEntry.count({
        where: { topicId }
      });

      if (totalEntries === 0) {
        const message = `📄 <b>${noteTopic.topic}</b>\n\n❌ این یادداشت خالی است.`;
        const keyboard = {
          inline_keyboard: [
            [{
              text: "🔙 بازگشت",
              callback_data: `back_to_notes`
            }],
            [{
              text: "🌐 ورود به سایت",
              url: process.env.FRONTEND_URL || 'http://localhost:9002'
            }]
          ]
        };
        
        if (messageId) {
          await this.editMessage(botToken, chatId, messageId, message, keyboard);
        } else {
          await this.sendMessage(botToken, chatId, message, keyboard);
        }
        return;
      }

      const totalPages = Math.ceil(totalEntries / ENTRIES_PER_PAGE);
      const currentPage = page + 1;

      let message = `📄 <b>${noteTopic.topic}</b>\n`;
      message += `📊 صفحه ${currentPage} از ${totalPages} (${totalEntries} یادداشت)\n\n`;
      
      noteTopic.entries.forEach((entry, index) => {
        const date = new Date(entry.createdAt).toLocaleDateString('fa-IR');
        const entryNumber = skip + index + 1;
        message += `${entryNumber}. ${entry.content}\n📅 ${date}\n\n`;
      });

      // Create pagination buttons
      const keyboard: any = {
        inline_keyboard: []
      };

      // Navigation buttons
      const navRow = [];
      if (page > 0) {
        navRow.push({
          text: "⬅️ قبلی",
          callback_data: `view_topic_${topicId}_${page - 1}`
        });
      }
      if (page < totalPages - 1) {
        navRow.push({
          text: "بعدی ➡️",
          callback_data: `view_topic_${topicId}_${page + 1}`
        });
      }

      if (navRow.length > 0) {
        keyboard.inline_keyboard.push(navRow);
      }

      // Back button
      keyboard.inline_keyboard.push([{
        text: "🔙 بازگشت",
        callback_data: `back_to_notes`
      }]);

      // Website button
      keyboard.inline_keyboard.push([{
        text: "🌐 ورود به سایت",
        url: process.env.FRONTEND_URL || 'http://localhost:9002'
      }]);

      if (messageId) {
        await this.editMessage(botToken, chatId, messageId, message, keyboard);
      } else {
        await this.sendMessage(botToken, chatId, message, keyboard);
      }
    } catch (error) {
      console.error('Error showing note entries:', error);
      await this.sendMessage(botToken, chatId, '❌ خطا در نمایش محتوای یادداشت.');
    }
  }

  static async showUserTasks(chatId: string, userId: string, botToken: string, messageId?: number): Promise<void> {
    try {
      const tasks = await prisma.task.findMany({
        where: { 
          userId,
          isCompleted: false 
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      if (tasks.length === 0) {
        const message = '📋 <b>وظایف شما</b>\n\n✅ تبریک! همه وظایف شما تکمیل شده است.';
        const keyboard = {
          inline_keyboard: [[{
            text: "🌐 ورود به سایت",
            url: process.env.FRONTEND_URL || 'https://example.com'
          }]]
        };
        
        if (messageId) {
          await this.editMessage(botToken, chatId, messageId, message, keyboard);
        } else {
          await this.sendMessage(botToken, chatId, message, keyboard);
        }
        return;
      }

      // Create inline keyboard with tasks
      const keyboard = {
        inline_keyboard: [
          ...tasks.map(task => {
            const priorityEmoji = TelegramNotifier.getPriorityEmoji(task.priority);
            const taskTitle = task.title.length > 25 ? task.title.substring(0, 25) + '...' : task.title;
            
            return [{
              text: `${priorityEmoji} ${taskTitle}`,
              callback_data: `view_task_${task.id}`
            }];
          }),
          [{
            text: "🌐 ورود به سایت",
            url: process.env.FRONTEND_URL || 'https://example.com'
          }]
        ]
      };

      const message = `📋 <b>وظایف باقی‌مانده (${tasks.length})</b>\n\n👆 روی هر وظیفه کلیک کنید تا جزئیات آن را ببینید:`;

      if (messageId) {
        await this.editMessage(botToken, chatId, messageId, message, keyboard);
      } else {
        await this.sendMessage(botToken, chatId, message, keyboard);
      }
    } catch (error) {
      console.error('Error showing user tasks:', error);
      await this.sendMessage(botToken, chatId, '❌ خطا در نمایش وظایف.');
    }
  }

  static async showTaskDetails(taskId: string, chatId: string, botToken: string, messageId?: number): Promise<void> {
    try {
      const task = await prisma.task.findUnique({
        where: { id: taskId }
      });

      if (!task) {
        const message = '❌ وظیفه یافت نشد.';
        if (messageId) {
          await this.editMessage(botToken, chatId, messageId, message);
        } else {
          await this.sendMessage(botToken, chatId, message);
        }
        return;
      }

      const priorityEmoji = TelegramNotifier.getPriorityEmoji(task.priority);
      const priorityText = TelegramNotifier.getPriorityText(task.priority);
      const dueDateText = task.dueDate 
        ? `\n📅 <b>سررسید:</b> ${new Date(task.dueDate).toLocaleDateString('fa-IR')}`
        : '';
      const notifyAtText = task.notifyAt 
        ? `\n🔔 <b>زمان اعلان:</b> ${new Date(task.notifyAt).toLocaleDateString('fa-IR')} - ${new Date(task.notifyAt).toLocaleTimeString('fa-IR')}`
        : '';

      const message = `${priorityEmoji} <b>جزئیات وظیفه ${priorityText}</b>

🎯 <b>${task.title}</b>
${task.description ? `\n📝 <b>توضیحات:</b>\n${task.description}` : ''}${dueDateText}${notifyAtText}

📊 <b>وضعیت:</b> ${task.isCompleted ? '✅ انجام شده' : '⏳ در حال انجام'}
📅 <b>تاریخ ایجاد:</b> ${new Date(task.createdAt).toLocaleDateString('fa-IR')}`;

      const keyboard = {
        inline_keyboard: [
          task.isCompleted ? [] : [{
            text: "✅ انجام شد",
            callback_data: `complete_task_${taskId}`
          }],
          [{
            text: "🔙 بازگشت",
            callback_data: `back_to_tasks`
          }],
          [{
            text: "🌐 ورود به سایت",
            url: process.env.FRONTEND_URL || 'https://example.com'
          }]
        ].filter(row => row.length > 0)
      };

      if (messageId) {
        await this.editMessage(botToken, chatId, messageId, message, keyboard);
      } else {
        await this.sendMessage(botToken, chatId, message, keyboard);
      }
    } catch (error) {
      console.error('Error showing task details:', error);
      await this.sendMessage(botToken, chatId, '❌ خطا در نمایش جزئیات وظیفه.');
    }
  }

  static async sendWelcomeMessage(chatId: string, userName: string, botToken: string): Promise<void> {
    const message = `👋 <b>سلام ${userName}!</b>\n\n🎉 به ربات TODO LIST خوش آمدید!\n\nاز طریق این ربات می‌توانید:\n• اعلان‌های وظایف را دریافت کنید\n• وظایف را مشاهده و تکمیل کنید\n• یادداشت‌ها را مرور کنید\n\n👇 از منوی زیر استفاده کنید:`;
    
    const replyKeyboard = {
      keyboard: [
        [{ text: '📋 وظایف من' }, { text: '📝 یادداشت‌ها' }]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    };

    await this.sendMessage(botToken, chatId, message, replyKeyboard);
  }

  static async sendMessage(botToken: string, chatId: string, text: string, replyMarkup?: any): Promise<boolean> {
    return TelegramNotifier.sendMessage(botToken, chatId, text, replyMarkup);
  }

  static async editMessage(botToken: string, chatId: string, messageId: number, text: string, replyMarkup?: any): Promise<boolean> {
    try {
      const url = `https://api.telegram.org/bot${botToken}/editMessageText`;
      const payload: any = {
        chat_id: chatId,
        message_id: messageId,
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
      return result.ok;
    } catch (error) {
      console.error('Error editing telegram message:', error);
      return false;
    }
  }

  static splitMessage(text: string, maxLength: number): string[] {
    const chunks: string[] = [];
    let currentChunk = '';
    
    const lines = text.split('\n');
    
    for (const line of lines) {
      if ((currentChunk + line + '\n').length > maxLength) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }
      }
      currentChunk += line + '\n';
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  }
}
