'use client';

import { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { getApiUrl } from '@/config/api';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { signIn, useSession } from 'next-auth/react';
import type { Product } from '@/types';

interface TeamButton {
  name: string;
  color: string;
  activeColor: string;
}

export default function HomePage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const loadProducts = useCallback(async (retryCount = 0): Promise<void> => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      const fullUrl = `${apiUrl}/products`;
      console.log(`[loadProducts] Tentativa ${retryCount + 1} - URL: ${fullUrl}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(fullUrl, {
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      const data: Product[] = await response.json();
      const normalizedProducts = data.map(product => ({
        ...product,
        id: product._id || product.id,
      }));
      setProducts(normalizedProducts);
      setError(null);
    } catch (err) {
      const apiUrl = getApiUrl();
      console.error(`[loadProducts] Erro na URL ${apiUrl}/products:`, err);
      if (retryCount < 2 && (err instanceof Error && (err.name === 'AbortError' || err.message.includes('fetch') || err.message.includes('Failed')))) {
        console.log(`[loadProducts] Retry em 2s... (tentativa ${retryCount + 1}/2)`);
        setTimeout(() => loadProducts(retryCount + 1), 2000);
        return;
      }
      if (err instanceof Error && err.name === 'AbortError') {
        setError(`Timeout: Servidor não respondeu em 8s. URL: ${apiUrl}/products`);
      } else if (err instanceof TypeError && (err.message.includes('fetch') || err.message.includes('Failed'))) {
        setError(`Erro de conexão: ${apiUrl}/products. Verifique se o backend está rodando.`);
      } else {
        setError(`Erro: ${err instanceof Error ? err.message : 'Desconhecido'}`);
      }
    } finally {
      if (retryCount === 0) setLoading(false);
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
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
              clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
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

        <div id="camisas" className="container-custom py-8 scroll-mt-32 relative">
          {/* Dots Pattern with Curve */}
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)',
              backgroundSize: '32px 32px',
              clipPath: 'polygon(0 0, 100% 10%, 100% 90%, 0 100%)',
            }}
          ></div>
          <div className="relative z-10 flex items-center justify-between mb-8">
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
              <button
                onClick={() => loadProducts(0)}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-bold uppercase"
              >
                Tentar Novamente
              </button>
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
        <section className="relative py-20 mt-16 overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>

          {/* Animated Dots Pattern */}
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)',
              backgroundSize: '28px 28px',
              clipPath: 'polygon(0 15%, 100% 0, 100% 85%, 0 100%)',
            }}
          ></div>

          {/* Gradient Orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-700/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

          <div className="container-custom relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-sm border border-white/40 rounded-full px-4 py-2 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="text-white text-sm font-bold uppercase tracking-wider drop-shadow-md">
                  Membros VIP
                </span>
              </div>

              {/* Title */}
              <h3 className="text-4xl md:text-6xl font-black uppercase mb-4 text-white tracking-tight drop-shadow-lg">
                Entre para o
                <span className="block text-white drop-shadow-lg">
                  Clube VIP
                </span>
              </h3>

              {/* Description */}
              <p className="text-white text-lg mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                {session
                  ? `Olá, ${session.user?.name?.split(' ')[0]}! 🎉 Você já é membro VIP. Aproveite ofertas exclusivas e descontos especiais.`
                  : 'Faça login com sua conta Google e tenha acesso a ofertas exclusivas, lançamentos antecipados e descontos especiais.'}
              </p>

              {/* Benefits */}
              {!session && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
                  <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                    <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold text-sm drop-shadow">Frete Grátis</p>
                      <p className="text-white/80 drop-shadow text-xs">Em compras acima de R$200</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                    <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold text-sm drop-shadow">Descontos Exclusivos</p>
                      <p className="text-white/80 drop-shadow text-xs">Até 30% OFF</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                    <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold text-sm drop-shadow">Acesso Antecipado</p>
                      <p className="text-white/80 drop-shadow text-xs">Lançamentos exclusivos</p>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {session ? (
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-white rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                    <div className="relative flex items-center gap-4 bg-white px-8 py-5 rounded-2xl shadow-xl">
                      {session.user?.image && (
                        <img
                          src={session.user.image}
                          alt={session.user.name || 'Usuário'}
                          className="w-14 h-14 rounded-full ring-4 ring-white/30"
                        />
                      )}
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <p className="font-black text-black text-lg">{session.user?.name}</p>
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600 font-semibold">Membro VIP Ativo</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => signIn('google')}
                    className="group relative inline-flex items-center justify-center"
                  >
                    <div className="absolute -inset-1 bg-white rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                    <div className="relative flex items-center gap-4 bg-white px-8 py-5 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300">
                      <svg className="w-7 h-7" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <div className="text-left">
                        <p className="font-black text-gray-900 text-lg">Entrar com Google</p>
                        <p className="text-xs text-gray-600">Acesso gratuito e instantâneo</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                )}
              </div>

              {/* Trust Badge */}
              {!session && (
                <p className="text-white drop-shadow-md text-sm mt-6 flex items-center justify-center gap-2 font-medium">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Login 100% seguro via Google OAuth
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
