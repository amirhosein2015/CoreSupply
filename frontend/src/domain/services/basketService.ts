// src/domain/services/basketService.ts

import { httpClient } from '../../infrastructure/api/httpClient';
import { ShoppingCart } from '../models/Basket';
import { BasketCheckout } from '../models/Order';

export const basketService = {
  // دریافت سبد خرید کاربر
  getBasket: async (userName: string): Promise<ShoppingCart> => {
    try {
      const response = await httpClient.get<ShoppingCart>(`/basket/${userName}`);
      return response.data;
    } catch (error) {
   // ✅ اصلاح: استفاده از buyerId
      return { buyerId: userName, items: [] };
    }
  },

  // آپدیت سبد خرید
  updateBasket: async (basket: ShoppingCart): Promise<ShoppingCart> => {
    const response = await httpClient.post<ShoppingCart>('/basket', basket);
    return response.data;
  },

  // حذف کامل سبد خرید
  deleteBasket: async (userName: string): Promise<void> => {
    await httpClient.delete(`/basket/${userName}`);
  }, // ✅ کاما اضافه شد

  // ✅ متد چک‌اوت
  checkout: async (checkoutData: BasketCheckout): Promise<void> => {
    await httpClient.post('/basket/checkout', checkoutData);
  }
};
