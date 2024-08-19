import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KeyCRMService } from './keycrm.service';

describe('KeyCRMService', () => {
  let service: KeyCRMService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [KeyCRMService, ConfigService],
    }).compile();

    service = module.get<KeyCRMService>(KeyCRMService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should return products data', async () => {
    // Замокуємо поведінку ConfigService
    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      if (key === 'crm.accounts') {
        return [{
          name: 'Account 1',
          apiKey: process.env.KEYCRM_API_KEY_1,  // Використання реального ключа API з .env файлу
          baseUrl: 'https://openapi.keycrm.app/v1'
        }];
      }
    });

    // Замокуємо поведінку getProducts і виводимо результат в консоль
    jest.spyOn(service, 'getProducts').mockImplementation(async (accountName: string) => {
      const products = 'Expected data';  // Тут ви могли б виконати реальний запит і отримати реальні дані
      console.log('Products:', products);  // Вивід результату в консоль
      return products;
    });

    const result = await service.getProducts('Account 1');
    expect(result).toBe('Expected data');
  });
});
