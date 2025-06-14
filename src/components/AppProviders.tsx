
"use client";

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext'; // Example, not fully implemented yet
import { CartProvider } from '@/contexts/CartContext'; 

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    // <AuthProvider>  // AuthProvider remains commented as per previous state
      <CartProvider>
        {children}
      </CartProvider>
    // </AuthProvider>
  );
}
