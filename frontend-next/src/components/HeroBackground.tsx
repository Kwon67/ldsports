'use client';
import { useState, useEffect } from 'react';
import { getApiUrl } from '@/config/api';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1522778119026-d647f0596c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=75';

export default function HeroBackground() {
  const [heroImages, setHeroImages] = useState<string[]>([DEFAULT_IMAGE]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/admin/settings?t=${Date.now()}`);
        const data = await response.json();
        
        let newImages: string[] = [];
        
        if (data.heroImages && Array.isArray(data.heroImages) && data.heroImages.length > 0) {
          newImages = data.heroImages;
        } else if (data.heroImage) {
          newImages = [data.heroImage];
        }
        
        if (newImages.length > 0 && isMounted) {
          setHeroImages(newImages);
        }
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
      }
    };
    
    fetchSettings();
    const interval = setInterval(fetchSettings, 2000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <>
      {/* Dark fallback while loading */}
      <div className="absolute inset-0 bg-linear-to-br from-gray-900 to-black" />
      
      {heroImages.map((img, index) => {
        const isCurrent = index === currentIndex;
        
        return (
          <img
            key={img}
            src={img}
            alt=""
            fetchPriority={index === 0 ? 'high' : 'low'}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isCurrent ? 'opacity-100 z-1' : 'opacity-0 z-0'}`}
          />
        );
      })}
    </>
  );
}
