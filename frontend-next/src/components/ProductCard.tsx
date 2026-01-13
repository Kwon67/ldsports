'use client';

import { useState, SyntheticEvent, useEffect, useCallback, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '@/context/CartContext';
import FavoriteButton from './FavoriteButton';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const allImages = product.images?.length ? product.images.map(img => img.url) : [product.image];

  const hasDiscount = (product.discountPercentage || 0) > 0;
  const discountPrice = hasDiscount
    ? product.price * (1 - product.discountPercentage! / 100)
    : product.price;

  const handleAdd = useCallback(() => {
    addToCart({ ...product, size: selectedSize });
    setIsModalOpen(false);
  }, [addToCart, product, selectedSize]);

  const handleImageError = (e: SyntheticEvent<HTMLImageElement>): void => {
    const target = e.currentTarget;
    target.onerror = null;
    target.src = 'https://placehold.co/600x600/png?text=Sem+Imagem';
  };

  const openModal = () => {
    setIsModalOpen(true);
    setCurrentImageIndex(0);
  };
  const closeModal = () => setIsModalOpen(false);

  const nextImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    if (isModalOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isModalOpen, nextImage, prevImage]);

  const ModalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        background: 'white',
        zIndex: 9999999, // Super high z-index
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Close button - Fixed always visible */}
      <button
        onClick={closeModal}
        style={{
          position: 'fixed',
          top: '32px',
          right: '16px',
          width: '40px',
          height: '40px',
          background: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: 10000000,
        }}
      >
        <svg width="20" height="20" fill="none" stroke="black" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Image container - reduced height */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '28vh',
          background: '#f5f5f5',
          flexShrink: 0,
          cursor: 'zoom-in',
        }}
        onClick={() => setIsZoomed(true)}
      >
        <img
          src={allImages[currentImageIndex]}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={handleImageError}
        />

        {allImages.length > 1 && (
          <>
            <button
              onClick={e => {
                e.stopPropagation();
                prevImage();
              }}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '40px',
                height: '40px',
                background: 'white',
                borderRadius: '50%',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                nextImage();
              }}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '40px',
                height: '40px',
                background: 'white',
                borderRadius: '50%',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Counter - Always visible */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            color: 'white',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            zIndex: 10,
            pointerEvents: 'none',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ opacity: 0.8 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
            />
          </svg>
          {currentImageIndex + 1} / {allImages.length}
        </div>
      </div>

      {/* Info - scrollable part */}
      <div
        style={{
          padding: '24px',
          flex: 1,
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            background: 'black',
            color: 'white',
            fontSize: '10px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            padding: '4px 8px',
            marginBottom: '12px',
            alignSelf: 'flex-start',
          }}
        >
          Lançamento
        </div>

        {hasDiscount && (
          <div
            style={{
              display: 'inline-block',
              background: '#ef4444',
              color: 'white',
              fontSize: '10px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              padding: '4px 8px',
              marginBottom: '12px',
              marginLeft: '8px',
              alignSelf: 'flex-start',
            }}
          >
            {product.discountPercentage}% OFF
          </div>
        )}

        <h2
          style={{
            fontSize: '20px',
            fontWeight: '900',
            textTransform: 'uppercase',
            marginBottom: '4px',
            lineHeight: '1.2',
            fontFamily: 'var(--font-oswald, sans-serif)',
          }}
        >
          {product.name}
        </h2>

        {product.team && (
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>{product.team}</p>
        )}

        {product.description && (
          <p style={{ color: '#444', fontSize: '12px', marginBottom: '16px', lineHeight: '1.5' }}>
            {product.description}
          </p>
        )}

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {hasDiscount ? (
              <>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#9ca3af',
                    textDecoration: 'line-through',
                    fontWeight: '500',
                  }}
                >
                  R$ {product.price.toFixed(2)}
                </p>
                <p style={{ fontSize: '28px', fontWeight: '900', color: '#ef4444' }}>
                  R$ {discountPrice.toFixed(2)}
                </p>
              </>
            ) : (
              <p style={{ fontSize: '28px', fontWeight: '900' }}>R$ {product.price.toFixed(2)}</p>
            )}
          </div>
          <p style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>
            À vista no Pix ou Dinheiro
          </p>
        </div>

        {/* Sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <p
              style={{
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              Tamanho
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    minWidth: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    border: selectedSize === size ? '2px solid black' : '1px solid #ddd',
                    background: selectedSize === size ? 'black' : 'white',
                    color: selectedSize === size ? 'white' : 'black',
                    cursor: 'pointer',
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add Button */}
        <button
          onClick={handleAdd}
          style={{
            width: '100%',
            padding: '16px',
            background: 'black',
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '24px',
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          Adicionar ao Carrinho
        </button>

        <div
          style={{
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#666',
            justifyContent: 'center',
          }}
        >
          <svg width="16" height="16" fill="none" stroke="#22c55e" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Frete grátis para Piranhas
        </div>
      </div>

      {/* Zoom Overlay */}
      {isZoomed && (
        <div
          onClick={e => {
            e.stopPropagation();
            setIsZoomed(false);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            background: 'black',
            zIndex: 10000001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.2s ease-out',
            cursor: 'zoom-out',
          }}
        >
          <button
            onClick={() => setIsZoomed(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <img
            src={allImages[currentImageIndex]}
            alt={product.name}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      )}
    </div>
  );

  return (
    <>
      <article
        className="group flex flex-col cursor-pointer relative hover-lift"
        onClick={openModal}
      >
        <div className="absolute top-2 left-2 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider z-10">
          Lançamento
        </div>

        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton product={product} size="sm" />
        </div>

        {hasDiscount && (
          <div className="absolute top-10 left-2 bg-red-500 text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider z-10">
            {product.discountPercentage}% OFF
          </div>
        )}

        <div className="relative w-full aspect-square bg-[#EBEDEE] overflow-hidden mb-3">
          <img
            src={product.images?.[0]?.url || product.image}
            alt={product.name}
            className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
            onError={handleImageError}
          />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-normal leading-tight group-hover:underline decoration-1 underline-offset-2">
            {product.name}
          </h3>
          <div className="flex flex-col">
            {hasDiscount ? (
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-gray-400 line-through">R$ {product.price.toFixed(2)}</p>
                <p className="text-sm font-bold text-red-600">R$ {discountPrice.toFixed(2)}</p>
              </div>
            ) : (
              <p className="text-sm font-medium mt-1">R$ {product.price.toFixed(2)}</p>
            )}
          </div>
        </div>
      </article>

      {/* Render Modal via Portal */}
      {isModalOpen && mounted && createPortal(ModalContent, document.body)}
    </>
  );
}

export default ProductCard;
