import React from 'react';
import { AppRole } from '../types';
import { User, Car, Shield, Wallet, Globe, Gift, Lock } from 'lucide-react';

interface BottomBarProps {
  currentRole: AppRole;
  onSelectRole: (role: AppRole) => void;
  onOpenReferrals: () => void;
  onOpenSocialNetworks: () => void;
  onOpenMasterAuth: () => void;
  isMasterAuthenticated: boolean;
  wBankBalance: number;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  currentRole,
  onSelectRole,
  onOpenReferrals,
  onOpenSocialNetworks,
  onOpenMasterAuth,
  isMasterAuthenticated,
  wBankBalance,
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 border-t border-zinc-800 backdrop-blur-xl px-1.5 py-1.5 flex items-center justify-around shadow-2xl">
      <button
        onClick={() => onSelectRole('passenger')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition ${
          currentRole === 'passenger' ? 'text-[#A8E63A]' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <User className="w-4 h-4" />
        <span className="text-[9px] font-bold">Passageiro</span>
      </button>

      <button
        onClick={() => onSelectRole('driver')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition ${
          currentRole === 'driver' ? 'text-[#A8E63A]' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <Car className="w-4 h-4" />
        <span className="text-[9px] font-bold">Motorista</span>
      </button>

      <button
        onClick={() => {
          if (isMasterAuthenticated) {
            onSelectRole('master');
          } else {
            onOpenMasterAuth();
          }
        }}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition ${
          currentRole === 'master' ? 'text-[#A8E63A]' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        {isMasterAuthenticated ? <Shield className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
        <span className="text-[9px] font-bold">Master</span>
      </button>

      <button
        onClick={() => onSelectRole('wbank')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition ${
          currentRole === 'wbank' ? 'text-[#A8E63A]' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <Wallet className="w-4 h-4" />
        <span className="text-[9px] font-bold">W-BANK</span>
      </button>

      <button
        onClick={onOpenReferrals}
        className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-zinc-400 hover:text-[#A8E63A] transition"
      >
        <Gift className="w-4 h-4 text-[#A8E63A]" />
        <span className="text-[9px] font-bold text-[#A8E63A]">Indicações</span>
      </button>

      <button
        onClick={onOpenSocialNetworks}
        className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-zinc-400 hover:text-white transition"
      >
        <Globe className="w-4 h-4" />
        <span className="text-[9px] font-bold">Redes</span>
      </button>
    </div>
  );
};
