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

// ✅ اینترفیس اصلاح شده برای نمایش در جدول
export interface OrderSummary {
  id: string;          // مطابق با خروجی بک‌اند
  createdAt: string;   // مطابق با خروجی بک‌اند
  status: string;      // مطابق با خروجی بک‌اند
  totalPrice: number;  // مطابق با خروجی بک‌اند
}
