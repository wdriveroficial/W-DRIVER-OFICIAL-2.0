import React from 'react';
import { AppRole, CommercialAd } from '../types';
import { ThemePreference, EffectiveTheme, TimeOfDayInfo } from '../services/themeService';
import { Logo } from './Logo';
import {
  User,
  Car,
  Shield,
  Wallet,
  Gift,
  Briefcase,
  UserPlus,
  Globe,
  Lock,
  X,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  LogOut,
  Star,
  Sparkles,
  Sun,
  Moon,
  Clock,
  Store,
  Tag,
} from 'lucide-react';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: AppRole;
  onSelectRole: (role: AppRole) => void;
  onOpenSOS: () => void;
  onOpenReferrals: () => void;
  onOpenWorkWithUs: () => void;
  onOpenWantToTravel: () => void;
  onOpenSocialNetworks: () => void;
  onOpenProfile: () => void;
  onOpenMasterAuth: () => void;
  onOpenPartners?: () => void;
  onOpenWelcome?: () => void;
  onOpenFounderBio?: () => void;
  onReplaySplash?: () => void;
  isMasterAuthenticated: boolean;
  wBankBalance: number;
  commercialAds?: CommercialAd[];
  themePreference?: ThemePreference;
  effectiveTheme?: EffectiveTheme;
  timeOfDayInfo?: TimeOfDayInfo;
  onSelectThemePreference?: (pref: ThemePreference) => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
  onOpenSOS,
  onOpenReferrals,
  onOpenWorkWithUs,
  onOpenWantToTravel,
  onOpenSocialNetworks,
  onOpenProfile,
  onOpenMasterAuth,
  onOpenPartners,
  onOpenWelcome,
  onOpenFounderBio,
  onReplaySplash,
  isMasterAuthenticated,
  wBankBalance,
  commercialAds = [],
  themePreference = 'auto',
  effectiveTheme = 'dark',
  timeOfDayInfo,
  onSelectThemePreference,
}) => {
  return (
    <>
      {/* Backdrop overlay with blur */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[80] bg-black/75 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* SideDrawer Container */}
      <aside
        className={`absolute inset-y-0 left-0 z-[90] w-[82%] max-w-[320px] bg-[#0c0e12] border-r border-zinc-800/90 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Profile Area */}
        <div className="p-4 bg-gradient-to-b from-[#14181f] to-[#0c0e12] border-b border-zinc-800/80">
          <div className="flex items-center justify-between mb-3">
            <Logo variant="W-DRIVER" size="sm" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div
            onClick={() => {
              onOpenProfile();
              onClose();
            }}
            className="flex items-center gap-3 p-2.5 rounded-2xl bg-black/50 border border-zinc-800/80 hover:border-[#A8E63A]/50 transition cursor-pointer group"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Foto de Perfil"
                className="w-11 h-11 rounded-2xl object-cover border border-[#A8E63A]"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#A8E63A] rounded-full border-2 border-black flex items-center justify-center text-[9px] font-black text-black">
                ✓
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold text-white truncate group-hover:text-[#A8E63A] transition">
                Dra. Beatriz Albuquerque
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="flex items-center text-[10px] text-amber-400 font-bold">
                  <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                  4.99
                </span>
                <span className="text-[10px] text-zinc-500">•</span>
                <span className="text-[9px] text-[#A8E63A] font-semibold bg-[#A8E63A]/10 px-1.5 py-0.2 rounded-full border border-[#A8E63A]/30">
                  Credenciado
                </span>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition" />
          </div>
        </div>

        {/* Quick Role Switcher Tabs */}
        <div className="p-3 border-b border-zinc-800/60 bg-black/30">
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-2 px-1">
            Alternar Modo de Operação
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => {
                onSelectRole('passenger');
                onClose();
              }}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition ${
                currentRole === 'passenger'
                  ? 'bg-[#A8E63A] text-black border-[#A8E63A] shadow-md'
                  : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Passageiro</span>
            </button>

            <button
              onClick={() => {
                onSelectRole('driver');
                onClose();
              }}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition ${
                currentRole === 'driver'
                  ? 'bg-[#A8E63A] text-black border-[#A8E63A] shadow-md'
                  : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Motorista</span>
            </button>

            <button
              onClick={() => {
                onSelectRole('wbank');
                onClose();
              }}
              className={`p-2 rounded-xl text-xs font-bold flex items-center justify-between border transition ${
                currentRole === 'wbank'
                  ? 'bg-[#A8E63A] text-black border-[#A8E63A] shadow-md'
                  : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Wallet className="w-3.5 h-3.5" />
                <span>W-BANK</span>
              </div>
              <span className={`text-[10px] font-mono ${currentRole === 'wbank' ? 'text-black font-bold' : 'text-[#A8E63A]'}`}>
                R$ {wBankBalance.toFixed(0)}
              </span>
            </button>

            <button
              onClick={() => {
                if (isMasterAuthenticated) {
                  onSelectRole('master');
                } else {
                  onOpenMasterAuth();
                }
                onClose();
              }}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition ${
                currentRole === 'master'
                  ? 'bg-[#A8E63A] text-black border-[#A8E63A] shadow-md'
                  : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              {isMasterAuthenticated ? (
                <Shield className="w-3.5 h-3.5 text-black" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-zinc-500" />
              )}
              <span>Painel CEO</span>
            </button>
          </div>
        </div>

        {/* Menu Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {/* Clube de Parceiros Oficiais (Visível para Passageiro e Geral, NUNCA para Motorista) */}
          {currentRole !== 'driver' && (
            <button
              onClick={() => {
                onOpenPartners?.();
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-[#171c14] to-black border border-[#A8E63A]/50 hover:border-[#A8E63A] transition text-zinc-100 hover:text-[#A8E63A] group text-left shadow-lg mb-1.5"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#A8E63A]/20 text-[#A8E63A] border border-[#A8E63A]/50 group-hover:scale-105 transition">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-black text-white group-hover:text-[#A8E63A] transition">
                      Parceiros Oficiais
                    </p>
                    <span className="text-[9px] font-black bg-[#A8E63A] text-black px-1.5 py-0.2 rounded-full">
                      CUPONS VIP
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-300">
                    Espetinho, Sorvete, Remédio & Ofertas
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A8E63A] group-hover:translate-x-0.5 transition" />
            </button>
          )}

          <button
            onClick={() => {
              onOpenReferrals();
              onClose();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900/80 transition text-zinc-200 hover:text-[#A8E63A] group text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-[#A8E63A]/20 group-hover:text-[#A8E63A] transition">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold">Indique & Ganhe (W0701)</p>
                <p className="text-[10px] text-zinc-400">Receba R$ 5,00 por indicação</p>
              </div>
            </div>
            <span className="text-[10px] font-black text-[#A8E63A] bg-[#A8E63A]/10 px-2 py-0.5 rounded-md">
              R$ 5,00
            </span>
          </button>

          <button
            onClick={() => {
              onOpenWorkWithUs();
              onClose();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900/80 transition text-zinc-200 hover:text-[#A8E63A] group text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-[#A8E63A]/20 group-hover:text-[#A8E63A] transition">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold">Trabalhe Conosco</p>
                <p className="text-[10px] text-zinc-400">Vistoria presencial & Cadastro</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white" />
          </button>

          <button
            onClick={() => {
              onOpenWantToTravel();
              onClose();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900/80 transition text-zinc-200 hover:text-[#A8E63A] group text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-[#A8E63A]/20 group-hover:text-[#A8E63A] transition">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold">Quero Viajar</p>
                <p className="text-[10px] text-zinc-400">Cadastro de passageiro VIP</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white" />
          </button>

          <button
            onClick={() => {
              onOpenSocialNetworks();
              onClose();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900/80 transition text-zinc-200 hover:text-[#A8E63A] group text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-[#A8E63A]/20 group-hover:text-[#A8E63A] transition">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold">Redes Oficiais W Drive</p>
                <p className="text-[10px] text-zinc-400">WhatsApp, Instagram & YouTube</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white" />
          </button>

          <button
            onClick={() => {
              onOpenWelcome?.();
              onClose();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900/80 transition text-zinc-200 hover:text-[#A8E63A] group text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#A8E63A]/10 text-[#A8E63A] group-hover:bg-[#A8E63A]/20 transition">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold">Tela Inicial & Cadastro</p>
                <p className="text-[10px] text-zinc-400">Apresentação oficial e seleção</p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white" />
          </button>

          {onOpenFounderBio && (
            <button
              onClick={() => {
                onOpenFounderBio();
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900/80 transition text-zinc-200 hover:text-[#A8E63A] group text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#A8E63A]/10 text-[#A8E63A] group-hover:bg-[#A8E63A]/20 transition">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold">História do Fundador</p>
                    <span className="text-[8px] font-black bg-[#A8E63A] text-black px-1.5 py-0.2 rounded-full uppercase">
                      Desde 2009
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400">Wallace Motorista & Trajetória</p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white" />
            </button>
          )}

          {onReplaySplash && (
            <button
              onClick={() => {
                onReplaySplash();
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900/80 transition text-zinc-200 hover:text-[#A8E63A] group text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-[#A8E63A] transition">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">Ver Abertura / Ícone Oficial</p>
                  <p className="text-[10px] text-zinc-400">Rever animação de abertura 3.0</p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white" />
            </button>
          )}

          <div className="pt-2 border-t border-zinc-800/80 my-2" />

          {/* Theme Mode Selector (Auto / Dark / Light) */}
          <div className="p-3 bg-zinc-900/60 rounded-2xl border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#A8E63A]" />
                <span className="text-[11px] font-bold text-zinc-200">
                  Tema & Visual da Interface
                </span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-[#A8E63A]">
                {themePreference === 'auto'
                  ? `Auto (${effectiveTheme === 'dark' ? 'Noite' : 'Dia'})`
                  : themePreference === 'dark'
                  ? 'Escuro'
                  : 'Claro'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => onSelectThemePreference?.('auto')}
                className={`py-1.5 px-2 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 border transition ${
                  themePreference === 'auto'
                    ? 'bg-[#A8E63A] text-black border-[#A8E63A] shadow-md font-black'
                    : 'bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Sun className="w-2.5 h-2.5" />
                  <span className="text-[8px]">/</span>
                  <Moon className="w-2.5 h-2.5" />
                </div>
                <span>Automático</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectThemePreference?.('dark')}
                className={`py-1.5 px-2 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 border transition ${
                  themePreference === 'dark'
                    ? 'bg-[#A8E63A] text-black border-[#A8E63A] shadow-md font-black'
                    : 'bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                }`}
              >
                <Moon className="w-3 h-3" />
                <span>Escuro</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectThemePreference?.('light')}
                className={`py-1.5 px-2 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 border transition ${
                  themePreference === 'light'
                    ? 'bg-[#A8E63A] text-black border-[#A8E63A] shadow-md font-black'
                    : 'bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                }`}
              >
                <Sun className="w-3 h-3" />
                <span>Claro</span>
              </button>
            </div>

            <p className="text-[9px] text-zinc-400 leading-tight">
              {themePreference === 'auto'
                ? 'Alternância inteligente: Dia (06h às 18h) e Noite (18h às 06h) com alto contraste.'
                : themePreference === 'dark'
                ? 'Modo noturno fixo com fundo preto e iluminação verde neon.'
                : 'Modo diurno fixo com alta visibilidade para luz solar.'}
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-800/80 my-2" />

          <button
            onClick={() => {
              onOpenSOS();
              onClose();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-red-950/30 border border-red-500/30 hover:bg-red-900/40 transition text-red-300 group text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
                <ShieldAlert className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold text-red-200">SOS W-URGÊNCIA</p>
                <p className="text-[10px] text-red-400">Polícia 190 & Central de Monitoramento</p>
              </div>
            </div>
            <span className="text-[10px] font-black text-red-400 uppercase">
              Emergência
            </span>
          </button>
        </nav>

        {/* Footer */}
        <div className="p-3.5 bg-black/80 border-t border-zinc-800/80 flex items-center justify-between text-zinc-500 text-[10px]">
          <span>W Drive Oficial 3.0</span>
          <span className="text-[#A8E63A] font-bold">Modo Seguro Ativo</span>
        </div>
      </aside>
    </>
  );
};
