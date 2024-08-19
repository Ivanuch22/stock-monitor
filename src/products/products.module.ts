import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsService } from './products.service';
import { KeyCRMService } from '../keycrm/keycrm.service';  // Переконайтеся, що сервіс імпортовано
import { TelegramService } from '../telegram/telegram.service';  // Переконайтеся, що сервіс імпортовано


import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './models/product.model';
@Module({
  imports: [
    SequelizeModule.forFeature([Product]),
    ConfigModule],
  providers: [ProductsService, KeyCRMService, TelegramService],
  exports: [ProductsService,SequelizeModule]
})
export class ProductsModule {}
