// src/domain/services/catalogService.ts

import { httpClient } from '../../infrastructure/api/httpClient';
import { Product } from '../models/Product';

// تعریف مدل داده‌ای که برای ساخت محصول نیاز داریم
export interface CreateProductRequest {
  id?: string | null; 
  name: string;
  category: string;
  summary?: string;
  description?: string;
  imageFile?: string;
  price: number;
}

export const catalogService = {
  // دریافت لیست محصولات
  getProducts: async (): Promise<Product[]> => {
    // مسیر API Gateway برای کاتالوگ
    const response = await httpClient.get<Product[]>('/catalog'); 
    return response.data;
  },

  // متد جدید: ساخت محصول
  createProduct: async (product: CreateProductRequest): Promise<Product> => {
    // ارسال درخواست POST به همان آدرس
    const response = await httpClient.post<Product>('/catalog', product);
    return response.data;
  }
};

