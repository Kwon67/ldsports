'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getApiUrl } from '@/config/api';

const DEFAULT_IMAGE = '/hero-bg.jpg';

async function preloadImage(src: string): Promise<void> {
  if (typeof window === 'undefined') return;
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); 
    img.src = src;
  });
}

export default function HeroBackground() {
  const [heroImages, setHeroImages] = useState<string[]>([DEFAULT_IMAGE]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [hasLoadedNewParams, setHasLoadedNewParams] = useState(false);

  // Fetch from API
  useEffect(() => {
    let isMounted = true;
    
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/admin/settings`);
        const data = await response.json();
        
        let newImages: string[] = [];
        
        if (data.heroImages && Array.isArray(data.heroImages) && data.heroImages.length > 0) {
          newImages = data.heroImages;
        } else if (data.heroImage) {
          newImages = [data.heroImage];
        }
        
        if (newImages.length > 0 && isMounted) {
          // Check if we need to update
          // Simplified check: just checking if the first image matches what we expect
          // Ideally we deep contrast, but this is enough for the "flash" fix scenario
          const currentRealImages = heroImages.filter(img => img !== DEFAULT_IMAGE);
          const isDifferent = JSON.stringify(newImages) !== JSON.stringify(currentRealImages);
          
          if (isDifferent) {
            // 1. Preload new image (first one)
            if (newImages[0] !== DEFAULT_IMAGE) {
              await preloadImage(newImages[0]);
            }
            
            if (!isMounted) return;

            // 2. Handle State Update
            // If this is the INITIAL load (we only have default currently), do the seamless transition dance
            if (!hasLoadedNewParams && heroImages.length === 1 && heroImages[0] === DEFAULT_IMAGE) {
              
              // A. Append new images to array: [Default, New1, New2...]
              setHeroImages([DEFAULT_IMAGE, ...newImages]);
              setHasLoadedNewParams(true);
              
              // B. Wait for render, then switch index to 1 (triggering CSS fade)
              setTimeout(() => {
                if (isMounted) setCurrentIndex(1);
              }, 100);

              // C. After transition completes (1s), clean up the array
              setTimeout(() => {
                if (isMounted) {
                  // Swap to clean [New1, New2...] list
                  // And visual index becomes 0 (which corresponds to New1, same as Index 1 in mixed list)
                  // Seamless swap!
                  setHeroImages(newImages);
                  setCurrentIndex(0); 
                }
              }, 1200);

            } else {
              // Standard update for subsequent changes (admin updates)
              // Just swap directly as user is not on "first load" delicate state
               setHeroImages(newImages);
               setHasLoadedNewParams(true);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
      }
    };
    
    fetchSettings();
    const interval = setInterval(fetchSettings, 5000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [heroImages, hasLoadedNewParams]); 

  // Auto Rotate images
  useEffect(() => {
    // Only rotate if we have valid multiple images
    if (heroImages.length <= 1) return;
    
    // Prevent rotation during the initial transition phase
    // (If array contains DEFAULT and we are in the "loaded" phase, we are transitioning)
    if (heroImages.includes(DEFAULT_IMAGE) && hasLoadedNewParams) return; 

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length, hasLoadedNewParams, heroImages]);

  return (
    <>
      {/* Static background as base immutable layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${DEFAULT_IMAGE})` }}
      />
      
      {heroImages.map((img, index) => {
        const isCurrent = index === currentIndex;
        const isCloudinary = img.includes('cloudinary');
        
        return (
          <div
            key={`${img}-${index}`}
            className={`absolute inset-0 transition-opacity duration-1000 ${isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {isCloudinary ? (
              <Image
                src={img}
                alt="Hero"
                fill
                priority={index === 0 || index === 1} // Prioritize active images
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <img
                src={img}
                alt="Hero"
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
            )}
          </div>
        );
      })}
    </>
  );
}
