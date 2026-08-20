import React, { useState, useEffect, useCallback } from 'react';
import {
  AddressDetails,
  AppRole,
  BankTransaction,
  CategoryId,
  DriverData,
  LeadCapture,
  NoShowEvidence,
  ReferralRecord,
  RideRequest,
  RideStatus,
  RouteCalculationResult,
  SOSEvent,
  ShareEvent,
  CommercialAd,
  BroadcastNotification,
  DemandZoneHeatmap,
  ChatMessage,
  ToastItem,
} from './types';
import {
  CATEGORIES,
  INITIAL_DRIVERS,
  INITIAL_REFERRALS,
  INITIAL_CAPTURED_LEADS,
  INITIAL_COMMERCIAL_ADS,
  INITIAL_BROADCAST_MESSAGES,
  INITIAL_HEATMAP_ZONES,
} from './constants';
import {
  getCurrentGPSPosition,
  reverseGeocode,
  calculateRealRoute,
} from './services/geoService';
import { audioService } from './services/audioService';

import { MapComponent } from './components/MapComponent';
import { FloatingHeader } from './components/FloatingHeader';
import { SideDrawer } from './components/SideDrawer';
import { PassengerView } from './components/PassengerView';
import { DriverView } from './components/DriverView';
import { MasterPanel } from './components/MasterPanel';
import { WBankView } from './components/WBankView';
import { SOSModal } from './components/SOSModal';
import { ReferralModal } from './components/ReferralModal';
import { CustomerAcquisitionModal } from './components/CustomerAcquisitionModal';
import { SocialNetworksModal } from './components/SocialNetworksModal';
import { SafetyAuthModal } from './components/SafetyAuthModal';
import { MasterAuthModal } from './components/MasterAuthModal';
import { OfficialPartnersModal } from './components/OfficialPartnersModal';
import { SplashScreen } from './components/SplashScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { FounderBioModal } from './components/FounderBioModal';
import { AppLauncherIcon } from './components/AppLauncherIcon';
import { PassengerDesktopBlock } from './components/PassengerDesktopBlock';
import { ToastContainer } from './components/ToastContainer';
import { useDeviceDetector } from './services/deviceService';
import { useTheme } from './services/themeService';
import {
  isMasterSessionActive,
  logoutMaster,
  getPlatformConfig,
  savePlatformConfig,
  getDriverStatusMap,
  setDriverAccountStatus,
  DriverAccountStatus,
  PlatformConfig,
} from './services/masterAuthService';
import {
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Radio,
  CheckCircle,
  Volume2,
  VolumeX,
} from 'lucide-react';

