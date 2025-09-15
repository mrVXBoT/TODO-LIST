import { Router, Request, Response } from 'express';
import { TelegramBot } from '../services/telegramBot';
import { createApiResponse } from '../utils/auth';

const router = Router();

// Webhook endpoint for Telegram bot
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const update = req.body;
    console.log('Telegram webhook received:', JSON.stringify(update, null, 2));
    
    await TelegramBot.handleUpdate(update);
    
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    res.status(500).json(createApiResponse(false, 'Webhook error'));
  }
});

// Setup webhook endpoint (for development/testing)
router.post('/setup-webhook', async (req: Request, res: Response) => {
  try {
    const { botToken } = req.body;
    
    if (!botToken) {
      res.status(400).json(createApiResponse(false, 'Bot token is required'));
      return;
    }
    
    const success = await TelegramBot.setupWebhook(botToken);
    
    if (success) {
      res.json(createApiResponse(true, 'Webhook setup successfully'));
    } else {
      res.status(400).json(createApiResponse(false, 'Failed to setup webhook'));
    }
  } catch (error) {
    console.error('Setup webhook error:', error);
    res.status(500).json(createApiResponse(false, 'Internal server error'));
  }
});

// Manual test endpoint for development
router.post('/test-message', async (req: Request, res: Response) => {
  try {
    const { chatId, command } = req.body;
    
    if (!chatId) {
      res.status(400).json(createApiResponse(false, 'Chat ID is required'));
      return;
    }
    
    // Simulate a message update
    const mockUpdate = {
      message: {
        chat: { id: parseInt(chatId) },
        text: command || '📋 وظایف من'
      }
    };
    
    await TelegramBot.handleUpdate(mockUpdate);
    
    res.json(createApiResponse(true, 'Test message processed'));
  } catch (error) {
    console.error('Test message error:', error);
    res.status(500).json(createApiResponse(false, 'Internal server error'));
  }
});

export default router;
