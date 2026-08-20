export type AppRole = 'passenger' | 'driver' | 'master' | 'wbank';

export type CategoryId = 'w-bike' | 'w-moto' | 'w-moto-entrega' | 'w-carro' | 'w-taxi' | 'w-elas';

export type RideModality = 'comum' | 'prime' | 'contrato';

export type DeliveryItemType = 'passageiro' | 'documentos' | 'encomendas' | 'compras' | 'autorizadas_lei';

export type AccountStatus = 'active' | 'pending_approval' | 'resting' | 'warning' | 'banned';

export interface CommissionBreakdown {
  totalFare: number;
  centralCommission: number; // R$ 3, 7, 30, 40 ou teto de 70
  driverEarnings: number;
  cashbackReserve: number; // R$ 0,50 para cashback de R$ 5 a cada 10 corridas
  isPeakHour: boolean;
  peakBonusReserve: number; // R$ 0,50 para pico
  appliedTierDescription: string;
}

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  badge: string;
  icon: string;
  description: string;
  basePrice: number; // R$ for first 1km
  perKmPrice: number; // R$ per extra km
  capacity: string;
  etaMinutesBase: number;
  allowsDeliveries: boolean;
  isTaximeterOnly?: boolean;
  modalities?: RideModality[];
}

export interface AddressDetails {
  street: string;
  number?: string;
  neighborhood: string;
  city: string;
  state: string;
  cep?: string;
  formatted: string;
  lat: number;
  lng: number;
}

export type RideStatus =
  | 'idle'
  | 'searching'
  | 'accepted'
  | 'driver_arrived'
  | 'waiting_passenger'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show_cancelled';

export interface DriverData {
  id: string;
  name: string;
  photoUrl: string;
  isFaceVerified: boolean;
  phone: string;
  rating: number;
  totalTrips: number;
  category: CategoryId;
  vehicleModel: string;
  vehiclePlate: string;
  vehicleColor: string;
  lat: number;
  lng: number;
  heading: number;
  isOnline: boolean;
  isBusy: boolean;
  acceptsPassengers?: boolean;
  acceptsDeliveries?: boolean;
  // CEO Approval & Inspection Data
  accountStatus: AccountStatus;
  inspectionStatus: 'approved' | 'pending' | 'scheduled' | 'rejected';
  inspectionDate?: string;
  criminalBackgroundChecked?: boolean;
  vehicleInspected?: boolean;
  warningNotes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  photoUrl: string;
  isFaceVerified: boolean;
  role: 'passenger' | 'driver' | 'biker' | 'motoboy' | 'taxi';
  accountStatus: AccountStatus;
  totalTrips: number;
  rating: number;
  outstandingDebt: number; // Saldo devedor
  saveCardForAutoPay: boolean;
  cardDetails?: {
    cardNumber: string;
    holderName: string;
    expiry: string;
    last4: string;
    brand: string;
  };
}

export interface NoShowEvidence {
  mediaUrl: string;
  mediaType: 'photo' | 'video';
  capturedAt: string;
  notes: string;
  displacementFee?: number; // R$ 10,00
}

export interface RouteCalculationResult {
  distanceKm: number;
  estimatedMinutes: number;
  routePoints: Array<[number, number]>;
  overviewPolyline?: string;
  fares: Record<string, number>;
  etas: Record<string, number>;
  summary: string;
  source: 'google_maps' | 'osrm_driving' | 'urban_road_network';
}

export interface ChatMessage {
  id: string;
  rideId: string;
  senderRole: 'passenger' | 'driver' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface RideRequest {
  id: string;
  passengerName: string;
  passengerPhone: string;
  passengerPhoto?: string;
  passengerRating?: number;
  passengerTotalTrips?: number;
  passengerDebt?: number;
  origin: AddressDetails;
  destination: AddressDetails;
  category: CategoryId;
  modality?: RideModality; // 'comum' | 'prime' | 'contrato'
  distanceKm: number;
  estimatedMinutes: number;
  fare: number; // For W-TAXI: base R$ 10,00 until 1km, then taximeter
  isTaximeterOnly?: boolean;
  status: RideStatus;
  driverId?: string;
  driver?: DriverData;
  createdAt: string;
  paymentMethod: 'wbank' | 'cartao_automatico' | 'pix' | 'dinheiro' | 'cartao_maquininha';
  isDelivery?: boolean;
  deliveryType?: DeliveryItemType;
  deliveryNotes?: string;
  companyCnpj?: string; // Para contratos PJ
  waitingStartTime?: number; // timestamp when driver clicked CHEGUEI AO LOCAL
  waitingSecondsRemaining?: number; // 180s countdown
  noShowEvidence?: NoShowEvidence;
  autoDebited?: boolean;
  routePoints?: Array<[number, number]>;
  overviewPolyline?: string;
  routeSummary?: string;
  chatMessages?: ChatMessage[];
  commissionBreakdown?: CommissionBreakdown;
  audioProtectionActive?: boolean;
  isMutualBlocked?: boolean;
}

export interface BankTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  title: string;
  description: string;
  date: string;
  category: 'ride' | 'bonus' | 'transfer' | 'topup' | 'debt_charge';
}

