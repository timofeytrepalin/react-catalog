import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { CartItem, Color, Product, Size } from '../types';

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, color: Color, size: Size) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const CART_STORAGE_KEY = 'mini-catalog-cart';

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Unable to load cart from localStorage', error);
    }

    return [];
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Unable to save cart to localStorage', error);
    }
  }, [items]);

  const addItem = (product: Product, color: Color, size: Size) => {
    const key = `${product.id}:${color.id}:${size.id}`;

    setItems((previousItems) => {
      const existingItem = previousItems.find((item) => item.key === key);

      if (existingItem) {
        return previousItems.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [
        ...previousItems,
        {
          key,
          productId: product.id,
          productName: product.name,
          brand: product.brand,
          colorName: color.name,
          sizeName: size.name,
          price: Number(color.price),
          image: color.images[0] || '/images/1/black_front.png',
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (key: string, quantity: number) => {
    setItems((previousItems) =>
      previousItems
        .map((item) => (item.key === key ? { ...item, quantity: Math.max(1, quantity) } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (key: string) => {
    setItems((previousItems) => previousItems.filter((item) => item.key !== key));
  };

  const clearCart = () => {
    setItems([]);
  };

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
}
