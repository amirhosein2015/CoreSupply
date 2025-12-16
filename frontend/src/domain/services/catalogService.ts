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
  getProducts: async (): Promise<Product[]> => {
    const response = await httpClient.get<Product[]>('/catalog'); 
    return response.data;
  },

  createProduct: async (product: CreateProductRequest): Promise<Product> => {
    const response = await httpClient.post<Product>('/catalog', product);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await httpClient.delete(`/catalog/${id}`);
  },

  // ✅ متد جدید: ویرایش محصول
  updateProduct: async (product: Product): Promise<void> => {
    // معمولا PUT به ریشه /catalog فرستاده می‌شود و شامل ID در بدنه است
    await httpClient.put('/catalog', product);
  }
};
