import React from 'react';
import { RideRequest } from '../types';
import {
  ChevronRight,
  ShieldCheck,
  Star,
  Award,
  Navigation,
  Clock,
  DollarSign,
  User,
  MessageSquare,
  X,
} from 'lucide-react';

interface DriverPassengerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  ride: RideRequest;
  onOpenChat: () => void;
}

export const DriverPassengerDrawer: React.FC<DriverPassengerDrawerProps> = ({
  isOpen,
  onClose,
  ride,
  onOpenChat,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm h-full bg-[#111317] border-l border-[#242830] shadow-2xl flex flex-col justify-between p-5 transform transition-transform duration-300 ease-out animate-slide-left overflow-y-auto">
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A8E63A] animate-pulse"></span>
              <h3 className="text-sm font-black uppercase text-white tracking-wider">
                Ficha do Passageiro
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Passenger Identity Card */}
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-black/70 border border-zinc-800 mb-4">
            <div className="relative mb-3">
              <img
                src={
                  ride.passengerPhoto ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
                alt={ride.passengerName}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#A8E63A] shadow-xl"
              />
              <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-[#A8E63A] text-black font-black text-[9px] flex items-center gap-0.5 shadow">
                <ShieldCheck className="w-2.5 h-2.5" />
                VERIFICADO
              </div>
            </div>

            <h4 className="text-base font-extrabold text-white">{ride.passengerName}</h4>
            <p className="text-xs text-zinc-400 mt-0.5">{ride.passengerPhone}</p>

            {/* Rating & Trip Counts */}
            <div className="grid grid-cols-2 gap-3 w-full mt-4 pt-3 border-t border-zinc-850">
              <div className="bg-[#181a1f] p-2 rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Avaliação</span>
                <div className="text-sm font-black text-[#A8E63A] flex items-center justify-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-[#A8E63A]" />
                  <span>{ride.passengerRating ? ride.passengerRating.toFixed(2) : '5.00'}</span>
                </div>
              </div>
              <div className="bg-[#181a1f] p-2 rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Total Viagens</span>
                <div className="text-sm font-black text-white flex items-center justify-center gap-1 mt-0.5">
                  <Award className="w-3.5 h-3.5 text-[#A8E63A]" />
                  <span>{ride.passengerTotalTrips || 24} corridas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ride Details Summary */}
          <div className="space-y-3 p-4 rounded-2xl bg-black/60 border border-zinc-800 text-xs">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Ponto de Embarque</span>
              <p className="text-white font-medium mt-0.5">{ride.origin.formatted}</p>
            </div>

            <div className="pt-2 border-t border-zinc-850">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Destino Final</span>
              <p className="text-white font-medium mt-0.5">{ride.destination.formatted}</p>
            </div>

            <div className="pt-2 border-t border-zinc-850 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Valor da Corrida</span>
                <div className="text-sm font-black text-[#A8E63A]">
                  {ride.isTaximeterOnly ? 'R$ 10,00 + Taxímetro' : `R$ ${ride.fare.toFixed(2)}`}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Distância</span>
                <div className="text-xs font-bold text-white">
                  {ride.distanceKm} km (~{ride.estimatedMinutes} min)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button: Exclusive Internal Chat */}
        <div className="pt-4 border-t border-zinc-800 space-y-2">
          <button
            onClick={() => {
              onClose();
              onOpenChat();
            }}
            className="w-full py-3.5 rounded-2xl bg-[#A8E63A] hover:bg-[#95d130] text-black font-black text-xs uppercase flex items-center justify-center gap-2 shadow-xl transition active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Abrir Chat com Passageiro</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-400 font-bold text-xs uppercase transition"
          >
            Fechar Painel
          </button>
        </div>
      </div>
    </div>
  );
};
