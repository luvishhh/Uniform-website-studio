// This context is not used in the current simplified setup.
// Kept for potential future expansion as requested.
// For now, auth status is managed directly in Header or relevant components.
"use client";

import type { User } from '@/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockUsers } from '@/lib/mockData';

interface AuthContextType {
  currentUser: User | null;
  login: (role: 'customer' | 'admin') => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      setCurrentUser(mockUsers.find(u => u.role === 'admin') || null);
    } else {
      setCurrentUser(mockUsers.find(u => u.role === 'customer') || null);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };
  
  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
