
"use client";

import type { CartItem, Product } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, newQuantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load cart from localStorage on initial client-side mount
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem('unishop_cartItems');
      if (localData) {
        try {
          const parsedData = JSON.parse(localData);
          if (Array.isArray(parsedData)) { // Basic validation
            setCartItems(parsedData);
          }
        } catch (error) {
          console.error("Error parsing cart items from localStorage", error);
          localStorage.removeItem('unishop_cartItems'); // Clear corrupted data
        }
      }
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    if (typeof window !== 'undefined') {
      localStorage.setItem('unishop_cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number, size?: string, color?: string) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.productId === product.id && item.size === size && item.color === color
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        return [...prevItems, {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          imageUrl: product.imageUrl,
          size,
          color,
          'data-ai-hint': product['data-ai-hint'],
        }];
      }
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} (Qty: ${quantity}) has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    setCartItems(prevItems => prevItems.filter(item =>
      !(item.productId === productId && item.size === size && item.color === color)
    ));
    toast({
      title: "Item Removed",
      description: "The item has been removed from your cart.",
      variant: "destructive"
    });
  };

  const updateQuantity = (productId: string, newQuantity: number, size?: string, color?: string) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId && item.size === size && item.color === color
          ? { ...item, quantity: Math.max(0, newQuantity) } // Ensure quantity doesn't go below 0
          : item
      ).filter(item => item.quantity > 0) // Remove if quantity is 0
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
