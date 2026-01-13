'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { useFavorites } from '@/context/FavoritesContext';

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-[100px]">
        <div className="container-custom py-8">
          <div className="flex items-center gap-3 mb-8">
            <svg
              className="w-8 h-8 fill-red-500 stroke-red-500"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            <h1 className="text-3xl font-black uppercase">Meus Favoritos</h1>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="w-16 h-16 mx-auto mb-4 stroke-gray-300 fill-none"
                viewBox="0 0 24 24"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              <h2 className="text-xl font-bold mb-2">Nenhum favorito ainda</h2>
              <p className="text-gray-500 mb-6">
                Adicione produtos aos favoritos clicando no coração
              </p>
              <Link
                href="/"
                className="inline-block bg-black text-white px-6 py-3 font-bold uppercase text-sm hover:opacity-90"
              >
                Ver Produtos
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">{favorites.length} produto(s) salvo(s)</p>
              <ProductGrid products={favorites} />
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