export default function App() {
  // Device Detection & Responsiveness Management Hook
  const {
    deviceType,
    effectiveDeviceType,
    isMobile,
    isTablet,
    isDesktop,
    simulationMode,
    setSimulationMode,
    isRoleAllowed,
  } = useDeviceDetector();

  // App Role & Navigation State
  const [currentRole, setCurrentRole] = useState<AppRole>('passenger');

  // Master CEO Security & Session State
  const [isMasterAuthenticated, setIsMasterAuthenticated] = useState<boolean>(() => isMasterSessionActive());
  const [isMasterAuthOpen, setIsMasterAuthOpen] = useState<boolean>(false);
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>(() => getPlatformConfig());
  const [driverStatusMap, setDriverStatusMap] = useState<Record<string, DriverAccountStatus>>(() => getDriverStatusMap());

  // Automatic Theme & Solar Schedule Detector Hook
  const {
    themePreference,
    effectiveTheme,
    isDark,
    timeOfDayInfo,
    setThemePreference,
    toggleTheme,
  } = useTheme();

  // GPS & Location States
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [currentAddress, setCurrentAddress] = useState<AddressDetails | null>(null);
  const [gpsActive, setGpsActive] = useState<boolean>(false);
  const [showGpsModal, setShowGpsModal] = useState<boolean>(false);

  // Map and Route States (Synchronized across all modules)
  const [originAddress, setOriginAddress] = useState<AddressDetails | null>(null);
  const [destinationAddress, setDestinationAddress] = useState<AddressDetails | null>(null);
  const [routePoints, setRoutePoints] = useState<Array<[number, number]>>([]);
  const [globalRoute, setGlobalRoute] = useState<RouteCalculationResult | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState<boolean>(false);
  const [activeDriverPosition, setActiveDriverPosition] = useState<{ lat: number; lng: number } | null>(null);

  // Fleet & Driver States
  const [drivers, setDrivers] = useState<DriverData[]>(INITIAL_DRIVERS);
  const [driverIsOnline, setDriverIsOnline] = useState<boolean>(true);
  const [waitingSecondsRemaining, setWaitingSecondsRemaining] = useState<number>(180);

  // Passenger preferences & balances
  const [saveCardForAutoPay, setSaveCardForAutoPay] = useState<boolean>(true);
  const [passengerDebt, setPassengerDebt] = useState<number>(0);

  const [myDriverProfile, setMyDriverProfile] = useState<DriverData>({
    id: 'my-driver-01',
    name: 'Você (Motorista / Parceiro W-DRIVER)',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '(83) 99888-7700',
    rating: 4.99,
    totalTrips: 125,
    category: 'w-carro',
    vehicleModel: 'Toyota Corolla Cross Híbrido',
    vehiclePlate: 'WDR-2026',
    vehicleColor: 'Prata Metálico',
    lat: -7.11532,
    lng: -34.861,
    heading: 0,
    isOnline: true,
    isBusy: false,
    isFaceVerified: true,
    acceptsPassengers: true,
    acceptsDeliveries: true,
  });

  // Active Ride States
  const [activeRide, setActiveRide] = useState<RideRequest | null>(null);
  const [incomingRideForDriver, setIncomingRideForDriver] = useState<RideRequest | null>(null);

  // W-BANK Wallet States
  const [wBankBalance, setWBankBalance] = useState<number>(50.0);
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([
    {
      id: 'tx-1',
      type: 'credit',
      amount: 50.0,
      title: 'Crédito Inicial de Teste',
      description: 'Saldo de demonstração para testes do W-DRIVER',
      date: 'Hoje, 09:00',
      category: 'topup',
    },
    {
      id: 'tx-2',
      type: 'credit',
      amount: 5.0,
      title: 'Bônus de Indicação #W0701',
      description: '5 viagens concluídas pelo indicado',
      date: 'Ontem, 16:30',
      category: 'bonus',
    },
  ]);

  // Referrals & Leads States
  const [referrals, setReferrals] = useState<ReferralRecord[]>(INITIAL_REFERRALS);
  const [capturedLeads, setCapturedLeads] = useState<LeadCapture[]>(INITIAL_CAPTURED_LEADS);
  const [sosEvents, setSosEvents] = useState<SOSEvent[]>([]);

  // Real-time Social Shares Events
  const [shareEvents, setShareEvents] = useState<ShareEvent[]>([
    {
      id: 'share-1',
      platform: 'whatsapp',
      referralCode: 'W0701',
      timestamp: 'Hoje, 08:30',
      userRole: 'passenger',
    },
    {
      id: 'share-2',
      platform: 'instagram',
      referralCode: 'W0701',
      timestamp: 'Hoje, 08:45',
      userRole: 'driver',
    },
    {
      id: 'share-3',
      platform: 'facebook',
      referralCode: 'W0701',
      timestamp: 'Hoje, 09:12',
      userRole: 'passenger',
    },
  ]);

  // Commercial Ads & Monetization Partners State
  const [commercialAds, setCommercialAds] = useState<CommercialAd[]>(INITIAL_COMMERCIAL_ADS);

  // Central Broadcast Push Notifications State
  const [broadcastMessages, setBroadcastMessages] = useState<BroadcastNotification[]>(INITIAL_BROADCAST_MESSAGES);

  // Demand Heatmap Zones State
  const [heatmapZones, setHeatmapZones] = useState<DemandZoneHeatmap[]>(INITIAL_HEATMAP_ZONES);

  // In-App Chat Messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Toast Notifications Hub State
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const handleDismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = {
      id,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      ...toast,
    };
    setToasts((prev) => [newToast, ...prev.slice(0, 3)]);

    // Audio chime trigger according to urgency & type
    if (toast.type === 'sos') {
      audioService.playChime('alert');
    } else if (toast.type === 'broadcast') {
      audioService.playChime('alert');
    } else if (toast.type === 'ride_status' || toast.type === 'chat') {
      audioService.playChime('notification');
    } else if (toast.type === 'success') {
      audioService.playChime('success');
    }
  }, []);

  // Modals
  const [showSplashScreen, setShowSplashScreen] = useState<boolean>(true);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(false);
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState<boolean>(false);
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);
  const [isReferralOpen, setIsReferralOpen] = useState<boolean>(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState<boolean>(false);
  const [leadModalInitialMode, setLeadModalInitialMode] = useState<'work' | 'passenger'>('work');
  const [activeReferralCode, setActiveReferralCode] = useState<string>('W0701');
  const [isSocialModalOpen, setIsSocialModalOpen] = useState<boolean>(false);
  const [isSafetyAuthOpen, setIsSafetyAuthOpen] = useState<boolean>(false);
  const [isPartnersModalOpen, setIsPartnersModalOpen] = useState<boolean>(false);
  const [isFounderBioOpen, setIsFounderBioOpen] = useState<boolean>(false);
  const [audioMuted, setAudioMuted] = useState<boolean>(false);

  const handleSplashScreenFinish = useCallback(() => {
    setShowSplashScreen(false);
    setIsWelcomeOpen(true);
  }, []);

  const handleSelectPartnerDestination = useCallback(
    async (partnerAddress: string, coordinates?: { lat: number; lng: number }) => {
      const destAddress: AddressDetails = {
        street: partnerAddress.split(',')[0]?.trim() || partnerAddress,
        neighborhood: 'Centro Comercial',
        city: 'João Pessoa',
        state: 'PB',
        formatted: partnerAddress,
        lat: coordinates?.lat || -7.115,
        lng: coordinates?.lng || -34.86,
      };
      setDestinationAddress(destAddress);
      setCurrentRole('passenger');

      const origin =
        originAddress ||
        currentAddress ||
        (userLocation
          ? {
              street: 'Sua Localização',
              neighborhood: 'Atual',
              city: 'João Pessoa',
              state: 'PB',
              formatted: 'Sua Localização Atual',
              lat: userLocation.lat,
              lng: userLocation.lng,
            }
          : null);

      if (origin) {
        try {
          setIsCalculatingRoute(true);
          const result = await calculateRealRoute(origin, destAddress);
          setGlobalRoute(result);
          setRoutePoints(result.routePoints);
        } catch (err) {
          console.error('Erro calculando rota para o parceiro:', err);
        } finally {
          setIsCalculatingRoute(false);
        }
      }

      addToast({
        type: 'info',
        title: 'Parceiro Selecionado!',
        message: `Destino definido para ${destAddress.formatted.split('-')[0].trim()}. Escolha sua categoria e confirme a corrida.`,
      });
    },
    [originAddress, currentAddress, userLocation, addToast]
  );

  // Check URL parameters for direct deep linking (referrals, driver registration, passenger mode)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    const refParam = urlParams.get('ref') || urlParams.get('r');
    const actionParam = urlParams.get('action') || urlParams.get('mode');

    if (roleParam === 'driver') {
      setCurrentRole('driver');
    } else if (roleParam === 'master') {
      if (isMasterSessionActive()) {
        setCurrentRole('master');
      } else {
        setCurrentRole('passenger');
        setIsMasterAuthOpen(true);
      }
    } else if (roleParam === 'wbank') {
      setCurrentRole('wbank');
    } else {
      setCurrentRole('passenger');
    }

    if (refParam) {
      setActiveReferralCode(refParam.toUpperCase());
      console.log('W-DRIVER iniciado via link com código de indicação:', refParam);
    }

    // Direct registration deep-link routing
    if (actionParam === 'motorista' || actionParam === 'trabalhe_conosco') {
      setLeadModalInitialMode('work');
      setIsLeadModalOpen(true);
    } else if (actionParam === 'passageiro' || actionParam === 'quero_viajar') {
      setLeadModalInitialMode('passenger');
      setIsLeadModalOpen(true);
    } else if (actionParam === 'cadastro' || actionParam === 'register') {
      setLeadModalInitialMode('work');
      setIsLeadModalOpen(true);
    }

    // Initial Welcome Toast Alert
    const welcomeTimer = setTimeout(() => {
      addToast({
        type: 'broadcast',
        title: 'Central W Drive Conectada',
        message: 'Ecossistema 3.0 ativo com monitoramento GPS em tempo real.',
        urgency: 'normal',
        durationMs: 5000,
      });
    }, 1200);

    return () => clearTimeout(welcomeTimer);
  }, [addToast]);

  // Initialize GPS on Mount
  useEffect(() => {
    initGPS();
  }, []);

  const initGPS = async () => {
    try {
      const pos = await getCurrentGPSPosition();
      setUserLocation(pos);
      setGpsActive(true);

      const addr = await reverseGeocode(pos.lat, pos.lng);
      setCurrentAddress(addr);
      setOriginAddress(addr);

      // Align driver position close to user
      setMyDriverProfile((prev) => ({
        ...prev,
        lat: pos.lat + 0.002,
        lng: pos.lng + 0.002,
      }));

      // Randomize surrounding simulated drivers around user position
      setDrivers((prev) =>
        prev.map((d, index) => {
          const angle = (index * 60 * Math.PI) / 180;
          const radius = 0.004 + index * 0.0015;
          return {
            ...d,
            lat: pos.lat + Math.sin(angle) * radius,
            lng: pos.lng + Math.cos(angle) * radius,
          };
        })
      );
    } catch {
      setShowGpsModal(true);
    }
  };

  const handleUseCurrentLocation = async () => {
    await initGPS();
  };

  // Ride Request Handler
  const handleRequestRide = (ride: RideRequest) => {
    setActiveRide(ride);
    setWaitingSecondsRemaining(180);

    addToast({
      type: 'ride_status',
      title: 'Buscando Motorista Próximo...',
      message: `Solicitação para categoria ${ride.category.toUpperCase()} enviada à rede de motoristas homologados.`,
      durationMs: 4000,
    });

    if (ride.routePoints && ride.routePoints.length > 0) {
      setRoutePoints(ride.routePoints);
      setOriginAddress(ride.origin);
      setDestinationAddress(ride.destination);
      setGlobalRoute({
        distanceKm: ride.distanceKm,
        estimatedMinutes: ride.estimatedMinutes,
        routePoints: ride.routePoints,
        overviewPolyline: ride.overviewPolyline,
        fares: { [ride.category]: ride.fare },
        etas: { [ride.category]: ride.estimatedMinutes },
        summary: ride.routeSummary || 'Trajeto Oficial por Vias Urbanas',
        source: 'google_maps',
      });
    }

    // If driver is online, also forward this ride to the driver console
    if (driverIsOnline) {
      setIncomingRideForDriver(ride);
    }

    // Automated simulation transition if not in driver mode
    setTimeout(() => {
      let driverName = 'Motorista Parceiro';
      setActiveRide((prev) => {
        if (!prev) return null;
        const matchingDriver = drivers.find((d) => d.category === prev.category) || drivers[0];
        driverName = matchingDriver.name;
        return {
          ...prev,
          status: 'accepted',
          driverId: matchingDriver.id,
          driver: matchingDriver,
        };
      });
      audioService.playChime('notification');
      addToast({
        type: 'ride_status',
        title: 'Motorista Confirmado!',
        message: `${driverName} aceitou sua viagem e está a caminho do ponto de embarque.`,
        durationMs: 5000,
      });

      // Step 2: Driver arrived at pickup location
      setTimeout(() => {
        setActiveRide((prev) => (prev ? { ...prev, status: 'driver_arrived' } : null));
        setWaitingSecondsRemaining(180);
        audioService.playDriverArrivedMessage();
        addToast({
          type: 'ride_status',
          title: 'Motorista no Local de Embarque!',
          message: 'O veículo parceiro chegou. A tolerância oficial de 3 minutos foi iniciada.',
          durationMs: 6500,
        });

        // Step 3: Start trip & Welcome Audio
        setTimeout(() => {
          setActiveRide((prev) => (prev ? { ...prev, status: 'in_progress' } : null));
          audioService.playWelcomeMessage();
          addToast({
            type: 'ride_status',
            title: 'Viagem em Andamento',
            message: 'Passageiro a bordo. Trajeto monitorado pela central de segurança.',
            durationMs: 4500,
          });

          // Step 4: Finish trip & Arrival Audio
          setTimeout(() => {
            let finalFare = ride.fare;
            setActiveRide((prev) => {
              if (!prev) return null;
              finalFare = prev.fare;
              // If automatic card payment is authorized or wbank
              if (prev.paymentMethod === 'wbank') {
                deductFromWBank(prev.fare, `Corrida W-DRIVER #${prev.id.slice(-4)}`);
              } else if (prev.paymentMethod === 'cartao_automatico' || saveCardForAutoPay) {
                console.log(`Débito automático no cartão cadastrado: R$ ${prev.fare.toFixed(2)}`);
              }
              return { ...prev, status: 'completed' };
            });
            audioService.playDestinationArrivedMessage();
            addToast({
              type: 'success',
              title: 'Destino Alcançado!',
              message: `Corrida finalizada (R$ ${finalFare.toFixed(2)}). Obrigado por viajar com W Drive!`,
              durationMs: 6000,
            });

            // Check and update referral bonus
            updateReferralProgress();
          }, 14000);
        }, 4000);
      }, 4000);
    }, 2500);
  };

  // Update Referral progress after completed ride
  const updateReferralProgress = () => {
    setReferrals((prev) => {
      const updated = [...prev];
      if (updated.length > 0) {
        const last = updated[0];
        const newCount = Math.min(5, last.completedRides + 1);
        const shouldPay = newCount >= 5 && !last.isPaid;

        updated[0] = {
          ...last,
          completedRides: newCount,
          isPaid: last.isPaid || shouldPay,
          bonusEarned: shouldPay ? 5.0 : last.bonusEarned,
        };

        if (shouldPay) {
          creditToWBank(5.0, 'Bônus de Indicação W-DRIVER (5 Viagens Concluídas)');
          addToast({
            type: 'success',
            title: '🎁 Bônus de Indicação Recebido!',
            message: 'Parabéns! 5 corridas completadas pelo seu indicado. R$ 5,00 creditados no W-BANK.',
            durationMs: 7000,
          });
        }
      }
      return updated;
    });
  };

  const handleCancelRide = (rideId: string) => {
    setActiveRide(null);
    setIncomingRideForDriver(null);
    setActiveDriverPosition(null);
    setGlobalRoute(null);
    setRoutePoints([]);
    audioService.playChime('notification');
    addToast({
      type: 'warning',
      title: 'Corrida Cancelada',
      message: 'A solicitação de viagem foi cancelada no sistema.',
      durationMs: 4000,
    });
  };

  const handleDriverAcceptRide = (ride: RideRequest) => {
    setIncomingRideForDriver(null);
    setActiveRide({
      ...ride,
      status: 'accepted',
      driverId: myDriverProfile.id,
      driver: myDriverProfile,
    });
    audioService.playChime('success');
    addToast({
      type: 'ride_status',
      title: 'Corrida Aceita com Sucesso!',
      message: `Você aceitou a viagem de ${ride.passengerName} (R$ ${ride.fare.toFixed(2)}). Dirija ao ponto de embarque.`,
      durationMs: 6000,
    });
  };

  const handleDriverDeclineRide = (rideId: string) => {
    setIncomingRideForDriver(null);
  };

  const handleUpdateRideStatus = (status: RideStatus) => {
    if (!activeRide) return;
    setActiveRide({
      ...activeRide,
      status,
    });
  };

  const handleNoShowCompleted = (evidence: NoShowEvidence) => {
    if (!activeRide) return;

    // Register debt on passenger account or charge card
    if (saveCardForAutoPay || activeRide.paymentMethod === 'cartao_automatico') {
      console.log('Taxa de deslocamento de R$ 10,00 debitada automaticamente do cartão do passageiro.');
    } else {
      setPassengerDebt((prev) => prev + 10.0);
    }

    setActiveRide({
      ...activeRide,
      status: 'no_show_cancelled',
      noShowEvidence: evidence,
    });

    addToast({
      type: 'warning',
      title: 'Tempo Expirado (No-Show)',
      message: 'Cancelamento por no-show registrado. Taxa de deslocamento de R$ 10,00 aplicada com sucesso.',
      durationMs: 7000,
    });

    // Reset after 3 seconds so driver is free for next rides
    setTimeout(() => {
      setActiveRide(null);
      setIncomingRideForDriver(null);
    }, 3000);
  };

  // Track Social and Referral Share Action
  const handleShareTracked = (
    platform: 'whatsapp' | 'facebook' | 'instagram' | 'youtube' | 'email' | 'copy_link',
    referralCode: string
  ) => {
    const newEvent: ShareEvent = {
      id: `share-${Date.now()}`,
      platform,
      referralCode,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      userRole: currentRole,
    };
    setShareEvents((prev) => [newEvent, ...prev]);
  };

  // W-Bank transactions
  const deductFromWBank = (amount: number, description: string): boolean => {
    if (wBankBalance < amount) {
      alert('Saldo insuficiente no W-BANK para esta operação.');
      return false;
    }
    setWBankBalance((prev) => Math.max(0, prev - amount));
    setBankTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        type: 'debit',
        amount,
        title: 'Débito em Conta',
        description,
        date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        category: 'ride',
      },
      ...prev,
    ]);
    return true;
  };

  const creditToWBank = (amount: number, description: string) => {
    setWBankBalance((prev) => prev + amount);
    setBankTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        type: 'credit',
        amount,
        title: 'Crédito em Conta',
        description,
        date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        category: 'bonus',
      },
      ...prev,
    ]);
  };

  const handleAddFunds = (amount: number) => {
    creditToWBank(amount, 'Recarga de Saldo de Teste');
  };

  const handleTransfer = (amount: number, recipient: string): boolean => {
    return deductFromWBank(amount, `Transferência PIX para ${recipient}`);
  };

  // Master panel actions
  const handleTriggerTestDispatch = async () => {
    if (!userLocation) return;
    const sampleOrigin = currentAddress || {
      street: 'Avenida Epitácio Pessoa',
      number: '1500',
      neighborhood: 'Tambauzinho',
      city: 'João Pessoa',
      state: 'PB',
      formatted: 'Avenida Epitácio Pessoa, 1500',
      lat: userLocation.lat,
      lng: userLocation.lng,
    };

    const sampleDest: AddressDetails = {
      street: 'Avenida Cabo Branco',
      number: '2200',
      neighborhood: 'Cabo Branco',
      city: 'João Pessoa',
      state: 'PB',
      formatted: 'Avenida Cabo Branco, 2200 - Cabo Branco, João Pessoa - PB',
      lat: userLocation.lat - 0.015,
      lng: userLocation.lng + 0.02,
    };

    const routeCalc = await calculateRealRoute(
      { lat: sampleOrigin.lat, lng: sampleOrigin.lng },
      { lat: sampleDest.lat, lng: sampleDest.lng }
    );

    const testRide: RideRequest = {
      id: `ride-test-${Date.now()}`,
      passengerName: 'Maria Antônia (Teste Master)',
      passengerPhone: '(83) 99111-2233',
      origin: sampleOrigin,
      destination: sampleDest,
      category: 'w-carro',
      distanceKm: routeCalc.distanceKm,
      estimatedMinutes: routeCalc.estimatedMinutes,
      fare: routeCalc.fares['w-carro'] || 21.7,
      status: 'searching',
      createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      paymentMethod: 'cartao_automatico',
      routePoints: routeCalc.routePoints,
      overviewPolyline: routeCalc.overviewPolyline,
      routeSummary: routeCalc.summary,
    };

    addToast({
      type: 'ride_status',
      title: 'Despacho de Demonstração Master',
      message: 'Chamada de teste disparada para a rede de motoristas.',
      durationMs: 4500,
    });

    handleRequestRide(testRide);
  };

  const handleSpawnSimulatedDriver = (category: CategoryId) => {
    if (!userLocation) return;
    const newDrv: DriverData = {
      id: `drv-${Date.now()}`,
      name: category === 'w-bike' ? 'Ciclista W-BIKE Novo' : 'Motoboy W-MOTO Novo',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      phone: '(83) 98888-0000',
      rating: 5.0,
      totalTrips: 1,
      category,
      vehicleModel: category === 'w-bike' ? 'Bicicleta Urbana W' : 'Honda Fan 160',
      vehiclePlate: 'WDR-TEST',
      vehicleColor: 'Verde Pera',
      lat: userLocation.lat + (Math.random() - 0.5) * 0.01,
      lng: userLocation.lng + (Math.random() - 0.5) * 0.01,
      heading: 90,
      isOnline: true,
      isBusy: false,
      isFaceVerified: true,
      acceptsPassengers: true,
      acceptsDeliveries: true,
      accountStatus: 'active',
      inspectionStatus: 'approved',
      criminalBackgroundChecked: true,
      vehicleInspected: true,
    };

    setDrivers((prev) => [newDrv, ...prev]);
    audioService.playChime('notification');
    addToast({
      type: 'success',
      title: 'Motorista Homologado Inserido',
      message: `${newDrv.name} (${category.toUpperCase()}) adicionado ao mapa com vistoria aprovada.`,
      durationMs: 4000,
    });
  };

  const handleTriggerSOS = (event: SOSEvent) => {
    setSosEvents((prev) => [event, ...prev]);
    addToast({
      type: 'sos',
      title: '⚠️ ALERTA SOS EM ANDAMENTO',
      message: `Emergência acionada por ${event.userName} (${event.userRole.toUpperCase()}) em ${event.address}. Central notificada!`,
      durationMs: 9000,
    });
  };

  const handleResolveSOS = (id: string) => {
    setSosEvents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, resolved: true } : s))
    );
  };

  const handleLeadCaptured = (lead: LeadCapture) => {
    setCapturedLeads((prev) => [lead, ...prev]);
  };

  const handleSelectRole = (role: AppRole) => {
    if (role === 'master') {
      if (isMasterAuthenticated) {
        setCurrentRole('master');
      } else {
        setIsMasterAuthOpen(true);
      }
    } else {
      setCurrentRole(role);
    }
  };

  // Master CEO Administrative Privilege Handlers
  const handleAddDriver = (newDriver: DriverData) => {
    setDrivers((prev) => [newDriver, ...prev]);
  };

  const handleDeleteDriver = (driverId: string) => {
    setDrivers((prev) => prev.filter((d) => d.id !== driverId));
  };

  const handleUpdateDriverStatus = (driverId: string, status: DriverAccountStatus) => {
    setDriverAccountStatus(driverId, status);
    setDriverStatusMap((prev) => ({ ...prev, [driverId]: status }));
  };

  // CEO Chancela & Vistoria Actions
  const handleApproveDriverInspection = (driverId: string) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId
          ? {
              ...d,
              accountStatus: 'active' as const,
              inspectionStatus: 'approved' as const,
              vehicleInspected: true,
              criminalBackgroundChecked: true,
              isOnline: true,
            }
          : d
      )
    );
    handleUpdateDriverStatus(driverId, 'active');
  };

  const handleWarnDriver = (driverId: string, reason: string) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId
          ? {
              ...d,
              accountStatus: 'warning' as const,
            }
          : d
      )
    );
  };

  const handleRestDriver = (driverId: string) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId
          ? {
              ...d,
              accountStatus: 'resting' as const,
              isOnline: false,
            }
          : d
      )
    );
    handleUpdateDriverStatus(driverId, 'suspended');
  };

  const handleBanDriver = (driverId: string) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId
          ? {
              ...d,
              accountStatus: 'banned' as const,
              isOnline: false,
            }
          : d
      )
    );
    handleUpdateDriverStatus(driverId, 'banned');
  };

  // CEO Broadcast Center Handlers
  const handleSendBroadcastMessage = (
    title: string,
    message: string,
    channel: 'all' | 'drivers' | 'passengers',
    urgency: 'normal' | 'high' | 'urgent'
  ) => {
    const newBroadcast: BroadcastNotification = {
      id: `msg-${Date.now()}`,
      title,
      message,
      channel,
      urgency,
      sentAt: 'Agora',
      sender: 'CEO Central W-DRIVER',
      readByCount: 1,
    };
    setBroadcastMessages((prev) => [newBroadcast, ...prev]);

    addToast({
      type: 'broadcast',
      title: `Central W Drive: ${title}`,
      message,
      urgency,
      durationMs: urgency === 'urgent' ? 9000 : 6500,
    });
  };

  // CEO Commercial Ads Handlers
  const handleAddCommercialAd = (newAd: CommercialAd) => {
    setCommercialAds((prev) => [newAd, ...prev]);
    addToast({
      type: 'success',
      title: 'Anúncio Publicado!',
      message: `Campanha de "${newAd.partnerName}" inserida no carrossel de passageiros.`,
      durationMs: 4500,
    });
  };

  const handleToggleCommercialAd = (adId: string) => {
    setCommercialAds((prev) =>
      prev.map((ad) => (ad.id === adId ? { ...ad, isActive: !ad.isActive } : ad))
    );
  };

  const handleDeleteCommercialAd = (adId: string) => {
    setCommercialAds((prev) => prev.filter((ad) => ad.id !== adId));
  };

  // Internal In-App Chat Handler
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    const isDriverSender = currentRole === 'driver';
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      rideId: activeRide?.id || 'live-ride',
      senderRole: isDriverSender ? 'driver' : 'passenger',
      senderName: isDriverSender
        ? myDriverProfile.name
        : activeRide?.passengerName || 'Passageiro',
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };
    setChatMessages((prev) => [...prev, msg]);

    addToast({
      type: 'chat',
      title: isDriverSender ? 'Chat • Mensagem Enviada' : 'Chat com Motorista',
      message: `${isDriverSender ? 'Você' : msg.senderName}: "${text}"`,
      durationMs: 4000,
    });
  };

  const handleDeleteLead = (leadId: string) => {
    setCapturedLeads((prev) => prev.filter((l) => l.id !== leadId));
  };

  const handleUpdateLeadStatus = (leadId: string, status: 'active' | 'rejected' | 'pending_approval') => {
    setCapturedLeads((prev) =>
      prev.map((lead) => (lead.id === leadId ? { ...lead, status } : lead))
    );
    addToast({
      type: status === 'active' ? 'success' : status === 'rejected' ? 'warning' : 'info',
      title: status === 'active' ? 'Cadastro Aprovado pelo CEO!' : status === 'rejected' ? 'Cadastro Reprovado' : 'Status Atualizado',
      message: status === 'active'
        ? 'Acesso liberado no sistema W-DRIVER OFICIAL 3.0.'
        : status === 'rejected'
        ? 'Cadastro marcado para revisão / reenvio de documentos.'
        : 'Cadastro retornado para análise.',
      durationMs: 4000,
    });
  };

  const handleSavePlatformConfig = (cfg: PlatformConfig) => {
    savePlatformConfig(cfg);
    setPlatformConfig(cfg);
  };

  const handleLogoutMaster = () => {
    logoutMaster();
    setIsMasterAuthenticated(false);
    setCurrentRole('passenger');
  };

  const handleCancelRideByMaster = (rideId: string) => {
    setActiveRide(null);
    setIncomingRideForDriver(null);
    setActiveDriverPosition(null);
  };

  const handleResetTestData = () => {
    setWBankBalance(50.0);
    setActiveRide(null);
    setIncomingRideForDriver(null);
    setGlobalRoute(null);
    setRoutePoints([]);
    setSosEvents([]);
    setReferrals(INITIAL_REFERRALS);
    setDrivers(INITIAL_DRIVERS);
    setPassengerDebt(0);
    alert('Dados de teste restaurados com sucesso.');
  };

  // Global Route Calculation Function (Single Source of Truth)
  const handleCalculateRoute = async (
    orig: AddressDetails,
    dest: AddressDetails
  ): Promise<RouteCalculationResult> => {
    setIsCalculatingRoute(true);
    try {
      const res = await calculateRealRoute(
        { lat: orig.lat, lng: orig.lng },
        { lat: dest.lat, lng: dest.lng }
      );
      setGlobalRoute(res);
      setOriginAddress(orig);
      setDestinationAddress(dest);
      setRoutePoints(res.routePoints);
      return res;
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  const handleClearRoute = () => {
    setGlobalRoute(null);
    setRoutePoints([]);
    setDestinationAddress(null);
  };

  const handleRouteCalculated = (
    orig: AddressDetails,
    dest: AddressDetails,
    waypoints: Array<[number, number]>
  ) => {
    setOriginAddress(orig);
    setDestinationAddress(dest);
    setRoutePoints(waypoints);
  };

  const toggleAudio = () => {
    const next = !audioMuted;
    setAudioMuted(next);
    audioService.setMuted(next);
  };

  return (
    <div className="min-h-screen w-screen bg-[#07090d] flex items-center justify-center p-0 md:p-3 overflow-hidden select-none font-sans">
      {/* Mobile Wrapper Frame (max-width: 412px, height: 100vh, margin: 0 auto) */}
      <div className="w-full h-screen md:max-w-[412px] md:h-[850px] md:max-h-[96vh] md:rounded-[40px] md:border-[8px] md:border-[#181a20] md:shadow-[0_0_50px_rgba(0,0,0,0.85)] relative overflow-hidden bg-black flex flex-col">
        {/* CAMADA 0: Fullscreen Interactive Map */}
        <div className="absolute inset-0 w-full h-full z-0">
          <MapComponent
            userLocation={userLocation}
            origin={originAddress}
            destination={destinationAddress}
            drivers={drivers}
            selectedDriver={activeRide?.driver || null}
            routePoints={routePoints}
            globalRoute={globalRoute}
            isTrackingRide={!!activeRide && activeRide.status !== 'idle'}
            activeDriverPosition={activeDriverPosition}
            theme={effectiveTheme}
          />
        </div>

        {/* CAMADA 1: Floating Header (Logo, Hamburger Menu, Theme Switcher, Audio Toggle, SOS) */}
        <FloatingHeader
          currentRole={currentRole}
          onOpenDrawer={() => setIsSideDrawerOpen(true)}
          onOpenSOS={() => setIsSOSOpen(true)}
          audioMuted={audioMuted}
          onToggleAudio={toggleAudio}
          wBankBalance={wBankBalance}
          themePreference={themePreference}
          effectiveTheme={effectiveTheme}
          onToggleTheme={toggleTheme}
        />

        {/* CAMADA 2: Active Action Panels based on Role */}
        <div className="relative z-10 w-full h-full flex flex-col justify-end pointer-events-none">
          {currentRole === 'passenger' && (
            <PassengerView
              userLocation={userLocation}
              currentAddress={currentAddress}
              drivers={drivers}
              onUseCurrentLocation={handleUseCurrentLocation}
              onRequestRide={handleRequestRide}
              activeRide={activeRide}
              onCancelRide={handleCancelRide}
              onPayWithWBank={deductFromWBank}
              wBankBalance={wBankBalance}
              onOpenSOS={() => setIsSOSOpen(true)}
              onRouteCalculated={handleRouteCalculated}
              saveCardForAutoPay={saveCardForAutoPay}
              onToggleSaveCard={setSaveCardForAutoPay}
              passengerDebt={passengerDebt}
              waitingSecondsRemaining={waitingSecondsRemaining}
              globalRoute={globalRoute}
              isCalculatingRoute={isCalculatingRoute}
              onCalculateRoute={handleCalculateRoute}
              onClearRoute={handleClearRoute}
              commercialAds={commercialAds}
              onSendMessage={handleSendMessage}
              chatMessages={chatMessages}
            />
          )}

          {currentRole === 'driver' && (
            <DriverView
              driverProfile={myDriverProfile}
              onUpdateDriverCategory={(cat) =>
                setMyDriverProfile((prev) => ({ ...prev, category: cat }))
              }
              isOnline={driverIsOnline}
              onToggleOnline={() => setDriverIsOnline(!driverIsOnline)}
              incomingRide={incomingRideForDriver}
              onAcceptRide={handleDriverAcceptRide}
              onDeclineRide={handleDriverDeclineRide}
              activeRide={activeRide}
              onUpdateRideStatus={handleUpdateRideStatus}
              onOpenSOS={() => setIsSOSOpen(true)}
              onAddEarnings={(amt, desc) => creditToWBank(amt, desc)}
              onNoShowCompleted={handleNoShowCompleted}
              waitingSecondsRemaining={waitingSecondsRemaining}
              onSetWaitingSecondsRemaining={setWaitingSecondsRemaining}
              globalRoute={globalRoute}
              isTablet={isTablet || effectiveDeviceType === 'tablet'}
              onSendMessage={handleSendMessage}
              chatMessages={chatMessages}
            />
          )}

          {currentRole === 'master' && (
            <div className="pointer-events-auto absolute inset-0 z-30 bg-black/95 overflow-y-auto">
              <MasterPanel
                drivers={drivers}
                driverStatusMap={driverStatusMap}
                activeRides={activeRide ? [activeRide] : []}
                sosEvents={sosEvents}
                capturedLeads={capturedLeads}
                referrals={referrals}
                shareEvents={shareEvents}
                commercialAds={commercialAds}
                broadcastMessages={broadcastMessages}
                heatmapZones={heatmapZones}
                platformConfig={platformConfig}
                onSavePlatformConfig={handleSavePlatformConfig}
                onAddDriver={handleAddDriver}
                onDeleteDriver={handleDeleteDriver}
                onUpdateDriverStatus={handleUpdateDriverStatus}
                onApproveDriverInspection={handleApproveDriverInspection}
                onWarnDriver={handleWarnDriver}
                onRestDriver={handleRestDriver}
                onBanDriver={handleBanDriver}
                onDeleteLead={handleDeleteLead}
                onUpdateLeadStatus={handleUpdateLeadStatus}
                onCancelRideByMaster={handleCancelRideByMaster}
                onTriggerTestDispatch={handleTriggerTestDispatch}
                onSpawnSimulatedDriver={handleSpawnSimulatedDriver}
                onResolveSOS={handleResolveSOS}
                onResetTestData={handleResetTestData}
                onSwitchToPassenger={() => setCurrentRole('passenger')}
                onSwitchToDriver={() => setCurrentRole('driver')}
                onLogoutMaster={handleLogoutMaster}
                onSendBroadcastMessage={handleSendBroadcastMessage}
                onAddCommercialAd={handleAddCommercialAd}
                onToggleCommercialAd={handleToggleCommercialAd}
                onDeleteCommercialAd={handleDeleteCommercialAd}
                deviceType={effectiveDeviceType}
              />
            </div>
          )}

          {currentRole === 'wbank' && (
            <div className="pointer-events-auto absolute inset-0 z-30 bg-black/95 overflow-y-auto p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-black text-white uppercase">W-BANK Carteira Digital</h2>
                <button
                  onClick={() => setCurrentRole('passenger')}
                  className="px-3 py-1 bg-zinc-800 text-xs text-white rounded-lg hover:bg-zinc-700"
                >
                  Voltar ao Mapa
                </button>
              </div>
              <WBankView
                balance={wBankBalance}
                transactions={bankTransactions}
                onAddFunds={handleAddFunds}
                onTransfer={handleTransfer}
              />
            </div>
          )}
        </div>

        {/* CAMADA 3: SideDrawer (Gaveta Lateral) */}
        <SideDrawer
          isOpen={isSideDrawerOpen}
          onClose={() => setIsSideDrawerOpen(false)}
          currentRole={currentRole}
          onSelectRole={(role) => {
            handleSelectRole(role);
            setIsSideDrawerOpen(false);
          }}
          onOpenSOS={() => {
            setIsSideDrawerOpen(false);
            setIsSOSOpen(true);
          }}
          onOpenReferrals={() => {
            setIsSideDrawerOpen(false);
            setIsReferralOpen(true);
          }}
          onOpenWorkWithUs={() => {
            setIsSideDrawerOpen(false);
            setLeadModalInitialMode('work');
            setIsLeadModalOpen(true);
          }}
          onOpenWantToTravel={() => {
            setIsSideDrawerOpen(false);
            setLeadModalInitialMode('passenger');
            setIsLeadModalOpen(true);
          }}
          onOpenSocialNetworks={() => {
            setIsSideDrawerOpen(false);
            setIsSocialModalOpen(true);
          }}
          onOpenProfile={() => {
            setIsSideDrawerOpen(false);
            setIsSafetyAuthOpen(true);
          }}
          onOpenMasterAuth={() => {
            setIsSideDrawerOpen(false);
            setIsMasterAuthOpen(true);
          }}
          onOpenPartners={() => {
            setIsSideDrawerOpen(false);
            setIsPartnersModalOpen(true);
          }}
          onOpenWelcome={() => {
            setIsSideDrawerOpen(false);
            setIsWelcomeOpen(true);
          }}
          onOpenFounderBio={() => {
            setIsSideDrawerOpen(false);
            setIsFounderBioOpen(true);
          }}
          onReplaySplash={() => {
            setIsSideDrawerOpen(false);
            setShowSplashScreen(true);
          }}
          isMasterAuthenticated={isMasterAuthenticated}
          wBankBalance={wBankBalance}
          commercialAds={commercialAds}
          themePreference={themePreference}
          effectiveTheme={effectiveTheme}
          timeOfDayInfo={timeOfDayInfo}
          onSelectThemePreference={setThemePreference}
        />
      </div>

      {/* Official Partners & Local Commercial Ads Modal (Aberto exclusivamente pelos 3 tracinhos) */}
      <OfficialPartnersModal
        isOpen={isPartnersModalOpen}
        onClose={() => setIsPartnersModalOpen(false)}
        ads={commercialAds}
        onSelectPartnerDestination={handleSelectPartnerDestination}
        onOpenPartnerSignup={() => {
          setLeadModalInitialMode('work');
          setIsLeadModalOpen(true);
        }}
      />

      {/* Required GPS Access Permission Modal */}
      {showGpsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#141414] border border-[#A8E63A]/40 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-[#A8E63A]/20 border border-[#A8E63A] flex items-center justify-center mx-auto text-[#A8E63A]">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-white">Acesso ao GPS Necessário</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              "Para utilizar a W-DRIVER é necessário permitir acesso à sua localização."
            </p>
            <button
              onClick={() => {
                setShowGpsModal(false);
                initGPS();
              }}
              className="w-full py-3 rounded-xl bg-[#A8E63A] hover:bg-[#95d130] text-black font-black text-xs uppercase transition shadow-lg"
            >
              Permitir e Ativar GPS
            </button>
          </div>
        </div>
      )}

      {/* SOS W-URGÊNCIA Modal */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        userCoordinates={userLocation}
        currentAddressString={currentAddress?.formatted || 'Localização GPS Ativa'}
        onTriggerSOS={handleTriggerSOS}
      />

      {/* Referral Program Modal (Código W0701 & Multiplataforma) */}
      <ReferralModal
        isOpen={isReferralOpen}
        onClose={() => setIsReferralOpen(false)}
        referrals={referrals}
        referralCode={activeReferralCode || 'W0701'}
        userRoleLabel={
          currentRole === 'master'
            ? 'Master CEO'
            : currentRole === 'driver'
            ? 'Motorista W-CARRO'
            : currentRole === 'wbank'
            ? 'W-BANK'
            : 'Passageiro'
        }
        onShareTracked={handleShareTracked}
      />

      {/* Social Networks Modal (REDES OFICIAIS W-DRIVER) */}
      <SocialNetworksModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
        onTrackAction={(network) => {
          handleShareTracked(network as any, activeReferralCode || 'W0701');
        }}
      />

      {/* Lead & Partner Acquisition Modal (Trabalhe Conosco & Quero Viajar) */}
      <CustomerAcquisitionModal
        isOpen={isLeadModalOpen}
        initialMode={leadModalInitialMode}
        initialReferralCode={activeReferralCode || 'W0701'}
        onClose={() => setIsLeadModalOpen(false)}
        onLeadCaptured={handleLeadCaptured}
      />

      {/* KYC Safety & Profile Modal */}
      <SafetyAuthModal
        isOpen={isSafetyAuthOpen}
        onClose={() => setIsSafetyAuthOpen(false)}
        onCompleted={(role, data) => {
          console.log('Profile updated:', role, data);
        }}
      />

      {/* Master CEO Exclusive Authentication Modal */}
      <MasterAuthModal
        isOpen={isMasterAuthOpen}
        onClose={() => setIsMasterAuthOpen(false)}
        onAuthenticated={() => {
          setIsMasterAuthenticated(true);
          setCurrentRole('master');
        }}
      />

      {/* Welcome Screen & Profile Selection Onboarding Flow */}
      <WelcomeScreen
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        onSelectRole={(role) => {
          setCurrentRole(role);
          setIsWelcomeOpen(false);
          addToast({
            type: 'success',
            title: `Modo ${role === 'driver' ? 'Motorista' : 'Passageiro'} Ativo`,
            message: `Você está conectado ao ambiente oficial W-DRIVER 3.0.`,
          });
        }}
        onLeadCaptured={handleLeadCaptured}
        onOpenMasterAuth={() => setIsMasterAuthOpen(true)}
      />

      {/* Official Opening Splash Screen (2.5s Auto Fade-in & Highway Flow) */}
      {showSplashScreen && (
        <SplashScreen
          onFinish={handleSplashScreenFinish}
          durationMs={2500}
        />
      )}

      {/* Founder Bio Story Modal (Quem trabalha desde 2009) */}
      <FounderBioModal
        isOpen={isFounderBioOpen}
        onClose={() => setIsFounderBioOpen(false)}
      />

      {/* Global Real-Time Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
