import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
  private bot: Telegraf;
  private readonly logger = new Logger(TelegramService.name);

  constructor(private configService: ConfigService) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined in the environment variables.');
    }
    this.bot = new Telegraf(botToken);
    this.setupWebhook();
  }

  async setupWebhook() {
    const url = this.configService.get<string>('crm.webhookUrl'); // Corrected configuration path
    if (!url) {
      throw new Error('Webhook URL is not defined in the configuration.');
    }
    try {
      await this.bot.telegram.setWebhook(url);
      this.logger.log(`Webhook set to ${url}`);
    } catch (error) {
      if (error.response && error.response.error_code === 429) {
        const delay = error.response.parameters.retry_after * 1000;
        this.logger.error(`Rate limit exceeded. Retrying after ${delay} milliseconds`);
        setTimeout(() => this.setupWebhook(), delay);
      } else {
        this.logger.error(`Failed to set webhook: ${error.message}`);
        throw error;
      }
    }
  }

  async sendMessage(chatId: string, message: string): Promise<void> {
    try {
      await this.bot.telegram.sendMessage(chatId, message);
      this.logger.log(`Message sent to ${chatId}`);
    } catch (error) {
      this.logger.error(`Failed to send message: ${error.message}`);
      throw error;
    }
  }
}
