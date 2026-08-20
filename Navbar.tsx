import React from 'react';
import { AppRole } from '../types';
import { Logo } from './Logo';
import {
  User,
  Car,
  Shield,
  Wallet,
  Gift,
  AlertTriangle,
  Globe,
  Briefcase,
  UserPlus,
  Lock,
  Smartphone,
  Tablet,
  Laptop,
} from 'lucide-react';
import { DeviceType } from '../services/deviceService';

interface NavbarProps {
  currentRole: AppRole;
  onSelectRole: (role: AppRole) => void;
  gpsActive: boolean;
  onOpenSOS: () => void;
  onOpenReferrals: () => void;
  onOpenWorkWithUs: () => void;
  onOpenWantToTravel: () => void;
  onOpenSocialNetworks: () => void;
  onOpenProfile: () => void;
  onOpenMasterAuth: () => void;
  isMasterAuthenticated: boolean;
  wBankBalance: number;
  deviceType?: DeviceType;
  simulationMode?: 'native' | 'mobile' | 'tablet' | 'desktop';
  onSetSimulationMode?: (mode: 'native' | 'mobile' | 'tablet' | 'desktop') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onSelectRole,
  gpsActive,
  onOpenSOS,
  onOpenReferrals,
  onOpenWorkWithUs,
  onOpenWantToTravel,
  onOpenSocialNetworks,
  onOpenProfile,
  onOpenMasterAuth,
  isMasterAuthenticated,
  wBankBalance,
  deviceType = 'desktop',
  simulationMode = 'native',
  onSetSimulationMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-black/95 border-b border-[#202020] backdrop-blur-md px-3 sm:px-5 py-2.5 flex items-center justify-between shadow-2xl">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <Logo
          variant={
            currentRole === 'wbank'
              ? 'W-BANK'
              : currentRole === 'driver'
              ? 'W-CARRO'
              : 'W-DRIVER'
          }
          size="md"
          showSubtitle
        />
      </div>

      {/* Role Navigation Switcher (Tabs) */}
      <div className="hidden lg:flex items-center gap-2">
        <nav className="flex items-center bg-[#121212] p-1 rounded-2xl border border-zinc-800">
          <button
            onClick={() => onSelectRole('passenger')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentRole === 'passenger'
                ? 'bg-[#A8E63A] text-black shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Passageiro</span>
          </button>

          <button
            onClick={() => onSelectRole('driver')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentRole === 'driver'
                ? 'bg-[#A8E63A] text-black shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Motorista</span>
          </button>

          <button
            onClick={() => {
              if (isMasterAuthenticated) {
                onSelectRole('master');
              } else {
                onOpenMasterAuth();
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentRole === 'master'
                ? 'bg-[#A8E63A] text-black shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {isMasterAuthenticated ? (
              <Shield className="w-3.5 h-3.5" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-zinc-500" />
            )}
            <span>Painel Master</span>
          </button>

          <button
            onClick={() => onSelectRole('wbank')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentRole === 'wbank'
                ? 'bg-[#A8E63A] text-black shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>W-BANK</span>
            <span className="ml-1 text-[10px] font-mono text-zinc-400">
              (R$ {wBankBalance.toFixed(0)})
            </span>
          </button>
        </nav>

        {/* Device Mode Indicator / Selector */}
        {onSetSimulationMode && (
          <div className="hidden xl:flex items-center gap-1 bg-black/60 px-2 py-1 rounded-xl border border-zinc-800 text-[10px]">
            <span className="text-zinc-500 font-bold uppercase tracking-wider">Dispositivo:</span>
            <button
              onClick={() => onSetSimulationMode('native')}
              className={`px-1.5 py-0.5 rounded font-semibold transition ${
                simulationMode === 'native'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Detectar dispositivo automaticamente"
            >
              Auto
            </button>
            <button
              onClick={() => onSetSimulationMode('mobile')}
              className={`px-1.5 py-0.5 rounded font-semibold flex items-center gap-1 transition ${
                simulationMode === 'mobile'
                  ? 'bg-[#A8E63A] text-black font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Simular Smartphone (Android / iOS)"
            >
              <Smartphone className="w-2.5 h-2.5" />
              <span>Celular</span>
            </button>
            <button
              onClick={() => onSetSimulationMode('tablet')}
              className={`px-1.5 py-0.5 rounded font-semibold flex items-center gap-1 transition ${
                simulationMode === 'tablet'
                  ? 'bg-blue-500 text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Simular Tablet (iPad / Android Tablet)"
            >
              <Tablet className="w-2.5 h-2.5" />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => onSetSimulationMode('desktop')}
              className={`px-1.5 py-0.5 rounded font-semibold flex items-center gap-1 transition ${
                simulationMode === 'desktop'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Simular Computador / Desktop"
            >
              <Laptop className="w-2.5 h-2.5" />
              <span>Desktop</span>
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons & Utilities */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Redes Sociais Button */}
        <button
          onClick={onOpenSocialNetworks}
          className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#161616] hover:bg-[#222] text-xs font-bold text-zinc-300 hover:text-white border border-zinc-800 transition"
          title="Redes Sociais Oficiais W-DRIVER"
        >
          <Globe className="w-3.5 h-3.5 text-[#A8E63A]" />
          <span className="hidden xl:inline">Redes Sociais</span>
        </button>

        {/* Trabalhe Conosco Button */}
        <button
          onClick={onOpenWorkWithUs}
          className="hidden sm:inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#161616] hover:bg-[#222] text-xs font-bold text-[#A8E63A] border border-[#A8E63A]/30 transition active:scale-95"
          title="Trabalhe Conosco (W-BIKE, W-MOTO, W-CARRO, W-TÁXI)"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Trabalhe Conosco</span>
        </button>

        {/* Quero Viajar Button */}
        <button
          onClick={onOpenWantToTravel}
          className="hidden md:inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#161616] hover:bg-[#222] text-xs font-bold text-white border border-zinc-800 transition active:scale-95"
          title="Cadastro Simplificado de Passageiro"
        >
          <UserPlus className="w-3.5 h-3.5 text-zinc-400" />
          <span>Quero Viajar</span>
        </button>

        {/* Referral Button */}
        <button
          onClick={onOpenReferrals}
          className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#161616] hover:bg-[#202020] text-xs font-bold text-white border border-zinc-800 transition"
          title="Central de Compartilhamento & Bônus (Código W0701)"
        >
          <Gift className="w-3.5 h-3.5 text-[#A8E63A]" />
          <span className="hidden sm:inline">Indicações</span>
        </button>

        {/* SOS W-URGÊNCIA Button */}
        <button
          onClick={onOpenSOS}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black tracking-wider transition shadow-lg animate-pulse"
          title="Acionar Central W-URGÊNCIA (SOS)"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>SOS</span>
        </button>

        {/* Profile Avatar Button */}
        <button
          onClick={onOpenProfile}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#181818] border border-[#A8E63A] overflow-hidden flex items-center justify-center hover:scale-105 transition shrink-0"
          title="Meu Perfil e Documentos"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Perfil"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};
