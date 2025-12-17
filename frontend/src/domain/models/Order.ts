// src/domain/models/Order.ts

// مدلی که برای ثبت سفارش می‌فرستیم
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

  // اطلاعات پرداخت (فعلاً فیک)
  cardName: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
  paymentMethod: number; // 1: Credit Card
}

// مدلی که بعداً برای نمایش تاریخچه سفارش استفاده می‌کنیم
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
