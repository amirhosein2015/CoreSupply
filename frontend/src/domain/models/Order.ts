// src/domain/models/Order.ts

// اینترفیس برای ثبت سفارش (بدون تغییر)
export interface BasketCheckout {
  userName: string;
  totalPrice: number;
  
  // اطلاعات آدرس
  firstName: string;
  lastName: string;
  emailAddress: string;
  addressLine: string;
  country: string;
  state?: string;
  zipCode: string;

  // اطلاعات پرداخت (فیک)
  cardName: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
  paymentMethod: number;
}

// اینترفیس برای نمایش تاریخچه سفارش (بدون تغییر)
export interface OrderResponse {
  userName: string;
  totalPrice: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  addressLine: string;
  country: string;
  state: string;
  zipCode: string;
}

export interface OrderSummary {
  id: string;          // مطابق خروجی بک‌اِند
  createdAt: string;   // مطابق خروجی بک‌اِند
  status: string;      // مطابق خروجی بک‌اِند
  totalPrice: number;  // مطابق خروجی بک‌اِند
}
