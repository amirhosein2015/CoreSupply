// src/domain/models/Basket.ts

export interface BasketItem {
  quantity: number;
  unitPrice: number;
  // ✅ تغییر نام فیلدها طبق خطای سرور
  componentId: string;   
  componentName: string; 
}

export interface ShoppingCart {
  buyerId: string;
  items: BasketItem[];
  totalPrice?: number;
}
