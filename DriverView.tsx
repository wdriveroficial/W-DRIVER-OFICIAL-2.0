import React, { useState, useEffect, useRef } from 'react';
import {
  CategoryId,
  DriverData,
  NoShowEvidence,
  RideRequest,
  RideStatus,
  RouteCalculationResult,
  ChatMessage,
} from '../types';
import { CATEGORIES } from '../constants';
import { audioService } from '../services/audioService';
import { Logo } from './Logo';
import { DriverPassengerDrawer } from './DriverPassengerDrawer';
import { RideChatModal } from './RideChatModal';
import {
  Power,
  Navigation,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
  DollarSign,
  User,
  ShieldCheck,
  Award,
  AlertTriangle,
  Play,
  Volume2,
  Camera,
  Video,
  Upload,
  Check,
  Tablet,
  Radio,
  Sliders,
  Menu,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  SlidersHorizontal,
  X,
  FileCheck,
  Wallet,
  HelpCircle,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DriverViewProps {
  driverProfile: DriverData;
  onUpdateDriverCategory: (category: CategoryId) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  incomingRide: RideRequest | null;
  onAcceptRide: (ride: RideRequest) => void;
  onDeclineRide: (rideId: string) => void;
  activeRide: RideRequest | null;
  onUpdateRideStatus: (status: RideStatus) => void;
  onOpenSOS: () => void;
  onAddEarnings: (amount: number, description: string) => void;
  onNoShowCompleted: (evidence: NoShowEvidence) => void;
  waitingSecondsRemaining: number;
  onSetWaitingSecondsRemaining: React.Dispatch<React.SetStateAction<number>>;
  globalRoute?: RouteCalculationResult | null;
  isTablet?: boolean;
  onSendMessage?: (text: string) => void;
  chatMessages?: ChatMessage[];
}

export const DriverView: React.FC<DriverViewProps> = ({
  driverProfile,
  onUpdateDriverCategory,
  isOnline,
  onToggleOnline,
  incomingRide,
  onAcceptRide,
  onDeclineRide,
  activeRide,
  onUpdateRideStatus,
  onOpenSOS,
  onAddEarnings,
  onNoShowCompleted,
  waitingSecondsRemaining,
  onSetWaitingSecondsRemaining,
  globalRoute,
  isTablet = false,
  onSendMessage,
  chatMessages = [],
}) => {
  const [dailyEarnings, setDailyEarnings] = useState<number>(168.5);
  const [completedTripsToday, setCompletedTripsToday] = useState<number>(7);
  const [countdown, setCountdown] = useState<number>(15);

  // Modals & Drawers
  const [isPassengerDrawerOpen, setIsPassengerDrawerOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isQuickFiltersOpen, setIsQuickFiltersOpen] = useState<boolean>(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState<boolean>(false);

  // Quick Filters State
  const [acceptDeliveriesFilter, setAcceptDeliveriesFilter] = useState<boolean>(true);
  const [acceptPassengersFilter, setAcceptPassengersFilter] = useState<boolean>(true);
  const [maxDistanceRadiusKm, setMaxDistanceRadiusKm] = useState<number>(25);

  // Evidence modal state for No-Show
  const [showEvidenceModal, setShowEvidenceModal] = useState<boolean>(false);
  const [evidenceType, setEvidenceType] = useState<'photo' | 'video'>('photo');
  const [evidenceMediaUrl, setEvidenceMediaUrl] = useState<string>('');
  const [evidenceDescription, setEvidenceDescription] = useState<string>('');
  const [isCapturingMedia, setIsCapturingMedia] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Incoming ride countdown timer & audio chime
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (incomingRide && isOnline) {
      audioService.playChime('alert');
      setCountdown(15);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onDeclineRide(incomingRide.id);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [incomingRide?.id, isOnline]);

  // 3-Minute Waiting Timer when driver arrives at location
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeRide?.status === 'driver_arrived' || activeRide?.status === 'waiting_passenger') {
      interval = setInterval(() => {
        onSetWaitingSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            audioService.playWaitExpiredMessage();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeRide?.status]);

  const handleArriveAtOrigin = () => {
    onUpdateRideStatus('driver_arrived');
    onSetWaitingSecondsRemaining(180); // 3 minutes = 180s
    audioService.playDriverArrivedMessage();
  };

  const handleStartTrip = () => {
    onUpdateRideStatus('in_progress');
    audioService.playWelcomeMessage();
  };

  const handleCompleteTrip = () => {
    if (!activeRide) return;
    onUpdateRideStatus('completed');
    audioService.playDestinationArrivedMessage();

    // Credit driver earnings (85% of fare)
    const driverEarnings = Math.round(activeRide.fare * 0.85 * 100) / 100;
    setDailyEarnings((prev) => prev + driverEarnings);
    setCompletedTripsToday((prev) => prev + 1);
    onAddEarnings(driverEarnings, `Corrida concluída #${activeRide.id.slice(-4)}`);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  // Status text for footer matching prompt requirement:
  // "Buscando...", "Solicitando viagem", "Esperando viagem", "Em trânsito para o embarque", "Viagem em andamento"
  const getOperationStatusText = () => {
    if (!isOnline) return 'Você está offline. Toque no botão de energia para iniciar.';
    if (incomingRide) return 'Solicitando viagem... Toque para aceitar!';
    if (!activeRide || activeRide.status === 'idle') return 'Buscando corridas na sua região...';
    if (activeRide.status === 'searching') return 'Buscando passageiros próximos...';
    if (activeRide.status === 'accepted') return 'Em trânsito para o embarque do passageiro';
    if (activeRide.status === 'driver_arrived' || activeRide.status === 'waiting_passenger')
      return 'Esperando passageiro no local de embarque (3 min)';
    if (activeRide.status === 'in_progress') return 'Viagem em andamento até o destino';
    return 'Esperando viagem...';
  };

  const handleLaunchExternalNavigation = (app: 'google' | 'waze') => {
    if (!activeRide) return;
    const target =
      activeRide.status === 'accepted' ? activeRide.origin : activeRide.destination;

    if (app === 'google') {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${target.lat},${target.lng}&travelmode=driving`,
        '_blank'
      );
    } else {
      window.open(
        `https://waze.com/ul?ll=${target.lat},${target.lng}&navigate=yes`,
        '_blank'
      );
    }
  };

  const handleCaptureEvidenceMock = (type: 'photo' | 'video') => {
    setIsCapturingMedia(true);
    setEvidenceType(type);
    setTimeout(() => {
      if (type === 'photo') {
        setEvidenceMediaUrl(
          'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop&q=80'
        );
      } else {
        setEvidenceMediaUrl('https://assets.mixkit.co/videos/preview/mixkit-street-traffic-with-cars-at-night-42217-large.mp4');
      }
      setIsCapturingMedia(false);
    }, 1200);
  };

  const handleConfirmNoShow = () => {
    if (!evidenceMediaUrl) {
      alert('Por favor, capture a foto ou vídeo comprovando a presença no local.');
      return;
    }

    const evidence: NoShowEvidence = {
      mediaUrl: evidenceMediaUrl,
      mediaType: evidenceType,
      capturedAt: new Date().toLocaleTimeString('pt-BR'),
      notes: evidenceDescription || 'Passageiro não compareceu após tolerância de 3 minutos.',
      displacementFee: 10.0,
    };

    onNoShowCompleted(evidence);
    setShowEvidenceModal(false);
    setEvidenceMediaUrl('');
    setEvidenceDescription('');
  };

  return (
    <div className="w-full h-full max-w-[450px] mx-auto flex flex-col justify-between p-3 sm:p-4 text-white relative z-10 select-none overflow-y-auto">
      {/* 1. TOP HEADER BAR: Centralized Earnings in Brand Green + Extremity Action Buttons */}
      <div className="w-full bg-[#111317]/95 border border-[#262a32] rounded-2xl p-3 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3">
        {/* Left Extremity: "Bolinha com tracinho" (Quick Operation Preferences) */}
        <button
          onClick={() => setIsQuickFiltersOpen(true)}
          className="w-10 h-10 rounded-xl bg-black/80 hover:bg-[#1a1d24] border border-zinc-700/80 flex items-center justify-center text-zinc-300 hover:text-[#A8E63A] transition shadow-md group"
          title="Preferências de Operação e Filtros"
        >
          <SlidersHorizontal className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>

        {/* Center: Highlighted Accumulated Earnings in Brand Green */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-[#A8E63A]" />
            Ganhos Acumulados Hoje
          </span>
          <div className="text-xl sm:text-2xl font-black text-[#A8E63A] tracking-tight drop-shadow-[0_2px_10px_rgba(168,230,58,0.35)]">
            R$ {dailyEarnings.toFixed(2)}
          </div>
          <span className="text-[9px] text-zinc-400 font-medium">
            {completedTripsToday} viagens finalizadas
          </span>
        </div>

        {/* Right Extremity: "Três Tracinhos" (Sidebar Menu Drawer) */}
        <button
          onClick={() => setIsSideMenuOpen(true)}
          className="w-10 h-10 rounded-xl bg-black/80 hover:bg-[#1a1d24] border border-zinc-700/80 flex items-center justify-center text-zinc-300 hover:text-[#A8E63A] transition shadow-md group"
          title="Menu do Motorista"
        >
          <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* 2. CENTRAL INTERACTIVE ALERTS (Incoming Ride / Active Trip Cards) */}
      <div className="flex-1 flex flex-col justify-center my-3 relative">
        {/* INCOMING RIDE REQUEST OVERLAY CARD */}
        {incomingRide && isOnline && (
          <div className="w-full max-w-md mx-auto bg-[#131519] border-2 border-[#A8E63A] rounded-3xl p-5 shadow-[0_10px_40px_rgba(168,230,58,0.3)] animate-scale-up z-30">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#A8E63A] animate-ping" />
                <h3 className="font-black text-sm uppercase text-white tracking-wider">
                  Nova Corrida Disponível!
                </h3>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#A8E63A] text-black font-black text-sm flex items-center justify-center shadow-lg">
                {countdown}s
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-start gap-3 bg-black/60 p-3 rounded-2xl border border-zinc-800">
                <MapPin className="w-5 h-5 text-[#A8E63A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Origem / Embarque</span>
                  <p className="text-xs font-semibold text-white mt-0.5">
                    {incomingRide.origin.formatted}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-black/60 p-3 rounded-2xl border border-zinc-800">
                <Navigation className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Destino Final</span>
                  <p className="text-xs font-semibold text-white mt-0.5">
                    {incomingRide.destination.formatted}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-[#1b1e25] p-3 rounded-2xl border border-zinc-800">
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Valor da Viagem</span>
                  <div className="text-lg font-black text-[#A8E63A]">
                    {incomingRide.isTaximeterOnly
                      ? 'R$ 10,00 + Taxímetro'
                      : `R$ ${incomingRide.fare.toFixed(2)}`}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Distância Estimada</span>
                  <div className="text-xs font-black text-white">
                    {incomingRide.distanceKm} km (~{incomingRide.estimatedMinutes} min)
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onDeclineRide(incomingRide.id)}
                className="py-3.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-black text-xs uppercase transition shadow"
              >
                Recusar
              </button>
              <button
                onClick={() => onAcceptRide(incomingRide)}
                className="py-3.5 rounded-2xl bg-[#A8E63A] hover:bg-[#95d130] text-black font-black text-xs uppercase flex items-center justify-center gap-2 shadow-xl transition active:scale-95 animate-pulse"
              >
                <CheckCircle className="w-4 h-4" />
                Aceitar Corrida
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE RIDE TRIP HUD CARD */}
        {activeRide && (
          <div className="w-full max-w-md mx-auto bg-[#121418]/95 border border-[#2b303b] rounded-3xl p-4 shadow-2xl backdrop-blur-md animate-fade-in">
            {/* Header: Passenger preview badge + Trip state */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={
                    activeRide.passengerPhoto ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                  }
                  alt={activeRide.passengerName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#A8E63A]"
                />
                <div>
                  <h4 className="font-extrabold text-sm text-white">{activeRide.passengerName}</h4>
                  <span className="text-[10px] text-[#A8E63A] font-bold">
                    ★ {activeRide.passengerRating ? activeRide.passengerRating.toFixed(2) : '5.00'} • Verificado
                  </span>
                </div>
              </div>

              {/* Chat Button (Exclusive Internal Chat) */}
              <button
                onClick={() => setIsChatOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#A8E63A] text-black text-xs font-black flex items-center gap-1.5 shadow-lg hover:bg-[#95d130] transition active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
                {chatMessages.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                )}
              </button>
            </div>

            {/* Route Stats & External Navigation Shortcuts */}
            <div className="bg-black/60 p-3 rounded-2xl border border-zinc-800 mb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase">
                  {activeRide.status === 'accepted' ? 'Distância até o Embarque' : 'Distância até o Destino'}
                </span>
                <div className="text-sm font-black text-white">
                  {activeRide.distanceKm} km (~{activeRide.estimatedMinutes} min)
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleLaunchExternalNavigation('google')}
                  className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold text-white flex items-center gap-1 transition"
                  title="Abrir no Google Maps"
                >
                  <Navigation className="w-3 h-3 text-[#A8E63A]" />
                  Maps
                </button>
                <button
                  onClick={() => handleLaunchExternalNavigation('waze')}
                  className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold text-white flex items-center gap-1 transition"
                  title="Abrir no Waze"
                >
                  <ExternalLink className="w-3 h-3 text-cyan-400" />
                  Waze
                </button>
              </div>
            </div>

            {/* Waiting Timer Alert if Driver Arrived */}
            {(activeRide.status === 'driver_arrived' || activeRide.status === 'waiting_passenger') && (
              <div className="bg-amber-950/40 border border-amber-500/40 p-3 rounded-2xl mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold uppercase">
                      Tolerância de Espera
                    </span>
                    <div className="text-xs font-black text-white font-mono">
                      {Math.floor(waitingSecondsRemaining / 60)}:
                      {String(waitingSecondsRemaining % 60).padStart(2, '0')} min
                    </div>
                  </div>
                </div>

                {waitingSecondsRemaining === 0 && (
                  <button
                    onClick={() => setShowEvidenceModal(true)}
                    className="px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-[10px] font-black text-white uppercase transition shadow animate-bounce"
                  >
                    Registrar No-Show
                  </button>
                )}
              </div>
            )}

            {/* Dynamic Driver Action Buttons */}
            <div className="space-y-2">
              {activeRide.status === 'accepted' && (
                <button
                  onClick={handleArriveAtOrigin}
                  className="w-full py-3.5 rounded-2xl bg-[#A8E63A] hover:bg-[#95d130] text-black font-black text-xs uppercase flex items-center justify-center gap-2 shadow-xl transition active:scale-95"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Cheguei ao Local de Embarque</span>
                </button>
              )}

              {(activeRide.status === 'driver_arrived' || activeRide.status === 'waiting_passenger') && (
                <button
                  onClick={handleStartTrip}
                  className="w-full py-3.5 rounded-2xl bg-[#A8E63A] hover:bg-[#95d130] text-black font-black text-xs uppercase flex items-center justify-center gap-2 shadow-xl transition active:scale-95"
                >
                  <Play className="w-4 h-4" />
                  <span>Iniciar Corrida (Passageiro a Bordo)</span>
                </button>
              )}

              {activeRide.status === 'in_progress' && (
                <button
                  onClick={handleCompleteTrip}
                  className="w-full py-3.5 rounded-2xl bg-[#A8E63A] hover:bg-[#95d130] text-black font-black text-xs uppercase flex items-center justify-center gap-2 shadow-xl transition active:scale-95"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Finalizar Corrida & Receber</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. FOOTER OPERATION STATUS BAR + SLIDING PASSENGER DRAWER TRIGGER */}
      <div className="w-full bg-[#111317]/95 border border-[#262a32] rounded-2xl p-3 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3">
        {/* Online/Offline Toggle Switch */}
        <button
          onClick={onToggleOnline}
          className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-md ${
            isOnline
              ? 'bg-[#A8E63A] text-black shadow-[0_0_15px_rgba(168,230,58,0.4)]'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
        </button>

        {/* Dynamic Status Text in Center */}
        <div className="flex-1 text-center px-2">
          <p className="text-xs font-bold text-zinc-300 truncate">
            {getOperationStatusText()}
          </p>
        </div>

        {/* Right Seta / Sliding Passenger Drawer Trigger */}
        {activeRide ? (
          <button
            onClick={() => setIsPassengerDrawerOpen(true)}
            className="w-10 h-10 rounded-xl bg-[#1b1e25] hover:bg-[#252a35] border border-zinc-700 flex items-center justify-center text-[#A8E63A] shadow-md transition-transform hover:scale-105"
            title="Ver Ficha Completa do Passageiro (Gaveta Deslizante)"
          >
            <ChevronLeft className="w-5 h-5 animate-pulse" />
          </button>
        ) : (
          <button
            onClick={onOpenSOS}
            className="w-10 h-10 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-700/80 flex items-center justify-center text-red-400 shadow-md transition"
            title="Botão de Pânico / SOS Master"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 4. MODALS & LATERAL DRAWERS */}

      {/* A. Sliding Passenger Details Drawer (Slides from Right to Left) */}
      {activeRide && (
        <DriverPassengerDrawer
          isOpen={isPassengerDrawerOpen}
          onClose={() => setIsPassengerDrawerOpen(false)}
          ride={activeRide}
          onOpenChat={() => setIsChatOpen(true)}
        />
      )}

      {/* B. Exclusive Internal Chat Modal */}
      {activeRide && (
        <RideChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          messages={chatMessages}
          currentRole="driver"
          peerName={activeRide.passengerName}
          peerPhoto={activeRide.passengerPhoto}
          onSendMessage={(txt) => onSendMessage && onSendMessage(txt)}
        />
      )}

      {/* C. Quick Preferences & Filters Modal ("Bolinha com tracinho") */}
      {isQuickFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#121418] border border-[#282d38] rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#A8E63A]" />
                <h3 className="font-extrabold text-sm text-white uppercase">
                  Preferências de Operação
                </h3>
              </div>
              <button
                onClick={() => setIsQuickFiltersOpen(false)}
                className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Category Selector */}
              <div>
                <label className="text-[10px] text-zinc-400 font-bold uppercase block mb-1.5">
                  Modalidade Veicular Atual
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => onUpdateDriverCategory(cat.id)}
                      className={`p-2 rounded-xl text-left border transition ${
                        driverProfile.category === cat.id
                          ? 'bg-[#A8E63A]/20 border-[#A8E63A] text-white font-bold'
                          : 'bg-black/50 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-black truncate">{cat.name}</div>
                      <div className="text-[9px] text-[#A8E63A]">{cat.capacity}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accept Passengers Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-zinc-800">
                <div>
                  <div className="font-bold text-white">Aceitar Passageiros</div>
                  <div className="text-[10px] text-zinc-400">Viagens normais no app</div>
                </div>
                <input
                  type="checkbox"
                  checked={acceptPassengersFilter}
                  onChange={(e) => setAcceptPassengersFilter(e.target.checked)}
                  className="w-4 h-4 accent-[#A8E63A]"
                />
              </div>

              {/* Accept Deliveries Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-zinc-800">
                <div>
                  <div className="font-bold text-white">Aceitar Encomendas & Entregas</div>
                  <div className="text-[10px] text-zinc-400">Malotes, caixas e compras</div>
                </div>
                <input
                  type="checkbox"
                  checked={acceptDeliveriesFilter}
                  onChange={(e) => setAcceptDeliveriesFilter(e.target.checked)}
                  className="w-4 h-4 accent-[#A8E63A]"
                />
              </div>

              {/* Radius Slider */}
              <div className="p-3 rounded-xl bg-black/60 border border-zinc-800">
                <div className="flex justify-between mb-1.5">
                  <span className="font-bold text-white">Raio Máximo de Deslocamento</span>
                  <span className="font-black text-[#A8E63A]">{maxDistanceRadiusKm} km</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={maxDistanceRadiusKm}
                  onChange={(e) => setMaxDistanceRadiusKm(Number(e.target.value))}
                  className="w-full accent-[#A8E63A]"
                />
              </div>
            </div>

            <button
              onClick={() => setIsQuickFiltersOpen(false)}
              className="w-full mt-5 py-3 rounded-xl bg-[#A8E63A] text-black font-black text-xs uppercase shadow-lg hover:bg-[#95d130] transition"
            >
              Salvar Preferências
            </button>
          </div>
        </div>
      )}

      {/* D. Full Driver Sidebar Drawer Menu ("Três Tracinhos") */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xs h-full bg-[#111317] border-r border-[#262a32] p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Profile Card */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={driverProfile.photoUrl}
                    alt={driverProfile.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#A8E63A]"
                  />
                  <div>
                    <h4 className="font-black text-sm text-white">{driverProfile.name}</h4>
                    <p className="text-[10px] text-zinc-400">{driverProfile.vehicleModel}</p>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#A8E63A]/20 text-[#A8E63A] font-bold">
                      {driverProfile.vehiclePlate}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsSideMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Homologação & Vistoria Presencial */}
              <div className="bg-black/60 p-3 rounded-2xl border border-zinc-800 mb-4 text-xs">
                <div className="flex items-center gap-1.5 text-[#A8E63A] font-bold mb-1">
                  <FileCheck className="w-4 h-4" />
                  <span>Credenciamento Oficial W-DRIVER</span>
                </div>
                <p className="text-[11px] text-zinc-300">
                  Vistoria presencial do veículo aprovada e homologada pelo CEO.
                </p>
                <div className="mt-2 text-[10px] text-zinc-400">
                  Data de Homologação: {driverProfile.inspectionDate || '10/08/2026'}
                </div>
              </div>

              {/* Menu Navigation Links */}
              <div className="space-y-1.5 text-xs font-semibold">
                <button
                  onClick={() => {
                    setIsSideMenuOpen(false);
                    alert('Extrato de Ganhos: R$ ' + dailyEarnings.toFixed(2));
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-zinc-800 text-left text-zinc-300 hover:text-white flex items-center gap-2.5 transition"
                >
                  <Wallet className="w-4 h-4 text-[#A8E63A]" />
                  <span>Extrato Detalhado de Corridas</span>
                </button>

                <button
                  onClick={() => {
                    setIsSideMenuOpen(false);
                    alert('Central de Suporte W-DRIVER: (83) 99888-7700');
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-zinc-800 text-left text-zinc-300 hover:text-white flex items-center gap-2.5 transition"
                >
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  <span>Suporte & Normas de Segurança</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <button
                onClick={() => setIsSideMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold uppercase transition"
              >
                Fechar Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* E. No-Show Evidence Capture Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#121418] border border-[#282d38] rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-2 text-red-400 font-black text-sm uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>Registro de No-Show</span>
              </div>
              <button
                onClick={() => setShowEvidenceModal(false)}
                className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 mb-4">
              O tempo limite de 3 minutos encerrou. Registre uma foto ou vídeo comprovando a sua presença no local para receber a taxa de deslocamento de <strong>R$ 10,00</strong>.
            </p>

            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleCaptureEvidenceMock('photo')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                    evidenceType === 'photo'
                      ? 'bg-[#A8E63A]/20 border-[#A8E63A] text-white font-bold'
                      : 'bg-black/50 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <Camera className="w-5 h-5 text-[#A8E63A]" />
                  <span className="text-[10px]">Capturar Foto</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCaptureEvidenceMock('video')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                    evidenceType === 'video'
                      ? 'bg-[#A8E63A]/20 border-[#A8E63A] text-white font-bold'
                      : 'bg-black/50 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <Video className="w-5 h-5 text-cyan-400" />
                  <span className="text-[10px]">Gravar Vídeo 5s</span>
                </button>
              </div>

              {isCapturingMedia ? (
                <div className="p-4 bg-black/60 rounded-xl text-center text-xs text-[#A8E63A] animate-pulse">
                  Gravando evidência com carimbo de data e hora...
                </div>
              ) : evidenceMediaUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-[#A8E63A] h-32">
                  <img
                    src={evidenceMediaUrl}
                    alt="Evidência capturada"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[#A8E63A] text-[9px] font-mono">
                    GPS & HORA REGISTRADOS
                  </div>
                </div>
              ) : null}

              <textarea
                value={evidenceDescription}
                onChange={(e) => setEvidenceDescription(e.target.value)}
                placeholder="Observações adicionais sobre o local (opcional)..."
                className="w-full p-2.5 rounded-xl bg-black border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#A8E63A]"
                rows={2}
              />
            </div>

            <button
              onClick={handleConfirmNoShow}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase shadow-lg transition"
            >
              Confirmar Cancelamento com Taxa R$ 10,00
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
