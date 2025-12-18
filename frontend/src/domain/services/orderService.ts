// src/domain/services/orderService.ts

import { httpClient } from '../../infrastructure/api/httpClient';
import { OrderSummary } from '../models/Order'; // ✅ اصلاح مسیر ایمپورت

export const orderService = {
  getOrdersByUser: async (userName: string): Promise<OrderSummary[]> => {
    try {
      // استفاده از همان Gateway (پورت 9000) که الان برای لاگین و کاتالوگ سبز است
      const response = await httpClient.get<OrderSummary[]>(`/api/v1/Order/${encodeURIComponent(userName)}`);
      return response.data;
    } catch (error) {
      console.error("Order Service API Error:", error);
      throw error;
    }
  }
};
