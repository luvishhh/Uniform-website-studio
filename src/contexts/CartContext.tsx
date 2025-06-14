
"use client";

import type { CartItem, Product, User } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

const GUEST_CART_STORAGE_KEY = 'unishop_guest_cartItems';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, newQuantity: number, size?: string, color?: string) => void;
  clearCart: (isLogout?: boolean) => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const getStoredUserId = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('unishop_user_id');
    }
    return null;
  }, []);

  const fetchUserCart = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/user/${userId}`);
      if (res.ok) {
        const userData: User = await res.json();
        if (userData && userData.cart) {
          setCartItems(userData.cart);
        } else {
          setCartItems([]); // User exists but no cart, or malformed
        }
      } else {
        setCartItems([]); // Error fetching, default to empty
        console.error("Failed to fetch user cart", await res.text());
      }
    } catch (error) {
      console.error("Error fetching user cart:", error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadGuestCart = useCallback(() => {
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem(GUEST_CART_STORAGE_KEY);
      if (localData) {
        try {
          const parsedData = JSON.parse(localData);
          if (Array.isArray(parsedData)) {
            setCartItems(parsedData);
          }
        } catch (error) {
          console.error("Error parsing guest cart:", error);
          localStorage.removeItem(GUEST_CART_STORAGE_KEY);
        }
      } else {
        setCartItems([]);
      }
    }
    setIsLoading(false);
  }, []);

  const saveUserCart = useCallback(async (userId: string, itemsToSave: CartItem[]) => {
    try {
      await fetch(`/api/user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: itemsToSave }),
      });
    } catch (error) {
      console.error("Error saving user cart:", error);
      toast({ title: "Cart Sync Error", description: "Could not save your cart to the server.", variant: "destructive"});
    }
  }, [toast]);

  const saveGuestCart = useCallback((itemsToSave: CartItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(itemsToSave));
    }
  }, []);

  // Initial load and reaction to user login/logout
  useEffect(() => {
    const userId = getStoredUserId();
    setCurrentUserId(userId);

    if (userId) {
      fetchUserCart(userId);
    } else {
      loadGuestCart();
    }

    const handleAuthChange = () => {
      const newUserId = getStoredUserId();
      setCurrentUserId(newUserId);
      if (newUserId) {
        // User logged in
        let guestCart: CartItem[] = [];
        const localGuestData = localStorage.getItem(GUEST_CART_STORAGE_KEY);
        if (localGuestData) {
          try { guestCart = JSON.parse(localGuestData); } catch { /* ignore */ }
        }
        
        fetchUserCart(newUserId).then(async () => {
            // After user's cart is fetched, check if guest cart needs merging
            const userCartRes = await fetch(`/api/user/${newUserId}`);
            if (userCartRes.ok) {
                const userData: User = await userCartRes.json();
                const backendUserCart = userData.cart || [];
                if (guestCart.length > 0 && backendUserCart.length === 0) {
                    // User cart empty, guest cart has items: transfer guest cart to user
                    setCartItems(guestCart); 
                    await saveUserCart(newUserId, guestCart); // Save merged cart to backend
                    localStorage.removeItem(GUEST_CART_STORAGE_KEY);
                } else {
                    // User cart has items or both are empty, user cart takes precedence
                    setCartItems(backendUserCart);
                }
            }
        });

      } else {
        // User logged out, switch to guest cart
        loadGuestCart();
      }
    };

    if (typeof window !== "undefined") {
        window.addEventListener('authChange', handleAuthChange);
    }
    return () => {
        if (typeof window !== "undefined") {
            window.removeEventListener('authChange', handleAuthChange);
        }
    };
  }, [getStoredUserId, fetchUserCart, loadGuestCart, saveUserCart]);


  // Effect to save cart items when they change
  useEffect(() => {
    if (!isLoading) { // Only save if not in initial loading state
      if (currentUserId) {
        saveUserCart(currentUserId, cartItems);
      } else {
        saveGuestCart(cartItems);
      }
    }
  }, [cartItems, currentUserId, isLoading, saveUserCart, saveGuestCart]);


  const addToCart = (product: Product, quantity: number, size?: string, color?: string) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.productId === product.id && item.size === size && item.color === color
      );

      let updatedItems;
      if (existingItemIndex > -1) {
        updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
      } else {
        updatedItems = [...prevItems, {
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
      return updatedItems;
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} (Qty: ${quantity}) has been added.`,
    });
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item =>
        !(item.productId === productId && item.size === size && item.color === color)
      );
      return updatedItems;
    });
    toast({
      title: "Item Removed",
      description: "The item has been removed from your cart.",
      variant: "destructive"
    });
  };

  const updateQuantity = (productId: string, newQuantity: number, size?: string, color?: string) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.productId === productId && item.size === size && item.color === color
          ? { ...item, quantity: Math.max(0, newQuantity) }
          : item
      ).filter(item => item.quantity > 0);
      return updatedItems;
    });
  };

  const clearCart = (isLogout: boolean = false) => {
    setCartItems([]);
    if (!currentUserId && !isLogout) { // Only clear guest cart if not logging out (logout handles user cart persistence)
      saveGuestCart([]);
    }
    // For logged-in users, cart is cleared by saving empty array.
    // For logout, `handleAuthChange` will load the (empty or new) guest cart.
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getItemCount, isLoading }}>
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
