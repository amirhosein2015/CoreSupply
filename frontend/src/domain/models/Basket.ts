// src/domain/models/Basket.ts

export interface BasketItem {
  quantity: number;
  color?: string;      // برای آینده (Optional)
  price: number;
  productId: string;
  productName: string;
}

export interface ShoppingCart {
  userName: string;    // کلید اصلی در Redis (معمولاً ایمیل یا ID کاربر)
  items: BasketItem[];
  totalPrice?: number; // محاسبه شده در فرانت یا بک
}
