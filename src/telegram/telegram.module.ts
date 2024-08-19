import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Module({
  providers: [TelegramService],
  exports: [TelegramService]  // Експортувати сервіс, щоб він міг бути використаний іншими частинами додатку
})
export class TelegramModule {}
