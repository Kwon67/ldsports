'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPull?: number;
}

interface UsePullToRefreshReturn {
  pullDistance: number;
  isRefreshing: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  maxPull = 120,
}: UsePullToRefreshOptions): UsePullToRefreshReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const isPulling = useRef(false);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      // Only enable when scrolled to top
      if (window.scrollY === 0 && !isRefreshing) {
        startY.current = e.touches[0].clientY;
        isPulling.current = true;
      }
    },
    [isRefreshing]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isPulling.current || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;

      if (diff > 0 && window.scrollY === 0) {
        // Apply resistance
        const resistance = 0.5;
        const newPull = Math.min(diff * resistance, maxPull);
        setPullDistance(newPull);

        // Prevent default scroll when pulling
        if (newPull > 10) {
          e.preventDefault();
        }
      }
    },
    [isRefreshing, maxPull]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current) return;

    isPulling.current = false;

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(threshold);

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  useEffect(() => {
    const container = containerRef.current || document;

    container.addEventListener('touchstart', handleTouchStart as EventListener, { passive: true });
    container.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false });
    container.addEventListener('touchend', handleTouchEnd as EventListener, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart as EventListener);
      container.removeEventListener('touchmove', handleTouchMove as EventListener);
      container.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { pullDistance, isRefreshing, containerRef };
}
