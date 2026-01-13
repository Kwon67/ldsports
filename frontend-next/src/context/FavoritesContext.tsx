'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import type { Product } from '@/types';

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (id: string | number) => void;
  isFavorite: (id: string | number) => boolean;
  toggleFavorite: (product: Product) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

function getInitialFavorites(): Product[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('ldsports-favorites');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>(getInitialFavorites);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('ldsports-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = useCallback((product: Product) => {
    setFavorites(prev => {
      if (prev.some(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromFavorites = useCallback((id: string | number) => {
    setFavorites(prev => prev.filter(p => p.id !== id));
  }, []);

  const isFavorite = useCallback(
    (id: string | number) => favorites.some(p => p.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (product: Product) => {
      if (isFavorite(product.id)) {
        removeFromFavorites(product.id);
      } else {
        addToFavorites(product);
      }
    },
    [isFavorite, removeFromFavorites, addToFavorites]
  );

  return (
    <FavoritesContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

