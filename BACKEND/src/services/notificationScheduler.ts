import { TelegramNotifier } from '../utils/telegramNotifier';

export class NotificationScheduler {
  private static intervalId: NodeJS.Timeout | null = null;
  private static readonly CHECK_INTERVAL = 60000; // Check every minute

  static start(): void {
    if (this.intervalId) {
      console.log('Notification scheduler is already running');
      return;
    }

    console.log('Starting notification scheduler...');
    
    // Run initial check
    TelegramNotifier.checkAndSendNotifications();
    
    // Set up recurring checks
    this.intervalId = setInterval(() => {
      TelegramNotifier.checkAndSendNotifications();
    }, this.CHECK_INTERVAL);

    console.log(`Notification scheduler started with ${this.CHECK_INTERVAL}ms interval`);
  }

  static stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Notification scheduler stopped');
    }
  }

  static isRunning(): boolean {
    return this.intervalId !== null;
  }
}
