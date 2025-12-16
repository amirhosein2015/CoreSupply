// src/infrastructure/context/BasketContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ShoppingCart } from '../../domain/models/Basket';
import { basketService } from '../../domain/services/basketService';
import { useAuth } from '../auth/AuthContext';

interface BasketContextType {
  basket: ShoppingCart | null;
  itemCount: number;
  addToBasket: (product: any) => Promise<void>;
  removeFromBasket: (productId: string) => Promise<void>; // ✅ متد جدید
  totalPrice: number; // ✅ قیمت کل
  loading: boolean;
}

const BasketContext = createContext<BasketContextType | null>(null);

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [basket, setBasket] = useState<ShoppingCart | null>(null);
  const [loading, setLoading] = useState(false);

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

  const itemCount = basket?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  // محاسبه قیمت کل سبد
  const totalPrice = basket?.items.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;

  const addToBasket = useCallback(async (product: any) => {
    if (!user?.username || !basket) return;
    const currentItems = [...basket.items];
    const existingItemIndex = currentItems.findIndex(i => i.productId === product.id);

    if (existingItemIndex >= 0) {
      currentItems[existingItemIndex].quantity += 1;
    } else {
      currentItems.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        color: 'Default'
      });
    }

    const updatedBasket = { ...basket, items: currentItems };
    setBasket(updatedBasket);
    await basketService.updateBasket(updatedBasket);
  }, [basket, user]);

  // ✅ پیاده‌سازی متد حذف
  const removeFromBasket = useCallback(async (productId: string) => {
    if (!user?.username || !basket) return;
    
    // فیلتر کردن آیتم حذف شده
    const updatedItems = basket.items.filter(item => item.productId !== productId);
    
    const updatedBasket = { ...basket, items: updatedItems };
    
    // آپدیت UI
    setBasket(updatedBasket);
    
    // آپدیت Server
    await basketService.updateBasket(updatedBasket);
  }, [basket, user]);

  return (
    <BasketContext.Provider value={{ basket, itemCount, addToBasket, removeFromBasket, totalPrice, loading }}>
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (!context) throw new Error("useBasket must be used within BasketProvider");
  return context;
};
