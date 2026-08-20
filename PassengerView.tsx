import React, { useState, useEffect } from 'react';
import {
  AddressDetails,
  CategoryId,
  CommercialAd,
  DeliveryItemType,
  DriverData,
  RideRequest,
  RouteCalculationResult,
  ChatMessage,
} from '../types';
import { CATEGORIES } from '../constants';
import {
  calculateRealRoute,
  searchAddresses,
} from '../services/geoService';
import { audioService } from '../services/audioService';
import { CommercialAdsCarousel } from './CommercialAdsCarousel';
import { RideChatModal } from './RideChatModal';
import {
  MapPin,
  Navigation,
  Clock,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  Star,
  X,
  AlertTriangle,
  ArrowRight,
  Bike,
  Car,
  Flame,
  CheckCircle2,
  Share2,
  ShieldAlert,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Search,
  Check,
  Shield,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PassengerViewProps {
  userLocation: { lat: number; lng: number } | null;
  currentAddress: AddressDetails | null;
  drivers: DriverData[];
  onUseCurrentLocation: () => void;
  onRequestRide: (ride: RideRequest) => void;
  activeRide: RideRequest | null;
  onCancelRide: (rideId: string) => void;
  onPayWithWBank: (amount: number, description: string) => boolean;
  wBankBalance: number;
  onOpenSOS: () => void;
  onRouteCalculated: (
    origin: AddressDetails,
    destination: AddressDetails,
    waypoints: Array<[number, number]>
  ) => void;
  saveCardForAutoPay: boolean;
  onToggleSaveCard: (val: boolean) => void;
  passengerDebt: number;
  waitingSecondsRemaining?: number;
  globalRoute?: RouteCalculationResult | null;
  isCalculatingRoute?: boolean;
  onCalculateRoute?: (
    origin: AddressDetails,
    destination: AddressDetails
  ) => Promise<RouteCalculationResult>;
  onClearRoute?: () => void;
  commercialAds?: CommercialAd[];
  onSendMessage?: (text: string) => void;
  chatMessages?: ChatMessage[];
}

export const PassengerView: React.FC<PassengerViewProps> = ({
  userLocation,
  currentAddress,
  drivers,
  onUseCurrentLocation,
  onRequestRide,
  activeRide,
  onCancelRide,
  onPayWithWBank,
  wBankBalance,
  onOpenSOS,
  onRouteCalculated,
  saveCardForAutoPay,
  onToggleSaveCard,
  passengerDebt,
  waitingSecondsRemaining = 180,
  globalRoute,
  isCalculatingRoute: propIsCalculatingRoute,
  onCalculateRoute,
  onClearRoute,
  commercialAds = [],
  onSendMessage,
  chatMessages = [],
}) => {
  // Bottom Sheet expansion state
  const [isSheetExpanded, setIsSheetExpanded] = useState<boolean>(false);

  const [originInput, setOriginInput] = useState<string>('');
  const [destinationInput, setDestinationInput] = useState<string>('');
  const [originAddress, setOriginAddress] = useState<AddressDetails | null>(null);
  const [destinationAddress, setDestinationAddress] = useState<AddressDetails | null>(null);

  const [originSuggestions, setOriginSuggestions] = useState<AddressDetails[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<AddressDetails[]>([]);
  const [isSearchingDest, setIsSearchingDest] = useState<boolean>(false);
  const [isSearchingOrig, setIsSearchingOrig] = useState<boolean>(false);

  // Local fallback state if not supplied via props
  const [localRouteResult, setLocalRouteResult] = useState<RouteCalculationResult | null>(null);
  const [localIsCalculating, setLocalIsCalculating] = useState<boolean>(false);

  const routeResult = globalRoute || localRouteResult;
  const isCalculatingRoute =
    propIsCalculatingRoute !== undefined ? propIsCalculatingRoute : localIsCalculating;

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('w-carro');
  const [deliveryItemType, setDeliveryItemType] = useState<DeliveryItemType>('passageiro');
  const [paymentMethod, setPaymentMethod] = useState<
    'wbank' | 'cartao_automatico' | 'pix' | 'dinheiro' | 'cartao_maquininha'
  >('cartao_automatico');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');

  // Modals & Chat
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [ratingScore, setRatingScore] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState<string>('');
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [shareCopied, setShareCopied] = useState<boolean>(false);

  // Update origin input from GPS currentAddress
  useEffect(() => {
    if (currentAddress) {
      setOriginAddress(currentAddress);
      setOriginInput(currentAddress.formatted);
    }
  }, [currentAddress]);

  // Autocomplete for Destination
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (destinationInput.trim().length >= 2 && !destinationAddress) {
        setIsSearchingDest(true);
        const results = await searchAddresses(
          destinationInput,
          userLocation?.lat,
          userLocation?.lng
        );
        setDestinationSuggestions(results);
        setIsSearchingDest(false);
      } else {
        setDestinationSuggestions([]);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [destinationInput, destinationAddress, userLocation]);

  // Autocomplete for Origin
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (
        originInput.trim().length >= 2 &&
        (!originAddress || originInput !== originAddress.formatted)
      ) {
        setIsSearchingOrig(true);
        const results = await searchAddresses(
          originInput,
          userLocation?.lat,
          userLocation?.lng
        );
        setOriginSuggestions(results);
        setIsSearchingOrig(false);
      } else {
        setOriginSuggestions([]);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [originInput, originAddress, userLocation]);

  const handleSelectOrigin = async (item: AddressDetails) => {
    setOriginAddress(item);
    setOriginInput(item.formatted);
    setOriginSuggestions([]);

    if (destinationAddress) {
      await calculateAndSetRoute(item, destinationAddress);
    }
  };

  const handleSelectDestination = async (item: AddressDetails) => {
    setDestinationAddress(item);
    setDestinationInput(item.formatted);
    setDestinationSuggestions([]);

    if (originAddress) {
      await calculateAndSetRoute(originAddress, item);
    }
  };

  const calculateAndSetRoute = async (orig: AddressDetails, dest: AddressDetails) => {
    if (onCalculateRoute) {
      const res = await onCalculateRoute(orig, dest);
      onRouteCalculated(orig, dest, res.routePoints);
      return;
    }

    setLocalIsCalculating(true);
    try {
      const result = await calculateRealRoute(orig, dest);
      setLocalRouteResult(result);
      onRouteCalculated(orig, dest, result.routePoints);
    } catch (err) {
      console.error('Error calculating route:', err);
    } finally {
      setLocalIsCalculating(false);
    }
  };

  const handleRequest = () => {
    if (!originAddress || !destinationAddress || !routeResult) {
      alert('Por favor, informe a origem e o destino da viagem.');
      return;
    }

    if (passengerDebt > 0 && paymentMethod !== 'cartao_automatico' && paymentMethod !== 'wbank') {
      alert(
        `Você possui um saldo pendente de R$ ${passengerDebt.toFixed(
          2
        )}. Selecione Cartão Automático ou W-BANK para quitar na solicitação.`
      );
      return;
    }

    const calculatedFare =
      selectedCategory === 'w-taxi'
        ? 10.0
        : routeResult.fares[selectedCategory] || 15.0;

    const ride: RideRequest = {
      id: `ride-${Date.now()}`,
      passengerName: 'Você (Passageiro W-DRIVER)',
      passengerPhone: '(83) 98765-4321',
      passengerPhoto:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      passengerRating: 4.98,
      passengerTotalTrips: 28,
      passengerDebt: passengerDebt,
      origin: originAddress,
      destination: destinationAddress,
      category: selectedCategory,
      distanceKm: routeResult.distanceKm,
      estimatedMinutes: routeResult.estimatedMinutes,
      fare: calculatedFare,
      isTaximeterOnly: selectedCategory === 'w-taxi',
      status: 'searching',
      createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      paymentMethod,
      isDelivery: deliveryItemType !== 'passageiro',
      deliveryType: deliveryItemType,
      deliveryNotes,
      routePoints: routeResult.routePoints,
      overviewPolyline: routeResult.overviewPolyline,
      routeSummary: routeResult.summary,
    };

    audioService.playChime('notification');
    onRequestRide(ride);
  };

  const handleShareRoute = () => {
    if (!activeRide) return;
    const shareUrl = `${window.location.origin}/?rideId=${activeRide.id}&tracking=true`;
    const shareText = `🚗 Acompanhe minha corrida em tempo real pela W-DRIVER!\nMotorista: ${
      activeRide.driver?.name || 'Profissional W-DRIVER'
    } (${activeRide.driver?.vehiclePlate || 'W-DRIVER'})\nDestino: ${
      activeRide.destination.formatted
    }\nLink ao vivo: ${shareUrl}`;

    if (navigator.share) {
      navigator
        .share({
          title: 'Acompanhar Corrida W-DRIVER',
          text: shareText,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareText);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end pointer-events-none select-none max-w-[420px] mx-auto w-full">
      {/* 1. ACTIVE RIDE BOTTOM SHEET */}
      {activeRide ? (
        <div className="pointer-events-auto bg-[#0d0f14]/95 border-t border-zinc-800 rounded-t-[36px] p-4 shadow-[0_-15px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-white max-h-[85vh] overflow-y-auto space-y-3 animate-slide-down">
          {/* Grab Bar Indicator */}
          <div className="w-12 h-1 bg-zinc-700/80 rounded-full mx-auto mb-1" />

          {/* Status Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#A8E63A] animate-ping" />
              <h3 className="font-black text-xs uppercase text-white tracking-wider">
                {activeRide.status === 'searching'
                  ? 'Buscando motorista...'
                  : activeRide.status === 'accepted'
                  ? 'Motorista a caminho'
                  : activeRide.status === 'driver_arrived'
                  ? 'Motorista no embarque'
                  : activeRide.status === 'in_progress'
                  ? 'Viagem em andamento'
                  : 'Corrida finalizada'}
              </h3>
            </div>

            {/* Chat Button */}
            {activeRide.driver && (
              <button
                onClick={() => setChatOpen(true)}
                className="px-3 py-1 rounded-xl bg-[#A8E63A] text-black text-xs font-black flex items-center gap-1.5 shadow-lg hover:bg-[#95d130] transition active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
                {chatMessages.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                )}
              </button>
            )}
          </div>

          {/* Driver Profile Card */}
          {activeRide.driver && (
            <div className="flex items-center gap-3 bg-black/60 p-3 rounded-2xl border border-zinc-800">
              <div className="relative">
                <img
                  src={activeRide.driver.photoUrl}
                  alt={activeRide.driver.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#A8E63A] shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#A8E63A] text-black">
                  <ShieldCheck className="w-3 h-3" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-white truncate">
                    {activeRide.driver.name}
                  </h4>
                  <span className="text-xs font-black text-[#A8E63A] flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-[#A8E63A]" />
                    {activeRide.driver.rating.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300">
                  {activeRide.driver.vehicleModel} • {activeRide.driver.vehicleColor}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded bg-[#A8E63A] text-black font-black text-[10px] tracking-wider">
                    {activeRide.driver.vehiclePlate}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    {activeRide.driver.totalTrips} viagens
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3-Minute Tolerance Timer (When Arrived) */}
          {activeRide.status === 'driver_arrived' && (
            <div className="bg-[#121a0d] border border-[#A8E63A]/40 rounded-2xl p-3 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-black text-[#A8E63A]">
                <Clock className="w-4 h-4" />
                <span>Tolerância de Embarque Oficial</span>
              </div>
              <div className="text-xl font-black font-mono text-white">
                {Math.floor(waitingSecondsRemaining / 60)}:
                {(waitingSecondsRemaining % 60).toString().padStart(2, '0')}
              </div>
              <p className="text-[10px] text-zinc-400">
                Aguarde o embarque no ponto indicado com segurança.
              </p>
            </div>
          )}

          {/* Trip Summary & Fare */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-black/50 border border-zinc-800 text-xs">
            <div>
              <p className="text-zinc-400 text-[10px] uppercase font-bold">Valor Total</p>
              <p className="text-base font-black text-[#A8E63A]">
                R$ {activeRide.fare.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-zinc-400 text-[10px] uppercase font-bold">Distância / Tempo</p>
              <p className="text-xs font-bold text-white">
                {activeRide.distanceKm.toFixed(1)} km • {activeRide.estimatedMinutes} min
              </p>
            </div>
          </div>

          {/* Action Buttons: Share & Cancel */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleShareRoute}
              className="py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-bold text-white flex items-center justify-center gap-1.5 hover:bg-zinc-800 transition active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5 text-[#A8E63A]" />
              <span>{shareCopied ? 'Link Copiado!' : 'Compartilhar'}</span>
            </button>

            <button
              onClick={() => onCancelRide(activeRide.id)}
              className="py-2.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs font-bold text-red-300 flex items-center justify-center gap-1.5 hover:bg-red-900/60 transition active:scale-95"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancelar Viagem</span>
            </button>
          </div>
        </div>
      ) : isSheetExpanded ? (
        /* 2. EXPANDED RIDE PLANNING BOTTOM SHEET */
        <div className="pointer-events-auto bg-[#0c0e12]/95 border-t border-zinc-800 rounded-t-[36px] p-4 shadow-[0_-20px_50px_rgba(0,0,0,0.95)] backdrop-blur-2xl text-white max-h-[84vh] overflow-y-auto space-y-3.5 animate-slide-down">
          {/* Header Row with Grab Bar and Minimize button */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A8E63A]" />
              <h2 className="text-xs font-black uppercase text-white tracking-wider">
                Solicitar Corrida W Drive
              </h2>
            </div>

            <button
              onClick={() => setIsSheetExpanded(false)}
              className="p-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
              title="Recolher para ver o mapa"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Address Inputs Box */}
          <div className="bg-black/60 rounded-2xl p-3 border border-zinc-800 space-y-2.5 relative">
            {/* Origin Input */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#A8E63A] shrink-0" />
                <input
                  type="text"
                  value={originInput}
                  onChange={(e) => {
                    setOriginInput(e.target.value);
                    setOriginAddress(null);
                  }}
                  placeholder="Local de Partida (Sua localização)"
                  className="w-full bg-transparent text-xs text-white placeholder:text-zinc-500 font-medium focus:outline-none"
                />
                <button
                  onClick={onUseCurrentLocation}
                  title="Usar GPS Atual"
                  className="p-1 text-zinc-400 hover:text-[#A8E63A] transition"
                >
                  <Navigation className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Origin Autocomplete Floating List */}
              {originSuggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 z-[9999] mt-1 bg-[#15181e] border border-zinc-700 rounded-xl overflow-hidden shadow-2xl max-h-48 overflow-y-auto">
                  {originSuggestions.map((item, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleSelectOrigin(item)}
                      className="p-2.5 text-xs text-zinc-200 hover:bg-[#A8E63A]/10 hover:text-[#A8E63A] border-b border-zinc-800/80 cursor-pointer flex items-center gap-2 transition"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#A8E63A] shrink-0" />
                      <span className="truncate">{item.formatted}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="h-px bg-zinc-800/80 ml-4" />

            {/* Destination Input */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                <input
                  type="text"
                  value={destinationInput}
                  onChange={(e) => {
                    setDestinationInput(e.target.value);
                    setDestinationAddress(null);
                  }}
                  placeholder="Para onde vamos?"
                  className="w-full bg-transparent text-xs text-white placeholder:text-zinc-500 font-medium focus:outline-none"
                  autoFocus
                />
                {destinationInput && (
                  <button
                    onClick={() => {
                      setDestinationInput('');
                      setDestinationAddress(null);
                      setDestinationSuggestions([]);
                    }}
                    className="p-1 text-zinc-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Destination Autocomplete Floating List */}
              {destinationSuggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 z-[9999] mt-1 bg-[#15181e] border border-zinc-700 rounded-xl overflow-hidden shadow-2xl max-h-48 overflow-y-auto">
                  {destinationSuggestions.map((item, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleSelectDestination(item)}
                      className="p-2.5 text-xs text-zinc-200 hover:bg-[#A8E63A]/10 hover:text-[#A8E63A] border-b border-zinc-800/80 cursor-pointer flex items-center gap-2 transition"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#A8E63A] shrink-0" />
                      <span className="truncate">{item.formatted}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Quick Destination Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {['Orla Cabo Branco', 'Shopping Manaíra', 'Aeroporto Castro Pinto', 'Centro Histórico'].map((destName) => (
              <button
                key={destName}
                onClick={async () => {
                  setDestinationInput(destName);
                  const results = await searchAddresses(destName, userLocation?.lat, userLocation?.lng);
                  if (results.length > 0) {
                    handleSelectDestination(results[0]);
                  }
                }}
                className="px-2.5 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 font-bold whitespace-nowrap hover:border-[#A8E63A] hover:text-[#A8E63A] transition"
              >
                📍 {destName}
              </button>
            ))}
          </div>

          {/* Route Metrics (If calculated) */}
          {routeResult && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#13161c] border border-zinc-800 text-xs">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#A8E63A]" />
                <span className="font-bold text-white">
                  {routeResult.estimatedMinutes} min ({routeResult.distanceKm.toFixed(1)} km)
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-medium">
                Trajeto Oficial Otimizado
              </span>
            </div>
          )}

          {/* Categories Grid / Carousel */}
          <div>
            <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider mb-2">
              Selecione a Categoria W Drive
            </p>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const fare = routeResult ? routeResult.fares[cat.id] || 15.0 : 15.0;
                const isSelected = selectedCategory === cat.id;

                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#151a0f] border-[#A8E63A] shadow-[0_0_20px_rgba(168,230,58,0.25)]'
                        : 'bg-black/50 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base">{cat.icon}</span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#A8E63A]" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">
                        {cat.name}
                      </p>
                      <p className="text-[11px] font-black text-[#A8E63A] mt-0.5">
                        R$ {fare.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-black/60 border border-zinc-800">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#A8E63A]" />
              <div className="text-left">
                <p className="text-[10px] text-zinc-400 font-bold uppercase">Forma de Pagamento</p>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                >
                  <option value="cartao_automatico" className="bg-[#121418] text-white">
                    💳 Cartão Automático (1-Click)
                  </option>
                  <option value="wbank" className="bg-[#121418] text-white">
                    🏦 Saldo W-BANK (R$ {wBankBalance.toFixed(2)})
                  </option>
                  <option value="pix" className="bg-[#121418] text-white">
                    ⚡ PIX Direto ao Motorista
                  </option>
                  <option value="dinheiro" className="bg-[#121418] text-white">
                    💵 Dinheiro em Espécie
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Official Trust Seal Badge */}
          <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-950/30 to-black border border-[#A8E63A]/30 flex items-center gap-2 text-[10px]">
            <ShieldCheck className="w-4 h-4 text-[#A8E63A] shrink-0" />
            <span className="text-zinc-300">
              <strong className="text-white">Credenciamento Oficial:</strong> Motoristas com antecedentes checados e vistoria presencial do veículo.
            </span>
          </div>

          {/* Confirm & Call Driver Action Button */}
          <button
            onClick={handleRequest}
            disabled={isCalculatingRoute}
            className="w-full py-3.5 rounded-2xl bg-[#A8E63A] hover:bg-[#95d130] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(168,230,58,0.4)] transition active:scale-95 disabled:opacity-50"
            id="btn-confirm-ride"
          >
            {isCalculatingRoute ? (
              <span>Calculando Trajeto...</span>
            ) : (
              <>
                <span>Confirmar e Chamar W Drive</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      ) : (
        /* 3. COLLAPSED "PARA ONDE VAMOS?" MINIMALIST PILL (ZERO POLUIÇÃO VISUAL) */
        <div className="pointer-events-auto p-3 space-y-2 max-w-[420px] mx-auto w-full animate-slide-down">
          {/* Floating Search Pill ("Para onde vamos?") */}
          <div
            onClick={() => setIsSheetExpanded(true)}
            className="bg-black/90 border border-zinc-800 hover:border-[#A8E63A] rounded-3xl p-3.5 shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl cursor-pointer group transition-all duration-300 flex items-center justify-between"
            id="btn-where-to"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#A8E63A] text-black flex items-center justify-center shadow-lg group-hover:scale-105 transition">
                <Search className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-black text-white group-hover:text-[#A8E63A] transition">
                  Para onde vamos?
                </h3>
                <p className="text-[11px] text-zinc-400 truncate max-w-[210px]">
                  {originAddress?.formatted || 'Toque para escolher destino'}
                </p>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-white transition">
              <ChevronUp className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* In-App Chat Modal */}
      {chatOpen && activeRide?.driver && (
        <RideChatModal
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          driverName={activeRide.driver.name}
          driverPhoto={activeRide.driver.photoUrl}
          carInfo={`${activeRide.driver.vehicleModel} (${activeRide.driver.vehiclePlate})`}
          messages={chatMessages}
          onSendMessage={(txt) => {
            if (onSendMessage) onSendMessage(txt);
          }}
          isDriverView={false}
        />
      )}
    </div>
  );
};
