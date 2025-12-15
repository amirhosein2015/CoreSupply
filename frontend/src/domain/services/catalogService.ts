import { httpClient } from '../../infrastructure/api/httpClient';
import { Product } from '../models/Product';

export const catalogService = {
  // دریافت همه محصولات
  getProducts: async (): Promise<Product[]> => {
    // آدرس دقیق در Ocelot: /catalog (که به /api/v1/catalog سرویس کاتالوگ می‌رود)
    const response = await httpClient.get<Product[]>('/catalog');
    return response.data;
  },

  // دریافت یک محصول خاص
  getProductById: async (id: string): Promise<Product> => {
    const response = await httpClient.get<Product>(`/catalog/${id}`);
    return response.data;
  },
};
