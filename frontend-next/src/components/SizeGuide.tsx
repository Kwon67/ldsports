'use client';

import { useEffect, useCallback, useSyncExternalStore } from 'react';

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const sizeData = [
  { size: 'P', chest: '96-100', length: '70', shoulder: '44' },
  { size: 'M', chest: '100-104', length: '72', shoulder: '46' },
  { size: 'G', chest: '104-108', length: '74', shoulder: '48' },
  { size: 'GG', chest: '108-112', length: '76', shoulder: '50' },
  { size: 'XG', chest: '112-116', length: '78', shoulder: '52' },
];

// SSR-safe mounted check using useSyncExternalStore
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function SizeGuide({ isOpen, onClose }: SizeGuideProps) {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl max-w-md w-full max-h-[90vh] overflow-auto shadow-2xl animate-fade-in-scale">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="text-lg font-bold uppercase">Guia de Tamanhos</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Medidas em centímetros. Para melhor ajuste, meça uma camisa que você já possui.
          </p>

          {/* Size Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="px-3 py-2 text-left font-bold">Tamanho</th>
                  <th className="px-3 py-2 text-center font-bold">Peito</th>
                  <th className="px-3 py-2 text-center font-bold">Comp.</th>
                  <th className="px-3 py-2 text-center font-bold">Ombro</th>
                </tr>
              </thead>
              <tbody>
                {sizeData.map((row, i) => (
                  <tr
                    key={row.size}
                    className={i % 2 === 0 ? '' : 'bg-gray-50 dark:bg-gray-800/50'}
                  >
                    <td className="px-3 py-2 font-bold">{row.size}</td>
                    <td className="px-3 py-2 text-center">{row.chest}</td>
                    <td className="px-3 py-2 text-center">{row.length}</td>
                    <td className="px-3 py-2 text-center">{row.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* How to Measure */}
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Como medir
            </h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>
                <strong>Peito:</strong> Circunferência na parte mais larga
              </li>
              <li>
                <strong>Comprimento:</strong> Do ombro até a barra
              </li>
              <li>
                <strong>Ombro:</strong> De uma costura a outra
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
