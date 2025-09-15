import { TelegramBot } from './telegramBot';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TelegramPolling {
  private static intervals: Map<string, NodeJS.Timeout> = new Map();
  private static readonly POLL_INTERVAL = 3000; // 3 seconds

  static async startPolling(): Promise<void> {
    try {
      // Get all users with telegram settings
      const users = await prisma.user.findMany({
        where: {
          AND: [
            { telegramBotToken: { not: null } },
            { telegramUserId: { not: null } }
          ]
        },
        select: {
          id: true,
          telegramBotToken: true,
          telegramUserId: true,
          name: true
        }
      });

      console.log(`Starting telegram polling for ${users.length} users`);

      for (const user of users) {
        if (user.telegramBotToken) {
          this.startUserPolling(user.telegramBotToken);
        }
      }
    } catch (error) {
      console.error('Error starting telegram polling:', error);
    }
  }

  static startUserPolling(botToken: string): void {
    if (this.intervals.has(botToken)) {
      return; // Already polling for this bot
    }

    console.log(`Starting polling for bot: ${botToken.substring(0, 10)}...`);

    let offset = 0;

    const poll = async () => {
      try {
        const url = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${offset}&limit=10&timeout=1`;
        
        const response = await fetch(url);
        const result: any = await response.json();

        if (result.ok && result.result.length > 0) {
          for (const update of result.result) {
            console.log('Received telegram update:', JSON.stringify(update, null, 2));
            
            await TelegramBot.handleUpdate(update);
            offset = update.update_id + 1;
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    // Start polling
    poll(); // Initial call
    const intervalId = setInterval(poll, this.POLL_INTERVAL);
    this.intervals.set(botToken, intervalId);
  }

  static stopUserPolling(botToken: string): void {
    const intervalId = this.intervals.get(botToken);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete(botToken);
      console.log(`Stopped polling for bot: ${botToken.substring(0, 10)}...`);
    }
  }

  static stopAllPolling(): void {
    for (const [botToken, intervalId] of this.intervals) {
      clearInterval(intervalId);
      console.log(`Stopped polling for bot: ${botToken.substring(0, 10)}...`);
    }
    this.intervals.clear();
  }

  static async restartPolling(): Promise<void> {
    this.stopAllPolling();
    await this.startPolling();
  }
}

