// src/products/products.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeyCRMService } from '../keycrm/keycrm.service';
import { TelegramService } from '../telegram/telegram.service';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './models/product.model';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private configService: ConfigService,
    private keyCRMService: KeyCRMService,
    private telegramService: TelegramService,
    @InjectModel(Product) private productModel: typeof Product
  ) { }

  // @Cron('55 9 * * *')
  @Cron('*/3 * * * *')
  // @Cron('0 */20 * * * *')
  async handleCron(): Promise<void> {
    const accounts = this.configService.get<{ name: string; apiKey: string; baseUrl: string; }[]>('crm.accounts');
    this.logger.debug('Running fetchAndNotifyProducts for all accounts.');
    for (const account of accounts) {
	console.log("starting ", account) 
     await this.fetchAndNotifyProducts(account.name);
    }
  }

async fetchAndNotifyProducts(accountName: string): Promise<void> {
  const account = this.configService.get<{ name: string, telegramChannelId: string; }[]>('crm.accounts')
    .find(acc => acc.name === accountName);
  const quantities = this.configService.get<number[]>('crm.productQuantities');
  const allProducts = await this.keyCRMService.getAllProducts(accountName);

  // Fetch all existing products to check for updates or new entries
  const productIds = allProducts.map(product => product.id);
  const existingProducts = await this.productModel.findAll({
    where: { product_id: productIds, account_name: accountName }
  });

  for (const product of allProducts) {
    const existingProduct = existingProducts.find(p => p.product_id === product.id);

    if (existingProduct) {
      if (parseFloat(`${existingProduct.product_quantity}`) !== parseFloat(`${
      product.quantity}`)) {
        this.logger.log(`Quantity changed for product ${product.name}: from ${existingProduct.product_quantity} to ${product.quantity}`);
        existingProduct.product_quantity = product.quantity;
        try {
          await existingProduct.save();
          if (quantities.includes(product.quantity)) {
            const message = `CRM: ${accountName}\nТовар: ${product.name}\nЗалишок: ${product.quantity}`;
            await this.sendMessageWithExponentialBackoff(account.telegramChannelId, message);
          }
        } catch (error) {
          this.logger.error(`Failed to update product ${product.name}: ${error.message}`);
        }
      }
    } else {
      try {
        await this.productModel.create({
          product_id: product.id,
          product_name: product.name,
          product_quantity: product.quantity,
          account_name: accountName
        });
        this.logger.log(`New product added: ${product.name}`);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          this.logger.error(`Attempted to add a duplicate product: ${product.name}`);
        } else {
          throw error;
        }
      }
    }
  }
}


  async sendMessageWithExponentialBackoff(chatId: string, message: string, retryCount = 0): Promise<void> {
    try {
      await this.telegramService.sendMessage(chatId, message);
    } catch (error) {
      if (error.response && error.response.error_code === 429) {
        const retryAfter = error.response.parameters.retry_after || Math.pow(2, retryCount);
        this.logger.error(`Rate limit exceeded. Retrying after ${retryAfter} seconds.`);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        await this.sendMessageWithExponentialBackoff(chatId, message, retryCount + 1);
      } else {
        throw error;
      }
    }
  }
}

