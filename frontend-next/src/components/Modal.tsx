'use client';

import { useEffect, ReactNode, MouseEvent } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>): void {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-100"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md bg-white h-full shadow-2xl transform transition-transform duration-300 flex flex-col">
        <header className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-black uppercase tracking-tighter">{title}</h2>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={onClose}
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
        </header>
        <div className="flex-1 overflow-hidden p-6 text-sm">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
