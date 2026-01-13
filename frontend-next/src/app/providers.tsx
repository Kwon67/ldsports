'use client';

import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { useDeviceOptimization } from '@/hooks/useDeviceOptimization';
import { useTouchOptimization } from '@/hooks/useTouchOptimization';
import { Analytics } from '@vercel/analytics/react';
import type { ReactNode } from 'react';

interface OptimizationWrapperProps {
  children: ReactNode;
}

function OptimizationWrapper({ children }: OptimizationWrapperProps) {
  useDeviceOptimization();
  useTouchOptimization();
  return <>{children}</>;
}

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <OptimizationWrapper>{children}</OptimizationWrapper>
          <Analytics />
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