export interface ReferralRecord {
  id: string;
  referrerCode: string;
  referredName: string;
  referredType: 'passenger' | 'driver' | 'biker' | 'motoboy';
  completedRides: number;
  targetRides: number; // 5
  bonusEarned: number; // R$ 5,00
  isPaid: boolean;
  date: string;
}

export interface SOSEvent {
  id: string;
  timestamp: string;
  userRole: string;
  userName: string;
  userPhone: string;
  coordinates: { lat: number; lng: number };
  address: string;
  resolved: boolean;
  audioRecordingActive?: boolean;
  policeContacted?: boolean;
}

export interface LeadCapture {
  id: string;
  name: string;
  email: string;
  phone: string; // Exact phone entered by user
  cpf?: string;
  cnhNumber?: string;
  referralCodeUsed?: string;
  companyCnpj?: string;
  contractNotes?: string;
  city: string;
  birthState?: string; // Estado de nascimento / Naturalidade
  residenceState?: string; // Estado onde reside atualmente
  isOutOfState?: boolean; // Se nasceu em estado diferente do que reside
  criminalCertFederal?: boolean; // Certidão Federal Gov.br
  criminalCertOriginState?: boolean; // Certidão Estadual do estado onde nasceu
  criminalCertResidenceState?: boolean; // Certidão Estadual do estado onde reside
  crlvAttached?: boolean; // Foto do CRLV do ano
  cnhEarAttached?: boolean; // CNH com EAR
  residenceProofAttached?: boolean; // Comprovante de residência recente
  profilePhotoAttached?: boolean; // Foto de perfil sem óculos
  // 2ª Etapa: Coleta e Confirmação Presencial de Dados
  secondStageMethod?: 'central' | 'residence'; // 'central' (Na Central W-DRIVER) ou 'residence' (Visita Presencial na Residência)
  secondStageAddress?: string; // Endereço residencial para envio do Representante Legal
  secondStageDate?: string; // Data/Horário do agendamento
  secondStageRepresentative?: string; // Nome do Representante Legal enviado pela Central
  secondStageStatus?: 'pending_scheduling' | 'scheduled' | 'data_collected' | 'verified_approved'; // Status da 2ª Etapa
  type: 'passenger' | 'driver' | 'biker' | 'motoboy' | 'taxi';
  vehicleDetails?: string;
  status: AccountStatus;
  createdAt: string;
}

export interface MutualBlock {
  id: string;
  blockerId: string;
  blockedId: string;
  blockerRole: 'passenger' | 'driver';
  reason: string;
  createdAt: string;
}

export interface ShareEvent {
  id: string;
  platform: 'whatsapp' | 'facebook' | 'instagram' | 'youtube' | 'email' | 'copy_link';
  referralCode: string;
  timestamp: string;
  userRole: AppRole;
}

export interface CommercialAd {
  id: string;
  partnerName: string; // Ex: "Espetinho do João", "Pizzaria do Maurício"
  segment: string; // Ex: "Gastronomia", "Automotivo", "Farmácia"
  categoryTag?: 'espetinho' | 'sorveteria' | 'farmacia' | 'hamburgueria' | 'pizzaria' | 'geral';
  title: string;
  description: string;
  bannerUrl: string;
  actionText: string;
  actionUrl?: string;
  discountCoupon?: string;
  address?: string;
  phoneWhatsApp?: string;
  rating?: number;
  coordinates?: { lat: number; lng: number };
  displayDurationSeconds: number; // e.g. 6s
  isActive: boolean;
  position: 'top' | 'bottom' | 'both';
  viewsCount: number;
  clicksCount: number;
}

export interface BroadcastNotification {
  id: string;
  title: string;
  message: string;
  channel: 'all' | 'drivers' | 'passengers';
  urgency: 'normal' | 'high' | 'urgent';
  sentAt: string;
  sender: string;
  readByCount: number;
}

export interface DemandZoneHeatmap {
  id: string;
  zoneName: string;
  city: string;
  neighborhood: string;
  heatLevel: 'extreme' | 'high' | 'moderate' | 'low';
  score: number; // 0-100
  activeRequests: number;
  availableDrivers: number;
  peakHours: string;
  centerCoordinates: { lat: number; lng: number };
}

export interface ToastItem {
  id: string;
  type: 'broadcast' | 'ride_status' | 'chat' | 'success' | 'warning' | 'info' | 'sos';
  title: string;
  message: string;
  senderName?: string;
  timestamp?: string;
  durationMs?: number; // default 5000ms
  actionLabel?: string;
  onAction?: () => void;
  urgency?: 'normal' | 'high' | 'urgent';
}

export type MapLayerStyle = 'dark' | 'streets' | 'satellite' | 'hybrid';
