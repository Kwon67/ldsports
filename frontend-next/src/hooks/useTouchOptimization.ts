'use client';

import { useEffect } from 'react';

export const useTouchOptimization = (): void => {
  useEffect(() => {
    // Otimizações para dispositivos touch
    const handleTouchStart = (e: TouchEvent): void => {
      // Prevenir delay de 300ms no iOS
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        (target.style as unknown as Record<string, string>).webkitTapHighlightColor = 'transparent';
      }
    };

    const handleTouchMove = (e: TouchEvent): void => {
      // Prevenir scroll indesejado
      const target = e.target as HTMLElement;
      if (target.closest('.no-scroll')) {
        e.preventDefault();
      }
    };

    // Otimizações específicas por sistema
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    const bodyStyle = document.body.style as unknown as Record<string, string>;

    if (isIOS) {
      // iOS específico
      bodyStyle.webkitTouchCallout = 'none';
      bodyStyle.webkitUserSelect = 'none';
    }

    if (isAndroid) {
      // Android específico
      bodyStyle.webkitTapHighlightColor = 'transparent';
    }

    // Adicionar listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);
};
