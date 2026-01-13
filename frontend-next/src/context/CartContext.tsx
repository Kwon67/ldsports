'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  total: number;
  addToCart: (product: Product & { size: string }) => void;
  removeFromCart: (id: string | number, size: string) => void;
  updateQuantity: (id: string | number, size: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

type CartAction =
  | { type: 'HYDRATE'; items: CartItem[] }
  | { type: 'ADD'; product: Product & { size: string } }
  | { type: 'REMOVE'; id: string | number; size: string }
  | { type: 'UPDATE_QUANTITY'; id: string | number; size: string; quantity: number }
  | { type: 'CLEAR' };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'HYDRATE':
      return action.items;
    case 'ADD': {
      const existing = state.find(
        item => item.id === action.product.id && item.size === action.product.size
      );
      if (existing) {
        return state.map(item =>
          item.id === action.product.id && item.size === action.product.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.product, quantity: 1 }];
    }
    case 'REMOVE':
      return state.filter(item => !(item.id === action.id && item.size === action.size));
    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.id === action.id && item.size === action.size
          ? { ...item, quantity: action.quantity }
          : item
      );
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }: CartProviderProps) {
  // Always start with empty array for SSR consistency
  const [items, dispatch] = useReducer(cartReducer, []);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cart');
      if (stored) {
        const parsedItems = JSON.parse(stored);
        if (Array.isArray(parsedItems) && parsedItems.length > 0) {
          dispatch({ type: 'HYDRATE', items: parsedItems });
        }
      }
    } catch (e) {
      console.error('Error loading cart:', e);
    }
  }, []);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (e) {
      console.error('Erro ao salvar carrinho:', e);
    }
  }, [items]);

  function addToCart(product: Product & { size: string }): void {
    dispatch({ type: 'ADD', product });
    showDirectToast(product);
  }

  function showDirectToast(product: Product & { size: string }): void {
    // Remove existing toast
    document.getElementById('cart-toast')?.remove();

    // Create toast HTML directly
    const toastHtml = `
      <div id="cart-toast" style="
        position: fixed;
        z-index: 2147483647;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 40px);
        max-width: 400px;
        background: #000;
        color: #fff;
        padding: 16px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        animation: toast-slide-in 0.3s ease-out;
      ">
        <style>
          @keyframes toast-slide-in {
            from { opacity: 0; transform: translate(-50%, 20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
        </style>
        <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
          ${product.image ? `<img src="${product.image}" style="width: 48px; height: 48px; border-radius: 6px; object-fit: cover; flex-shrink: 0;" />` : ''}
          <div style="min-width: 0;">
            <div style="font-weight: 600; font-size: 14px;">✓ Adicionado ao carrinho</div>
            <div style="font-size: 12px; color: #aaa; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${product.name}</div>
          </div>
        </div>
        <a href="/cart" style="
          background: #fff;
          color: #000;
          padding: 8px 14px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 12px;
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
        ">Ver Carrinho</a>
      </div>
    `;

    // Insert at the end of the HTML document
    document.documentElement.insertAdjacentHTML('beforeend', toastHtml);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      const toast = document.getElementById('cart-toast');
      if (toast) {
        toast.style.animation = 'none';
        toast.style.transition = 'opacity 0.3s, transform 0.3s';
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 20px)';
        setTimeout(() => toast.remove(), 300);
      }
    }, 4000);
  }

  function removeFromCart(id: string | number, size: string): void {
    dispatch({ type: 'REMOVE', id, size });
  }

  function updateQuantity(id: string | number, size: string, quantity: number): void {
    dispatch({ type: 'UPDATE_QUANTITY', id, size, quantity });
  }

  function clearCart(): void {
    dispatch({ type: 'CLEAR' });
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
