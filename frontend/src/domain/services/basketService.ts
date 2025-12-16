// src/domain/services/basketService.ts

import { httpClient } from '../../infrastructure/api/httpClient';
import { ShoppingCart } from '../models/Basket';

export const basketService = {
  // دریافت سبد خرید کاربر
  getBasket: async (userName: string): Promise<ShoppingCart> => {
    try {
      const response = await httpClient.get<ShoppingCart>(`/basket/${userName}`);
      return response.data;
    } catch (error) {
      // اگر سبد خرید وجود نداشت (404)، یک سبد خالی برمی‌گردانیم
      return { userName, items: [] };
    }
  },

  // آپدیت سبد خرید (افزودن/حذف آیتم)
  updateBasket: async (basket: ShoppingCart): Promise<ShoppingCart> => {
    const response = await httpClient.post<ShoppingCart>('/basket', basket);
    return response.data;
  },

  // حذف کامل سبد خرید (بعد از ثبت سفارش)
  deleteBasket: async (userName: string): Promise<void> => {
    await httpClient.delete(`/basket/${userName}`);
  }
};
