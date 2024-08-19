import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeyCRMService {
  constructor(private configService: ConfigService) {}

  async getProducts(accountName: string): Promise<any> {
    const account = this.configService.get('crm.accounts').find(acc => acc.name === accountName);
    if (!account) throw new Error(`Account ${accountName} not found`);

    const url = `${account.baseUrl}/products`;
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${account.apiKey}` },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching products from ${accountName}:`, error);
      throw error;
    }
  }
  async getAllProducts(accountName: string): Promise<any[]> {
    const account = this.configService.get('crm.accounts').find(acc => acc.name === accountName);
    if (!account) throw new Error(`Account ${accountName} not found`);

    const baseUrl = `${account.baseUrl}/products`;
    const apiKey = account.apiKey;
    const quantities = this.configService.get<number[]>('crm.productQuantities').join(',');

    let allProducts = [];
    let page = 1;
    let totalPages = 1;  // Assume there's at least one page

    do {
      const url = `${baseUrl}?page=${page}&limit=50&quantity=${quantities}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${apiKey}` }
      });
      allProducts = allProducts.concat(response.data.data);
      totalPages = response.data.last_page;
      page++;
    } while (page <= totalPages);

    return allProducts;
  }
}
