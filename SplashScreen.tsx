import React, { useEffect, useState } from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 2500,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentPct = Math.min(100, Math.floor((elapsed / durationMs) * 100));
      setProgress(currentPct);

      if (elapsed >= durationMs) {
        clearInterval(interval);
        setIsFadingOut(true);
        setTimeout(() => {
          onFinish();
        }, 350);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [durationMs, onFinish]);

  return (
    <div
      onClick={() => {
        setIsFadingOut(true);
        setTimeout(onFinish, 200);
      }}
      className={`fixed inset-0 z-[9999] flex flex-col justify-between items-center bg-[#0D0D0D] overflow-hidden select-none cursor-pointer transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* 1. Background Polygonal 3D Mesh / Geometric Textures */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle Bronze / Golden Ambient Highlights */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#C59B27]/10 blur-[90px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#A8E63A]/15 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-[#182012]/40 blur-[80px]" />

        {/* 3D Geometric Vector Lines & Polygons */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="meshGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#3A4454"
                strokeWidth="0.75"
                strokeDasharray="2 3"
              />
            </pattern>
            <linearGradient id="polyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C59B27" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#A8E63A" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#1E293B" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#meshGrid)" />

          {/* Dynamic 3D faceted polygons */}
          <polygon points="0,0 240,0 120,180" fill="url(#polyGrad)" />
          <polygon points="120,180 360,120 280,300" fill="url(#polyGrad)" />
          <polygon points="0,320 200,420 80,600" fill="url(#polyGrad)" />
          <polygon points="280,300 420,400 320,620" fill="url(#polyGrad)" />
        </svg>

        {/* Brushed Metal Radial Overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0D0D0D]/60 to-[#0A0A0A]" />
      </div>

      {/* Top Header Status Tag */}
      <div className="relative z-10 pt-10 px-6 w-full flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-zinc-800 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#A8E63A] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#A8E63A]">
            OFICIAL 3.0
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFadingOut(true);
            setTimeout(onFinish, 150);
          }}
          className="text-[10px] font-bold text-zinc-400 hover:text-white px-2.5 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 transition"
        >
          Pular
        </button>
      </div>

      {/* Center Branding / Hero Logo with Highway Ribbon */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 my-auto animate-slide-up">
        {/* Glow halo behind logo */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-[#A8E63A]/25 blur-2xl animate-pulse" />

          {/* Símbolo "W" em formato de rodovia 3D */}
          <svg
            width="140"
            height="140"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative drop-shadow-[0_12px_28px_rgba(168,230,58,0.4)] hover:scale-105 transition-transform duration-500"
          >
            <defs>
              <linearGradient id="splashLimeLeft" x1="15%" y1="10%" x2="85%" y2="90%">
                <stop offset="0%" stopColor="#D4FC70" />
                <stop offset="45%" stopColor="#A8E63A" />
                <stop offset="100%" stopColor="#5B9810" />
              </linearGradient>

              <linearGradient id="splashLimeRight" x1="10%" y1="10%" x2="90%" y2="100%">
                <stop offset="0%" stopColor="#C4F859" />
                <stop offset="50%" stopColor="#8ED620" />
                <stop offset="100%" stopColor="#4A810B" />
              </linearGradient>

              <linearGradient id="splashRoadGradient" x1="25%" y1="95%" x2="85%" y2="10%">
                <stop offset="0%" stopColor="#5E9F10" />
                <stop offset="35%" stopColor="#8BE01C" />
                <stop offset="70%" stopColor="#B5F447" />
                <stop offset="100%" stopColor="#E6FE90" />
              </linearGradient>
            </defs>

            {/* Outer Left Stem */}
            <path
              d="M18 24C18 24 29 25 36 44L47 76C47 76 34 85 24 58L18 24Z"
              fill="url(#splashLimeLeft)"
            />

            {/* Outer Right Leg */}
            <path
              d="M98 24C102 34 96 56 83 78C73 95 65 95 65 95C65 95 75 79 85 55L98 24Z"
              fill="url(#splashLimeRight)"
            />

            {/* Main Highway Ribbon */}
            <path
              d="M39 77C39 77 56 34 94 24C94 24 81 38 52 83C46 93 37 96 33 94C29 91 33 82 39 77Z"
              fill="url(#splashRoadGradient)"
            />

            {/* Upper Left Wing */}
            <path
              d="M21 24L35 24L48 70C48 70 38 88 27 62L21 24Z"
              fill="url(#splashLimeLeft)"
            />

            {/* Dashed Center Road Line */}
            <path d="M42 79L44 75" stroke="#FFFFFF" strokeWidth="3.6" strokeLinecap="round" />
            <path d="M48 69L52 63" stroke="#FFFFFF" strokeWidth="3.6" strokeLinecap="round" />
            <path d="M57 57L63 50" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M70 43L78 37" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M84 32L89 28" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
          </svg>
        </div>

        {/* Main Title: W-DRIVER */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight flex items-center justify-center drop-shadow-lg">
          <span className="text-[#A8E63A]">W-</span>
          <span className="text-white">DRIVER</span>
        </h1>

        {/* Subtitle Requisitado: "transporte legal de passageiros e encomendas desde 2009" */}
        <p className="text-sm font-semibold text-zinc-200 mt-2 tracking-wide uppercase">
          Transporte legal de passageiros
        </p>
        <p className="text-xs text-zinc-400 font-medium tracking-wider">
          e encomendas desde 2009
        </p>

        {/* Trust Badges */}
        <div className="flex items-center gap-2 mt-4 text-[11px] font-bold text-[#A8E63A] bg-[#A8E63A]/10 border border-[#A8E63A]/30 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Plataforma 100% Segura & Homologada</span>
        </div>
      </div>

      {/* Bottom Area: Curved Green Road Line + Progress Bar */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Neon Progress Bar */}
        <div className="w-48 h-1.5 bg-zinc-900 rounded-full overflow-hidden mb-3 border border-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-[#76BC21] via-[#A8E63A] to-[#C4F859] transition-all duration-75 shadow-[0_0_12px_#A8E63A]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-[10px] text-zinc-500 font-mono mb-4 tracking-wider">
          INICIALIZANDO PLATAFORMA... {progress}%
        </p>

        {/* Bottom Curved Road SVG */}
        <div className="w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 400 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-16 sm:h-20"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="bottomRoadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4A810B" />
                <stop offset="40%" stopColor="#A8E63A" />
                <stop offset="80%" stopColor="#76BC21" />
                <stop offset="100%" stopColor="#C4F859" />
              </linearGradient>
            </defs>

            {/* Fluid Sweeping Road Curve */}
            <path
              d="M0 65C80 65 140 30 220 30C300 30 340 55 400 50L400 80L0 80Z"
              fill="url(#bottomRoadGrad)"
              fillOpacity="0.85"
            />

            {/* Dashed Center White Highway Line */}
            <path
              d="M0 72C80 72 140 37 220 37C300 37 340 62 400 57"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeDasharray="8 6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
