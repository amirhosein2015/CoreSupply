// src/domain/services/catalogService.ts

import { httpClient } from '../../infrastructure/api/httpClient';
import { Product } from '../models/Product';

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
    const response = await httpClient.get<Product[]>('/catalog'); 
    return response.data;
  },

  // ساخت محصول جدید
  createProduct: async (product: CreateProductRequest): Promise<Product> => {
    const response = await httpClient.post<Product>('/catalog', product);
    return response.data;
  }, // <--- ویرگول مهم اینجاست که متدها را جدا می‌کند

  // حذف محصول
  deleteProduct: async (id: string): Promise<void> => {
    await httpClient.delete(`/catalog/${id}`);
  }
};

