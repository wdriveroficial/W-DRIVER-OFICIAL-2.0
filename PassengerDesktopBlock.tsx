import React, { useState } from 'react';
import { Logo } from './Logo';
import {
  Smartphone,
  Tablet,
  Laptop,
  Shield,
  Car,
  QrCode,
  Download,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  CheckCircle,
  Eye,
} from 'lucide-react';

interface PassengerDesktopBlockProps {
  onSimulateMobile: () => void;
  onSwitchToDriver: () => void;
  onSwitchToMaster: () => void;
  deviceWidth: number;
}

export const PassengerDesktopBlock: React.FC<PassengerDesktopBlockProps> = ({
  onSimulateMobile,
  onSwitchToDriver,
  onSwitchToMaster,
  deviceWidth,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 bg-gradient-to-b from-black via-zinc-950 to-black text-white relative overflow-y-auto w-full">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#A8E63A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full mx-auto relative z-10 flex flex-col items-center text-center space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <Logo size={42} showText={false} />
          <div className="text-left">
            <span className="text-2xl font-black tracking-tight text-white block leading-none">
              W<span className="text-[#A8E63A]">-DRIVER</span>
            </span>
            <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              Mobilidade Urbana 3.0
            </span>
          </div>
        </div>

        {/* Warning Icon Graphic */}
        <div className="relative my-2">
          <div className="w-24 h-24 rounded-3xl bg-zinc-900/90 border-2 border-[#A8E63A]/50 flex items-center justify-center shadow-[0_0_40px_rgba(168,230,58,0.25)] relative">
            <Smartphone className="w-12 h-12 text-[#A8E63A] animate-pulse" />
            <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-red-500 text-white font-extrabold text-[10px] uppercase shadow-lg">
              Celular Exclusivo
            </span>
          </div>
        </div>

        {/* Official Block Message */}
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            📱 Acesso Restrito ao Passageiro
          </h2>
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-zinc-200 text-sm md:text-base leading-relaxed max-w-xl mx-auto shadow-inner">
            <p className="font-medium">
              Para solicitar viagens ou entregas com a <strong className="text-[#A8E63A]">W-DRIVER</strong>, acesse diretamente pelo aplicativo no seu <strong className="text-white">celular Android ou iPhone</strong>.
            </p>
          </div>
        </div>

        {/* Official Store Download Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full pt-2">
          {/* Google Play Store Badge Button */}
          <a
            href="https://play.google.com/store"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-[#A8E63A] transition-all shadow-xl group w-full sm:w-auto text-left"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.793 12 3.61 22.186a2.373 2.373 0 0 1-.61-.924c-.167-.468-.255-1.02-.255-1.637V4.375c0-.617.088-1.169.255-1.637.15-.42.36-.74.61-.924z" fill="#00D3FF"/>
                <path d="M17.556 8.238l-3.763 3.762 3.763 3.762 4.25-2.427c1.213-.693 1.213-1.824 0-2.517l-4.25-2.58z" fill="#FFCE00"/>
                <path d="M3.61 1.814l10.183 10.186 3.763-3.762L6.115.657C5.034.04 4.093.447 3.61 1.814z" fill="#00F076"/>
                <path d="M17.556 15.762l-3.763-3.762L3.61 22.186c.483 1.367 1.424 1.774 2.505 1.157l11.441-7.581z" fill="#FF3A44"/>
              </svg>
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-zinc-400 leading-none">
                Disponível no
              </div>
              <div className="text-base font-bold text-white group-hover:text-[#A8E63A] transition-colors leading-tight">
                Google Play
              </div>
            </div>
          </a>

          {/* Apple App Store Badge Button */}
          <a
            href="https://www.apple.com/app-store/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-[#A8E63A] transition-all shadow-xl group w-full sm:w-auto text-left"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <svg className="w-7 h-7 fill-current text-white group-hover:text-[#A8E63A] transition-colors" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.64 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.04-.49 2.66-1.24z"/>
              </svg>
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-zinc-400 leading-none">
                Baixar na
              </div>
              <div className="text-base font-bold text-white group-hover:text-[#A8E63A] transition-colors leading-tight">
                App Store
              </div>
            </div>
          </a>
        </div>

        {/* QR Code Quick Scan for Mobile Device */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 flex items-center gap-4 text-left max-w-md w-full">
          <div className="w-16 h-16 rounded-xl bg-white p-1.5 shrink-0 flex items-center justify-center">
            {/* Visual SVG QR Code */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-black fill-current">
              <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" />
              <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" />
              <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
              <path d="M40,10 h20 v10 h-20 z M40,30 h10 v20 h-10 z M60,40 h20 v10 h-20 z M40,70 h10 v20 h-10 z M60,70 h30 v10 h-30 z M80,90 h10 v10 h-10 z" />
            </svg>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-[#A8E63A]" />
              <span>Aponte a câmera do seu celular</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-snug">
              Abra a câmera do smartphone para carregar o W-DRIVER no seu celular instantaneamente.
            </p>
            <button
              onClick={handleCopyLink}
              className="text-[10px] font-bold text-[#A8E63A] hover:underline inline-flex items-center gap-1 pt-0.5"
            >
              {copiedLink ? '✓ Link copiado para a área de transferência!' : 'Copiar link direto para abrir no celular'}
            </button>
          </div>
        </div>

        {/* Device Compatibility Summary Matrix */}
        <div className="w-full max-w-xl pt-2 border-t border-zinc-850">
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
            Matriz Oficial de Dispositivos por Perfil W-DRIVER 3.0:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {/* Passenger Rule */}
            <div className="bg-zinc-900/60 p-3 rounded-xl border border-red-500/30 text-left space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#A8E63A]" />
                  Passageiro
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">
                  Apenas Celular
                </span>
              </div>
              <p className="text-[10px] text-zinc-400">
                Uso exclusivo em smartphones Android e iOS.
              </p>
            </div>

            {/* Driver Rule */}
            <div
              onClick={onSwitchToDriver}
              className="bg-zinc-900/60 hover:bg-zinc-900 p-3 rounded-xl border border-blue-500/30 hover:border-blue-400 transition cursor-pointer text-left space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5 group-hover:text-[#A8E63A]">
                  <Tablet className="w-3.5 h-3.5 text-blue-400" />
                  Motorista
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
                  Celular + Tablet
                </span>
              </div>
              <p className="text-[10px] text-zinc-400">
                Otimizado para tablets de painel e celulares.
              </p>
            </div>

            {/* Master Rule */}
            <div
              onClick={onSwitchToMaster}
              className="bg-zinc-900/60 hover:bg-zinc-900 p-3 rounded-xl border border-[#A8E63A]/30 hover:border-[#A8E63A] transition cursor-pointer text-left space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5 group-hover:text-[#A8E63A]">
                  <Laptop className="w-3.5 h-3.5 text-[#A8E63A]" />
                  Master CEO
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#A8E63A]/20 text-[#A8E63A]">
                  Acesso Total
                </span>
              </div>
              <p className="text-[10px] text-zinc-400">
                Liberado em Celular, Tablet, Notebook e Desktop.
              </p>
            </div>
          </div>
        </div>

        {/* Developer / Tester Preview Simulation Switch */}
        <div className="pt-2">
          <button
            onClick={onSimulateMobile}
            className="px-4 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition shadow-lg"
          >
            <Eye className="w-3.5 h-3.5 text-[#A8E63A]" />
            <span>Simular Visualização Mobile (Modo Teste / Demonstração)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
