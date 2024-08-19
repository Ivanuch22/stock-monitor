import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from '../config/app.config';
import { KeyCRMService } from './keycrm/keycrm.service';
import { ProductsController } from './products/products.controller';
import { TelegramService } from './telegram/telegram.service';
import { ProductsModule } from './products/products.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  controllers: [ProductsController],
  providers: [
    KeyCRMService,
    TelegramService // Ensure the TelegramService is provided here if it's used across the module
  ],
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'sover95.mysql.tools',
      port: 3306,
      username: 'sover95_stockmonitor',
      password: '+Ba37G4xi_',
      database: 'sover95_stockmonitor',
      logging: false,
      autoLoadModels: true,
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    ProductsModule,
    ConfigModule.forRoot({
      load: [appConfig], // This ensures your app configuration is globally available
    }),
  ],
})
export class AppModule {}
