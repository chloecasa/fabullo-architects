"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Navigation from '@/components/ui/Navigation'; // We will convert this next

// 1. Define the "Shape" of our state
interface MenuContextType {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

// 2. Create the Context with the type
const MenuContext = createContext<MenuContextType | undefined>(undefined);

// 3. Custom Hook for other components (like Header) to use
export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};

export default function MenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MenuContext.Provider value={{ isOpen, setIsOpen }}>
      {/* 
        This is the "Global Overlay". 
        It stays here so it can appear on any page without re-coding it.
      */}
      <Navigation isOpen={isOpen} onClose={() => setIsOpen(false)} />
      
      {/* This renders the rest of your website */}
      {children}
    </MenuContext.Provider>
  );
}
