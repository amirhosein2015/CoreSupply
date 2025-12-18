// src/infrastructure/context/BasketContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ShoppingCart } from '../../domain/models/Basket';
import { basketService } from '../../domain/services/basketService';
import { useAuth } from '../auth/AuthContext';

interface BasketContextType {
  basket: ShoppingCart | null;
  itemCount: number;
  addToBasket: (product: any) => Promise<void>;
  removeFromBasket: (productId: string) => Promise<void>;
  clearBasket: () => void; // ✅ اضافه شد
  totalPrice: number;
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
          if (!data.buyerId) data.buyerId = user.username;
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
  const totalPrice = basket?.items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0) || 0;

  // ✅ متد جدید برای خالی کردن سبد
  const clearBasket = useCallback(() => {
    setBasket(null);
  }, []);

  const addToBasket = useCallback(async (product: any) => {
    if (!user?.username) return;
    const currentBasket = basket || { buyerId: user.username, items: [] };
    const currentItems = [...currentBasket.items];
    
    const existingItemIndex = currentItems.findIndex(i => i.componentId === product.id);
    if (existingItemIndex >= 0) {
      currentItems[existingItemIndex].quantity += 1;
    } else {
      currentItems.push({
        componentId: product.id,      
        componentName: product.name,  
        unitPrice: product.price,
        quantity: 1
      });
    }

    const updatedBasket: ShoppingCart = {
      buyerId: user.username,
      items: currentItems
    };

    setBasket(updatedBasket);
    await basketService.updateBasket(updatedBasket);
  }, [basket, user]);

  const removeFromBasket = useCallback(async (productId: string) => {
    if (!user?.username || !basket) return;
    const updatedItems = basket.items.filter(item => item.componentId !== productId);
    const updatedBasket: ShoppingCart = {
      buyerId: basket.buyerId || user.username,
      items: updatedItems
    };
    setBasket(updatedBasket);
    await basketService.updateBasket(updatedBasket);
  }, [basket, user]);

  return (
    <BasketContext.Provider value={{ basket, itemCount, addToBasket, removeFromBasket, clearBasket, totalPrice, loading }}>
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (!context) throw new Error("useBasket must be used within BasketProvider");
  return context;
};

