import { registerAs } from '@nestjs/config';

export default registerAs('crm', () => ({
  webhookUrl: process.env.WEBHOOK_URL || 'https://localhost:3000',
  accounts: [
    {
      name: 'Account_1',
      apiKey: process.env.KEYCRM_API_KEY_1,
      baseUrl: 'https://openapi.keycrm.app/v1',
      telegramChannelId: process.env.TELEGRAM_CHANNEL_ID_1
    },
    {
      name: 'Account_4',
      apiKey: process.env.KEYCRM_API_KEY_4,
      baseUrl: 'https://openapi.keycrm.app/v1',
      telegramChannelId: process.env.TELEGRAM_CHANNEL_ID_4
    },
    {
      name: 'Account_2',
      apiKey: process.env.KEYCRM_API_KEY_2,
      baseUrl: 'https://openapi.keycrm.app/v1',
      telegramChannelId: process.env.TELEGRAM_CHANNEL_ID_2
    },
    {
      name: 'Account_3',
      apiKey: process.env.KEYCRM_API_KEY_3,
      baseUrl: 'https://openapi.keycrm.app/v1',
      telegramChannelId: process.env.TELEGRAM_CHANNEL_ID_3
    }
  ],
  productQuantities: [50, 20, 10, 5,2,3, 1]
}));
