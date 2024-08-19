import { Controller, Get, Param } from '@nestjs/common';
import { KeyCRMService } from '../keycrm/keycrm.service';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private keyCRMService: KeyCRMService  ,private productsService: ProductsService) {}


  @Get(':accountName')
  async getProducts(@Param('accountName') accountName: string) {
    console.log(this.keyCRMService.getProducts(accountName))
    return this.keyCRMService.getProducts(accountName);
  }
  @Get(':accountName/all')
  async getAllProducts(@Param('accountName') accountName: string) {
    return this.keyCRMService.getAllProducts(accountName);
  }
  @Get(':accountName/send')
  async sendMessageToKeycrm(@Param('accountName') accountName: string) {
    return this.productsService.fetchAndNotifyProducts(accountName);
  }
}
