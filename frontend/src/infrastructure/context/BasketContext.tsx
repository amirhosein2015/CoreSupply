// src/infrastructure/context/BasketContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ShoppingCart, BasketItem } from '../../domain/models/Basket';
import { basketService } from '../../domain/services/basketService';
import { useAuth } from '../auth/AuthContext'; // نیاز داریم تا بدانیم چه کسی لاگین کرده

interface BasketContextType {
  basket: ShoppingCart | null;
  itemCount: number; // تعداد کل آیتم‌ها برای نمایش در بج (Badge)
  addToBasket: (product: any) => Promise<void>; // product type can be refined
  loading: boolean;
}

const BasketContext = createContext<BasketContextType | null>(null);

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [basket, setBasket] = useState<ShoppingCart | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. لود کردن سبد خرید هنگام لاگین
  useEffect(() => {
    const loadBasket = async () => {
      if (isAuthenticated && user?.username) {
        setLoading(true);
        try {
          const data = await basketService.getBasket(user.username);
          setBasket(data);
        } catch (err) {
          console.error("Failed to load basket", err);
        } finally {
          setLoading(false);
        }
      }
    };
    loadBasket();
  }, [isAuthenticated, user]);

  // 2. محاسبه تعداد کل آیتم‌ها
  const itemCount = basket?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  // 3. متد افزودن به سبد
  const addToBasket = useCallback(async (product: any) => {
    if (!user?.username || !basket) return;

    // کپی عمیق از آیتم‌های فعلی
    const currentItems = [...basket.items];
    const existingItemIndex = currentItems.findIndex(i => i.productId === product.id);

    if (existingItemIndex >= 0) {
      // اگر محصول هست، تعدادش را زیاد کن
      currentItems[existingItemIndex].quantity += 1;
    } else {
      // اگر نیست، اضافه کن
      currentItems.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        color: 'Default'
      });
    }

    // آپدیت لوکال (Optimistic Update)
    const updatedBasket: ShoppingCart = {
      ...basket,
      items: currentItems
    };
    setBasket(updatedBasket);

    // آپدیت سرور
    try {
      await basketService.updateBasket(updatedBasket);
    } catch (err) {
      console.error("Failed to sync basket with server", err);
      // اینجا می‌توانیم رول‌بک کنیم (Rollback) ولی برای سادگی فعلا نمی‌کنیم
    }
  }, [basket, user]);

  return (
    <BasketContext.Provider value={{ basket, itemCount, addToBasket, loading }}>
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (!context) throw new Error("useBasket must be used within BasketProvider");
  return context;
};
