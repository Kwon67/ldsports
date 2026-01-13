'use client';

import { useState, useEffect } from 'react';

interface DeviceInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  pixelRatio: number;
  screenWidth: number;
  screenHeight: number;
}

export const useDeviceOptimization = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isIOS: false,
    isAndroid: false,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    pixelRatio: 1,
    screenWidth: 0,
    screenHeight: 0,
  });

  useEffect(() => {
    const detectDevice = (): void => {
      const userAgent = navigator.userAgent.toLowerCase();
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const pixelRatio = window.devicePixelRatio || 1;

      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      const isAndroid = /android/.test(userAgent);
      const isMobile = screenWidth < 768;
      const isTablet = screenWidth >= 768 && screenWidth < 1024;
      const isDesktop = screenWidth >= 1024;

      setDeviceInfo({
        isIOS,
        isAndroid,
        isMobile,
        isTablet,
        isDesktop,
        pixelRatio,
        screenWidth,
        screenHeight,
      });

      // Adicionar classes CSS específicas do dispositivo
      document.documentElement.classList.remove('ios', 'android', 'mobile', 'tablet', 'desktop');
      if (isIOS) document.documentElement.classList.add('ios');
      if (isAndroid) document.documentElement.classList.add('android');
      if (isMobile) document.documentElement.classList.add('mobile');
      if (isTablet) document.documentElement.classList.add('tablet');
      if (isDesktop) document.documentElement.classList.add('desktop');
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    window.addEventListener('orientationchange', detectDevice);

    return () => {
      window.removeEventListener('resize', detectDevice);
      window.removeEventListener('orientationchange', detectDevice);
    };
  }, []);

  return deviceInfo;
};
