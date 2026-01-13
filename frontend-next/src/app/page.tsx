'use client';

import { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { getApiUrl } from '@/config/api';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import type { Product } from '@/types';

interface TeamButton {
  name: string;
  color: string;
  activeColor: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const loadProducts = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();

      // Timeout de 10 segundos para evitar loading infinito
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${apiUrl}/products`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Erro ao buscar produtos');
      }
      const data: Product[] = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error(err);
      if (err instanceof Error && err.name === 'AbortError') {
        setError(
          'Servidor não respondeu. Verifique sua conexão com a rede local.'
        );
      } else {
        setError('Não foi possível carregar os produtos.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const { pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: loadProducts,
    threshold: 80,
  });

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const teamButtons: TeamButton[] = [
    {
      name: 'Flamengo',
      color: 'hover:bg-red-600 hover:text-white',
      activeColor: 'bg-red-600 text-white',
    },
    {
      name: 'Palmeiras',
      color: 'hover:bg-green-600 hover:text-white',
      activeColor: 'bg-green-600 text-white',
    },
    {
      name: 'Corinthians',
      color: 'hover:bg-black hover:text-white',
      activeColor: 'bg-black text-white',
    },
    {
      name: 'São Paulo',
      color: 'hover:bg-red-500 hover:text-white',
      activeColor: 'bg-red-500 text-white',
    },
    {
      name: 'Real Madrid',
      color: 'hover:bg-blue-800 hover:text-white',
      activeColor: 'bg-blue-800 text-white',
    },
    {
      name: 'Barcelona',
      color: 'hover:bg-blue-600 hover:text-white',
      activeColor: 'bg-blue-600 text-white',
    },
    {
      name: 'PSG',
      color: 'hover:bg-blue-900 hover:text-white',
      activeColor: 'bg-blue-900 text-white',
    },
    {
      name: 'Man. City',
      color: 'hover:bg-sky-400 hover:text-white',
      activeColor: 'bg-sky-400 text-white',
    },
    {
      name: 'Liverpool',
      color: 'hover:bg-red-700 hover:text-white',
      activeColor: 'bg-red-700 text-white',
    },
    {
      name: 'Arsenal',
      color: 'hover:bg-red-600 hover:text-white',
      activeColor: 'bg-red-600 text-white',
    },
  ];

  const filteredProducts = selectedTeam
    ? products.filter(p => p.team?.toLowerCase().includes(selectedTeam.toLowerCase()))
    : products;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Pull to Refresh Indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="fixed top-[100px] left-0 right-0 flex justify-center z-40 pointer-events-none"
          style={{
            transform: `translateY(${Math.min(pullDistance, 60)}px)`,
            opacity: Math.min(pullDistance / 40, 1),
          }}
        >
          <div
            className={`bg-black text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 ${isRefreshing ? 'animate-pulse' : ''}`}
          >
            <svg
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ transform: isRefreshing ? 'none' : `rotate(${pullDistance * 3}deg)` }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="text-sm font-medium">
              {isRefreshing
                ? 'Atualizando...'
                : pullDistance >= 80
                  ? 'Solte para atualizar'
                  : 'Puxe para atualizar'}
            </span>
          </div>
        </div>
      )}

      <main className="flex-1 pt-[100px]">
        {/* Hero Section */}
        <section className="relative w-full h-[600px] bg-[#F5F5F5] flex items-center justify-center overflow-hidden mb-12">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          ></div>

          <div className="relative z-10 container-custom flex flex-col items-start justify-center h-full">
            <div className="max-w-2xl w-full">
              <span className="bg-black text-white px-3 py-1 text-xs sm:text-sm font-bold uppercase tracking-widest mb-4 inline-block animate-fade-in-up">
                Coleção 2025
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase leading-tight mb-6 tracking-tight wrap-break-word animate-fade-in-up delay-100 py-1">
                Vista a <br /> Paixão
              </h1>
              <p className="text-base sm:text-lg mb-8 max-w-lg text-gray-700 pr-4 animate-fade-in-up delay-200">
                As camisas oficiais dos maiores clubes do mundo. Qualidade premium.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto animate-fade-in-up delay-300">
                <a
                  href="#camisas"
                  className="bg-black text-white px-6 py-3 sm:px-8 sm:py-4 font-bold uppercase tracking-widest hover:opacity-80 transition-opacity flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base"
                >
                  Comprar Agora
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
                <a
                  href="#lancamentos"
                  className="bg-white border-2 border-black text-black px-6 py-3 sm:px-8 sm:py-4 font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors w-full sm:w-auto text-center text-sm sm:text-base"
                >
                  Lançamentos
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Categories */}
        <div className="container-custom mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold uppercase tracking-tight">Navegue por Times</h3>
            {selectedTeam && (
              <button
                onClick={() => setSelectedTeam(null)}
                className="text-sm text-gray-500 hover:text-black underline flex items-center gap-1"
              >
                Limpar filtro
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
            {teamButtons.map((team, index) => {
              const isActive = selectedTeam === team.name;
              return (
                <button
                  key={team.name}
                  onClick={() => {
                    setSelectedTeam(isActive ? null : team.name);
                    setTimeout(() => {
                      document
                        .getElementById('camisas')
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }}
                  style={{ animationDelay: `${500 + index * 50}ms` }}
                  className={`shrink-0 px-8 py-4 font-bold uppercase tracking-wider transition-all duration-300 snap-start border hover-lift animate-fade-in-scale ${
                    isActive
                      ? `${team.activeColor} border-transparent`
                      : `bg-gray-100 ${team.color} border-gray-200 hover:border-transparent`
                  }`}
                >
                  {team.name}
                </button>
              );
            })}
          </div>
        </div>

        <div id="camisas" className="container-custom py-8 scroll-mt-32">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black uppercase italic transform -skew-x-6">
              {selectedTeam ? `Camisas ${selectedTeam}` : 'Destaques da Semana'}
            </h2>
            <div className="flex gap-2">
              <button className="p-2 border border-gray-300 hover:border-black transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button className="p-2 border border-gray-300 hover:border-black transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
          )}

          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Erro!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          {!loading && !error && <ProductGrid products={filteredProducts} />}

          {!loading && !error && selectedTeam && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Nenhuma camisa encontrada para {selectedTeam}</p>
              <button
                onClick={() => setSelectedTeam(null)}
                className="bg-black text-white px-6 py-3 font-bold uppercase text-sm hover:opacity-90"
              >
                Ver todos os produtos
              </button>
            </div>
          )}
        </div>

        {/* Newsletter Section */}
        <section className="bg-[#EBEDEE] py-16 mt-16">
          <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-3xl font-bold uppercase mb-2">Entre para o clube</h3>
              <p className="text-gray-600">
                Cadastre-se para receber ofertas exclusivas, novidades e descontos especiais
                diretamente no seu e-mail.
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="px-4 py-3 w-full md:w-80 border border-gray-300 focus:outline-none focus:border-black"
              />
              <button className="bg-black text-white px-6 py-3 font-bold uppercase tracking-wider hover:opacity-90 flex items-center gap-2">
                Inscrever
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
