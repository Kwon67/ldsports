'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import CartIcon from './CartIcon';
import UserAuth from './UserAuth';
import Link from 'next/link';

function Header() {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const handleScroll = (): void => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen || searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen, searchOpen]);

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Buscando por: ${searchQuery}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const menuItems: string[] = [
    'Futebol',
    'Lançamentos',
    'Seleções',
    'Europeus',
    'Brasileirão',
    'Outlet',
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 flex flex-col transition-transform duration-300 font-sans`}
      >
        <div className="bg-black text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-widest py-2 text-center font-display px-2">
          FRETE GRÁTIS PARA PIRANHAS ALAGOAS
        </div>

        <div
          className={`bg-white transition-all duration-300 border-b border-gray-200 ${scrolled ? 'py-0 shadow-sm' : 'py-0'}`}
        >
          <div className="max-w-[1440px] mx-auto h-14 sm:h-16 flex items-center justify-between relative px-3 sm:px-4 md:px-8">
            <button
              className="lg:hidden p-1.5 sm:p-2 touch-optimized hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 z-10"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Menu"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <Link
              href="/"
              className="flex items-center gap-1 group absolute left-1/2 transform -translate-x-1/2 lg:static lg:translate-x-0 lg:left-auto z-10 pointer-events-auto"
              style={{ maxWidth: 'calc(100% - 200px)' }}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black text-white flex items-center justify-center font-black text-lg sm:text-xl tracking-tighter italic transform -skew-x-12 flex-shrink-0">
                LD
              </div>
              <span className="font-bold text-lg sm:text-xl tracking-tight hidden sm:block uppercase font-display group-hover:text-gray-700 transition-colors">
                SPORTS
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
              {menuItems.map(item => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-bold uppercase tracking-widest hover:underline underline-offset-4 decoration-2 decoration-black transition-all"
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 flex-shrink-0 z-10 ml-auto">
              <button
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors touch-optimized"
                onClick={() => setSearchOpen(true)}
                aria-label="Buscar"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              <div className="hidden sm:block">
                <UserAuth />
              </div>

              <Link
                href="/favorites"
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block touch-optimized"
                aria-label="Favoritos"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </Link>

              <CartIcon />
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-60">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="absolute top-0 left-0 h-full w-[85%] max-w-xs bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-lg tracking-tighter italic transform -skew-x-12">
                  LD
                </div>
                <span className="font-bold text-lg tracking-tight uppercase font-display">
                  SPORTS
                </span>
              </div>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="flex flex-col">
                {menuItems.map(item => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="block px-6 py-4 text-lg font-bold uppercase tracking-widest hover:bg-gray-50 border-b border-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item}
                      <span className="float-right">→</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="px-6 py-4 border-t border-gray-100">
                <UserAuth />
              </div>
            </nav>
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-60 bg-white flex flex-col">
          <div className="container-custom h-20 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-1 opacity-50">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-lg tracking-tighter italic transform -skew-x-12">
                LD
              </div>
            </div>
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setSearchOpen(false)}
            >
              <span className="text-sm font-bold uppercase tracking-widest mr-2">Fechar</span>
              <svg
                className="w-6 h-6 inline-block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 container-custom flex flex-col pt-10">
            <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto relative">
              <input
                type="text"
                placeholder="O QUE VOCÊ ESTÁ PROCURANDO?"
                className="w-full text-2xl md:text-4xl font-black uppercase border-b-2 border-gray-200 py-4 pr-12 focus:outline-none focus:border-black placeholder-gray-300 bg-transparent"
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>

            <div className="mt-10 max-w-3xl mx-auto w-full">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">
                Termos Populares
              </h3>
              <div className="flex flex-wrap gap-3">
                {['Flamengo', 'Real Madrid', 'Brasil', 'Lançamentos', 'Outlet'].map(term => (
                  <button
                    key={term}
                    className="px-4 py-2 bg-gray-100 hover:bg-black hover:text-white transition-colors text-sm font-bold uppercase tracking-wide rounded-sm"
                    onClick={() => {
                      setSearchQuery(term);
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
