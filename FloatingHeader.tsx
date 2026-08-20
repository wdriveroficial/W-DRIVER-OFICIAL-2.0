import React from 'react';
import { AppRole } from '../types';
import { ThemePreference, EffectiveTheme } from '../services/themeService';
import { Logo } from './Logo';
import {
  Menu,
  ShieldAlert,
  Volume2,
  VolumeX,
  Car,
  User,
  Shield,
  Wallet,
  Sun,
  Moon,
  Clock,
} from 'lucide-react';

interface FloatingHeaderProps {
  currentRole: AppRole;
  onOpenDrawer: () => void;
  onOpenSOS: () => void;
  audioMuted: boolean;
  onToggleAudio: () => void;
  wBankBalance: number;
  themePreference?: ThemePreference;
  effectiveTheme?: EffectiveTheme;
  onToggleTheme?: () => void;
}

export const FloatingHeader: React.FC<FloatingHeaderProps> = ({
  currentRole,
  onOpenDrawer,
  onOpenSOS,
  audioMuted,
  onToggleAudio,
  wBankBalance,
  themePreference = 'auto',
  effectiveTheme = 'dark',
  onToggleTheme,
}) => {
  const getRoleBadge = () => {
    switch (currentRole) {
      case 'driver':
        return {
          label: 'Motorista',
          icon: <Car className="w-3 h-3 text-[#A8E63A]" />,
          color: 'border-[#A8E63A]/40 text-[#A8E63A]',
        };
      case 'master':
        return {
          label: 'Master CEO',
          icon: <Shield className="w-3 h-3 text-[#A8E63A]" />,
          color: 'border-[#A8E63A]/40 text-[#A8E63A]',
        };
      case 'wbank':
        return {
          label: `R$ ${wBankBalance.toFixed(0)}`,
          icon: <Wallet className="w-3 h-3 text-[#A8E63A]" />,
          color: 'border-[#A8E63A]/40 text-[#A8E63A]',
        };
      case 'passenger':
      default:
        return {
          label: 'Passageiro',
          icon: <User className="w-3 h-3 text-zinc-300" />,
          color: 'border-zinc-800 text-zinc-300',
        };
    }
  };

  const badge = getRoleBadge();

  return (
    <header className="absolute top-3 inset-x-3 z-30 flex items-center justify-between pointer-events-none select-none">
      {/* Left: Hamburger Menu Button */}
      <button
        onClick={onOpenDrawer}
        className="pointer-events-auto w-10 h-10 rounded-2xl bg-black/90 backdrop-blur-xl border border-zinc-800/90 text-white flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.85)] hover:border-[#A8E63A] transition active:scale-95 group"
        aria-label="Abrir Menu Principal"
        id="btn-hamburger-menu"
      >
        <Menu className="w-5 h-5 text-zinc-300 group-hover:text-[#A8E63A] transition-colors" />
      </button>

      {/* Center: W-DRIVER Brand Pill Island */}
      <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/90 backdrop-blur-xl border border-zinc-800/90 shadow-[0_8px_25px_rgba(0,0,0,0.85)] hover:border-zinc-700 transition">
        <Logo
          variant={
            currentRole === 'driver'
              ? 'W-CARRO'
              : currentRole === 'wbank'
              ? 'W-BANK'
              : 'W-DRIVER'
          }
          size="sm"
        />
        <div className="h-3 w-px bg-zinc-800 mx-0.5" />
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A8E63A] animate-pulse" />
          <div className="flex items-center gap-1">
            {badge.icon}
            <span className="text-[10px] font-bold text-zinc-200">
              {badge.label}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions (Theme Toggle + Audio Toggle + SOS Urgent Button) */}
      <div className="pointer-events-auto flex items-center gap-1.5">
        {/* Day/Night/Auto Theme Switcher */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="w-10 h-10 rounded-2xl bg-black/90 backdrop-blur-xl border border-zinc-800/90 text-zinc-300 hover:text-[#A8E63A] flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.85)] hover:border-zinc-700 transition active:scale-95 relative"
            title={`Tema Atual: ${
              themePreference === 'auto'
                ? `Automático (${effectiveTheme === 'dark' ? 'Noite' : 'Dia'})`
                : themePreference === 'dark'
                ? 'Escuro (Manual)'
                : 'Claro (Manual)'
            } - Toque para alternar`}
            aria-label="Alternar Tema Automático / Escuro / Claro"
          >
            {themePreference === 'auto' ? (
              <div className="relative flex items-center justify-center">
                {effectiveTheme === 'dark' ? (
                  <Moon className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400" />
                )}
                <span className="absolute -bottom-1 -right-1 text-[7px] font-black bg-[#A8E63A] text-black px-0.5 rounded leading-none">
                  A
                </span>
              </div>
            ) : themePreference === 'dark' ? (
              <Moon className="w-4 h-4 text-[#A8E63A]" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>
        )}

        <button
          onClick={onToggleAudio}
          className="w-10 h-10 rounded-2xl bg-black/90 backdrop-blur-xl border border-zinc-800/90 text-zinc-300 hover:text-[#A8E63A] flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.85)] hover:border-zinc-700 transition active:scale-95"
          title={audioMuted ? 'Ativar Som' : 'Silenciar Áudio'}
          aria-label="Controle de Áudio"
        >
          {audioMuted ? (
            <VolumeX className="w-4 h-4 text-zinc-500" />
          ) : (
            <Volume2 className="w-4 h-4 text-[#A8E63A]" />
          )}
        </button>

        <button
          onClick={onOpenSOS}
          className="w-10 h-10 rounded-2xl bg-red-950/90 backdrop-blur-xl border border-red-500/60 text-red-400 hover:bg-red-900/80 flex items-center justify-center shadow-[0_8px_25px_rgba(239,68,68,0.35)] hover:border-red-400 transition active:scale-95 animate-pulse"
          title="SOS W-URGÊNCIA"
          aria-label="SOS W-URGÊNCIA"
          id="btn-floating-sos"
        >
          <ShieldAlert className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
