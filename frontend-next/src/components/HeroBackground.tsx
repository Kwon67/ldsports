'use client';
import { useState, useEffect } from 'react';
import { getApiUrl } from '@/config/api';

export default function HeroBackground() {
  const [heroImages, setHeroImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1522778119026-d647f0596c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=75',
  ]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/admin/settings?t=${Date.now()}`);
        const data = await response.json();
        if (data.heroImages && Array.isArray(data.heroImages) && data.heroImages.length > 0) {
          setHeroImages(data.heroImages);
        } else if (data.heroImage) {
          setHeroImages([data.heroImage]);
        }
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
      }
    };
    fetchSettings();
    const interval = setInterval(fetchSettings, 2000);
    return () => clearInterval(interval);
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
      {heroImages.map((img, index) => (
        <div
          key={img}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${img})`,
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 1 : 0,
          }}
        ></div>
      ))}
    </>
  );
}
