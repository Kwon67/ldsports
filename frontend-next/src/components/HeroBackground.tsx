'use client';
import { useState, useEffect, useRef } from 'react';
import { getApiUrl } from '@/config/api';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1522778119026-d647f0596c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=75';

// Preload image utility
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

export default function HeroBackground() {
  const [heroImages, setHeroImages] = useState<string[]>([DEFAULT_IMAGE]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [imageReady, setImageReady] = useState<boolean>(true); // Start as true to show default immediately
  const loadedImagesRef = useRef<Set<string>>(new Set([DEFAULT_IMAGE])); // Default is "loaded"
  const previousImagesRef = useRef<string[]>([DEFAULT_IMAGE]);

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
          // Check if images actually changed
          const prevSet = new Set(previousImagesRef.current);
          const hasNewImages = newImages.some(img => !prevSet.has(img)) || 
                               newImages.length !== previousImagesRef.current.length;
          
          if (hasNewImages) {
            // Preload new images in background
            const imagesToPreload = newImages.filter(img => !loadedImagesRef.current.has(img));
            
            if (imagesToPreload.length > 0) {
              // Show loading only if there are new images to preload
              setImageReady(false);
              
              await Promise.all(
                imagesToPreload.map(async (img) => {
                  try {
                    await preloadImage(img);
                    loadedImagesRef.current.add(img);
                  } catch (e) {
                    console.warn('Failed to preload image:', img, e);
                    // Still add to set to avoid retrying endlessly
                    loadedImagesRef.current.add(img);
                  }
                })
              );
            }
            
            if (isMounted) {
              previousImagesRef.current = newImages;
              setHeroImages(newImages);
              setImageReady(true);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
      }
    };
    
    fetchSettings();
    const interval = setInterval(fetchSettings, 1500);
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
      {heroImages.map((img, index) => (
        <div
          key={img}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
          style={{
            backgroundImage: `url(${img})`,
            opacity: index === currentIndex && imageReady ? 1 : 0,
            zIndex: index === currentIndex ? 1 : 0,
          }}
        ></div>
      ))}
    </>
  );
}
