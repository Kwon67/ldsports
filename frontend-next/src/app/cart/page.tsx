'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { SyntheticEvent } from 'react';

export default function CartPage() {
  const { items, total, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  const handleImageError = (e: SyntheticEvent<HTMLImageElement>): void => {
    const target = e.currentTarget;
    target.onerror = null;
    target.src = 'https://placehold.co/400x400/png?text=IMG';
    target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
    target.className = 'w-full h-full object-cover opacity-50';
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 font-display">
            Seu Carrinho Está Vazio
          </h1>
          <p className="text-gray-500 mb-8 text-lg">
            Parece que você ainda não escolheu seu novo manto.
          </p>
          <Link
            href="/"
            className="inline-block bg-black text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            Começar a Comprar
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-white">
      <div className="container-custom">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12 font-display"
        >
          Seu Carrinho
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-4 mb-4">
              <div className="col-span-6">Produto</div>
              <div className="col-span-2 text-center">Quantidade</div>
              <div className="col-span-2 text-center">Preço</div>
              <div className="col-span-2 text-center">Total</div>
            </div>

            {items.map((item, index) => (
              <motion.div
                key={`${item.id}-${item.size}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                layout
                className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-gray-100 pb-8 relative group"
              >
                {/* Mobile remove button - positioned at top right of card */}
                <button
                  onClick={() => removeFromCart(item.id, item.size)}
                  className="absolute -top-2 -right-2 md:hidden w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 z-10"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="col-span-6 flex gap-4 items-center">
                  {/* Image */}
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover mix-blend-multiply"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-lg md:text-xl uppercase leading-tight mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium">
                      Tamanho: <span className="text-black">{item.size || 'Único'}</span>
                    </p>
                    {/* Desktop remove button */}
                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="hidden md:flex items-center gap-2 text-xs font-bold uppercase bg-red-50 text-red-600 hover:bg-red-500 hover:text-white px-3 py-2 rounded-full mt-4 transition-all"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Remover
                    </button>
                  </div>
                </div>

                <div className="col-span-6 md:col-span-6 grid grid-cols-3 md:grid-cols-3 gap-4 items-center">
                  <div className="flex justify-start md:justify-center">
                    <div className="flex items-center border border-gray-200">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))
                        }
                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-gray-100 transition"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-gray-500 font-medium text-center hidden md:block">
                    R$ {(item.price || 0).toFixed(2)}
                  </div>

                  <div className="text-right md:text-center font-bold text-lg">
                    R$ {((item.price || 0) * item.quantity).toFixed(2)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-gray-50 p-8 rounded-lg sticky top-24">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 font-display">
                Resumo do Pedido
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-black">R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span className="text-green-600 font-bold uppercase text-xs tracking-wider bg-green-100 px-2 py-0.5 rounded">
                    Grátis
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg uppercase">Total</span>
                  <span className="text-3xl font-black tracking-tight">R$ {total.toFixed(2)}</span>
                </div>
                <p className="text-right text-gray-400 text-xs mt-2">ou em até 12x sem juros</p>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-black text-white py-5 font-bold uppercase tracking-widest text-lg hover:bg-gray-900 transition-transform active:scale-95 flex items-center justify-center gap-2 group"
              >
                Finalizar Compra
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>

              <Link
                href="/"
                className="block text-center mt-6 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black hover:underline underline-offset-4"
              >
                Continuar Comprando
              </Link>

              <div className="mt-8 pt-8 border-t border-gray-200 grid grid-cols-3 gap-4 opacity-50 grayscale">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
