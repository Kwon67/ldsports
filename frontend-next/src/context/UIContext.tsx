'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
const UIContext = createContext<{ mobileMenuOpen: boolean; setMobileMenuOpen: (v: boolean) => void } | undefined>(undefined);
export function UIProvider({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return <UIContext.Provider value={{ mobileMenuOpen, setMobileMenuOpen }}>{children}</UIContext.Provider>;
}
export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
