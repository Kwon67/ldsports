'use client';

import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

function CartIcon() {
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      href="/cart"
      className="p-2 hover:bg-gray-100 rounded-full transition-colors relative touch-optimized flex items-center justify-center"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>

      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key="cart-count"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center px-1"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

export default CartIcon;
