import { useState, useEffect } from 'react';
import { AppRole } from '../types';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type DeviceOrientation = 'portrait' | 'landscape';

export interface DeviceInfo {
  deviceType: DeviceType;
  effectiveDeviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: DeviceOrientation;
  width: number;
  height: number;
  simulationMode: 'native' | 'mobile' | 'tablet' | 'desktop';
  setSimulationMode: (mode: 'native' | 'mobile' | 'tablet' | 'desktop') => void;
  isRoleAllowed: (role: AppRole) => { allowed: boolean; reason?: string };
}

export function detectNativeDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'desktop';

  const ua = navigator.userAgent || '';
  const width = window.innerWidth;
  const isTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;

  // Tablet UA checks (iPad, Android tablets)
  const isIPad = /iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroidTablet = /Android/i.test(ua) && !/Mobile/i.test(ua);

  if (isIPad || isAndroidTablet || (isTouch && width >= 768 && width <= 1180)) {
    return 'tablet';
  }

  // Mobile checks
  const isMobileUA = /iPhone|iPod|Android.*Mobile|Windows Phone|BlackBerry/i.test(ua);
  if (isMobileUA || width < 768) {
    return 'mobile';
  }

  // Desktop checks (width >= 1024 without mobile flags, or general desktop browser)
  return 'desktop';
}

export function useDeviceDetector(): DeviceInfo {
  const [nativeType, setNativeType] = useState<DeviceType>(() => detectNativeDeviceType());
  const [width, setWidth] = useState<number>(() => (typeof window !== 'undefined' ? window.innerWidth : 1200));
  const [height, setHeight] = useState<number>(() => (typeof window !== 'undefined' ? window.innerHeight : 800));
  const [orientation, setOrientation] = useState<DeviceOrientation>(() =>
    typeof window !== 'undefined' && window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  );
  const [simulationMode, setSimulationMode] = useState<'native' | 'mobile' | 'tablet' | 'desktop'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wdriver_device_sim_mode');
      if (saved === 'mobile' || saved === 'tablet' || saved === 'desktop') return saved;
    }
    return 'native';
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setWidth(w);
      setHeight(h);
      setOrientation(w > h ? 'landscape' : 'portrait');
      setNativeType(detectNativeDeviceType());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const handleSetSimulationMode = (mode: 'native' | 'mobile' | 'tablet' | 'desktop') => {
    setSimulationMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('wdriver_device_sim_mode', mode);
    }
  };

  const effectiveDeviceType: DeviceType =
    simulationMode === 'native' ? nativeType : simulationMode;

  const isMobile = effectiveDeviceType === 'mobile';
  const isTablet = effectiveDeviceType === 'tablet';
  const isDesktop = effectiveDeviceType === 'desktop';

  const isRoleAllowed = (role: AppRole): { allowed: boolean; reason?: string } => {
    // 1. MASTER CEO: Acesso Total em Celulares, Tablets e Desktops/Notebooks
    if (role === 'master') {
      return { allowed: true };
    }

    // 2. MOTORISTA / ENTREGADOR: Liberado em Celulares e Tablets
    if (role === 'driver') {
      // Driver is allowed on mobile and tablet (and on desktop we support tablet cockpit mode or native)
      return { allowed: true };
    }

    // 3. W-BANK: Acesso geral à carteira
    if (role === 'wbank') {
      return { allowed: true };
    }

    // 4. PASSAGEIRO: EXCLUSIVO EM CELULAR (Mobile Only)
    if (role === 'passenger') {
      if (effectiveDeviceType === 'mobile') {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason:
          '📱 Acesso Restrito: Para solicitar viagens ou entregas com a W-DRIVER, acesse diretamente pelo aplicativo no seu celular Android ou iPhone.',
      };
    }

    return { allowed: true };
  };

  return {
    deviceType: nativeType,
    effectiveDeviceType,
    isMobile,
    isTablet,
    isDesktop,
    orientation,
    width,
    height,
    simulationMode,
    setSimulationMode: handleSetSimulationMode,
    isRoleAllowed,
  };
}
