import { httpClient } from '../../infrastructure/api/httpClient';
import { OrderSummary } from '../models/Order';

export const orderService = {
  getOrdersByUser: async (userName: string): Promise<OrderSummary[]> => {
    // از کلاینت استاندارد پروژه استفاده می‌کنیم
    const response = await httpClient.get<OrderSummary[]>(`/api/v1/Order/${userName}`);
    return response.data;
  }
};
