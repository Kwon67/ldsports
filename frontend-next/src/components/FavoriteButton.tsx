'use client';

import { useFavorites } from '@/context/FavoritesContext';
import type { Product } from '@/types';

interface FavoriteButtonProps {
  product: Product;
  size?: 'sm' | 'md';
  className?: string;
}

export default function FavoriteButton({
  product,
  size = 'md',
  className = '',
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(product.id);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
  };

  return (
    <button
      onClick={e => {
        e.stopPropagation();
        toggleFavorite(product);
      }}
      className={`${sizeClasses[size]} rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform ${className}`}
      aria-label={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <svg
        className={`w-5 h-5 transition-colors ${active ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-gray-600'}`}
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}
