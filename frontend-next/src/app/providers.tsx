'use client';

import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { UIProvider } from '@/context/UIContext';
import { useDeviceOptimization } from '@/hooks/useDeviceOptimization';
import { useTouchOptimization } from '@/hooks/useTouchOptimization';
import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from 'next-auth/react';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
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
    <SessionProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <UIProvider>
              <OptimizationWrapper>{children}</OptimizationWrapper>
              <FloatingWhatsApp />
              <Analytics />
            </UIProvider>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

