import React, { useState } from 'react';
import { SOSEvent } from '../types';
import { audioService } from '../services/audioService';
import {
  AlertTriangle,
  PhoneCall,
  ShieldAlert,
  MapPin,
  Share2,
  X,
  CheckCircle2,
  Volume2,
} from 'lucide-react';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCoordinates: { lat: number; lng: number } | null;
  currentAddressString: string;
  onTriggerSOS: (event: SOSEvent) => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  userCoordinates,
  currentAddressString,
  onTriggerSOS,
}) => {
  const [triggered, setTriggered] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleActivateEmergency = () => {
    setTriggered(true);
    audioService.playChime('emergency');

    const newEvent: SOSEvent = {
      id: `sos-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      userRole: 'Passageiro / Motorista',
      userName: 'Usuário W-DRIVER Oficial',
      userPhone: '(83) 99888-7700',
      coordinates: userCoordinates || { lat: -7.11532, lng: -34.861 },
      address: currentAddressString || 'Avenida Epitácio Pessoa, João Pessoa - PB',
      resolved: false,
    };

    onTriggerSOS(newEvent);
  };

  const handleShareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: 'ALERTA W-URGÊNCIA – W-DRIVER',
        text: `Minha localização atual de emergência: ${currentAddressString} (GPS: ${userCoordinates?.lat}, ${userCoordinates?.lng})`,
        url: `https://www.google.com/maps?q=${userCoordinates?.lat},${userCoordinates?.lng}`,
      });
    } else {
      navigator.clipboard.writeText(
        `EMERGÊNCIA W-DRIVER: ${currentAddressString} - https://www.google.com/maps?q=${userCoordinates?.lat},${userCoordinates?.lng}`
      );
      alert('Link de localização de emergência copiado!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#141414] border-2 border-red-600 rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-5 shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SOS Header Icon */}
        <div className="w-16 h-16 rounded-full bg-red-950/80 border-2 border-red-500 flex items-center justify-center mx-auto text-red-500 animate-pulse">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-xl font-black text-white tracking-tight">W-URGÊNCIA (SOS)</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Central de Segurança e Suporte Imediato 24h W-DRIVER
          </p>
        </div>

        {/* Current Location Badge */}
        <div className="p-3 bg-black rounded-xl border border-zinc-800 text-left text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-red-400 font-bold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Sua Localização GPS Atual:</span>
          </div>
          <p className="text-white text-[11px] leading-relaxed">
            {currentAddressString || 'Carregando coordenadas GPS...'}
          </p>
        </div>

        {/* Big SOS Trigger Button */}
        {!triggered ? (
          <button
            onClick={handleActivateEmergency}
            className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wider transition shadow-2xl flex items-center justify-center gap-2 active:scale-95 animate-pulse"
          >
            <AlertTriangle className="w-5 h-5" />
            <span>ACIONAR CENTRAL W-URGÊNCIA</span>
          </button>
        ) : (
          <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-400 text-xs font-bold space-y-1">
            <CheckCircle2 className="w-6 h-6 mx-auto mb-1" />
            <div>ALERTA REGISTRADO COM SUCESSO!</div>
            <p className="text-[11px] text-zinc-300 font-normal">
              A Central de Operações W-DRIVER foi notificada com suas coordenadas em tempo real.
            </p>
          </div>
        )}

        {/* Official Emergency Contact Numbers */}
        <div className="space-y-2 text-left">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Telefones de Emergência Rápida:
          </span>

          <div className="grid grid-cols-2 gap-2">
            <a
              href="tel:190"
              className="flex items-center justify-between p-3 rounded-xl bg-black border border-zinc-800 hover:border-red-500 transition text-xs text-white"
            >
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-red-400" />
                <div>
                  <div className="font-bold">190</div>
                  <div className="text-[10px] text-zinc-400">Polícia Militar</div>
                </div>
              </div>
            </a>

            <a
              href="tel:192"
              className="flex items-center justify-between p-3 rounded-xl bg-black border border-zinc-800 hover:border-red-500 transition text-xs text-white"
            >
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-red-400" />
                <div>
                  <div className="font-bold">192</div>
                  <div className="text-[10px] text-zinc-400">SAMU (Resgate)</div>
                </div>
              </div>
            </a>

            <a
              href="tel:193"
              className="flex items-center justify-between p-3 rounded-xl bg-black border border-zinc-800 hover:border-red-500 transition text-xs text-white"
            >
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-red-400" />
                <div>
                  <div className="font-bold">193</div>
                  <div className="text-[10px] text-zinc-400">Bombeiros</div>
                </div>
              </div>
            </a>

            <button
              onClick={handleShareLocation}
              className="flex items-center justify-between p-3 rounded-xl bg-black border border-zinc-800 hover:border-[#A8E63A] transition text-xs text-white"
            >
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#A8E63A]" />
                <div>
                  <div className="font-bold">Compartilhar</div>
                  <div className="text-[10px] text-zinc-400">Com Familiares</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
