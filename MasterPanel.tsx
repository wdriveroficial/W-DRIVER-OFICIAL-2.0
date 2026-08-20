import React, { useState } from 'react';
import {
  CategoryId,
  DriverData,
  LeadCapture,
  ReferralRecord,
  RideRequest,
  ShareEvent,
  SOSEvent,
  CommercialAd,
  BroadcastNotification,
  DemandZoneHeatmap,
} from '../types';
import { PlatformConfig } from '../services/masterAuthService';
import { CATEGORIES } from '../constants';
import { Logo } from './Logo';
import {
  Shield,
  Users,
  Car,
  Activity,
  AlertTriangle,
  Send,
  Plus,
  Trash2,
  Lock,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  Radio,
  Flame,
  Search,
  Tag,
  Sliders,
  DollarSign,
  PhoneCall,
  Save,
  Check,
  FileCheck,
  Ban,
  AlertOctagon,
  Moon,
  MessageSquare,
  Volume2,
  Share2,
  Copy,
  ExternalLink,
  QrCode,
  Gift,
  HelpCircle,
  Briefcase,
  UserPlus,
  X,
  ChevronRight,
  ShieldCheck,
  Eye,
  Power,
  Play,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SupportTicket {
  id: string;
  userName: string;
  userRole: 'passageiro' | 'motorista';
  subject: string;
  message: string;
  date: string;
  status: 'aberto' | 'em_analise' | 'resolvido';
  response?: string;
}

interface MasterPanelProps {
  drivers: DriverData[];
  driverStatusMap: Record<string, 'active' | 'suspended' | 'banned'>;
  activeRides: RideRequest[];
  sosEvents: SOSEvent[];
  capturedLeads: LeadCapture[];
  referrals: ReferralRecord[];
  shareEvents: ShareEvent[];
  commercialAds: CommercialAd[];
  broadcastMessages: BroadcastNotification[];
  heatmapZones: DemandZoneHeatmap[];
  platformConfig: PlatformConfig;
  onSavePlatformConfig: (config: PlatformConfig) => void;
  onAddDriver: (newDriver: DriverData) => void;
  onDeleteDriver: (driverId: string) => void;
  onUpdateDriverStatus: (driverId: string, status: 'active' | 'suspended' | 'banned') => void;
  onApproveDriverInspection: (driverId: string) => void;
  onWarnDriver: (driverId: string, reason: string) => void;
  onRestDriver: (driverId: string) => void;
  onBanDriver: (driverId: string) => void;
  onDeleteLead: (leadId: string) => void;
  onUpdateLeadStatus?: (leadId: string, status: 'active' | 'rejected' | 'pending_approval') => void;
  onCancelRideByMaster: (rideId: string) => void;
  onTriggerTestDispatch: () => void;
  onSpawnSimulatedDriver: (category: CategoryId) => void;
  onResolveSOS: (id: string) => void;
  onResetTestData: () => void;
  onSwitchToPassenger: () => void;
  onSwitchToDriver: () => void;
  onLogoutMaster: () => void;
  onSendBroadcastMessage: (
    title: string,
    message: string,
    channel: 'all' | 'drivers' | 'passengers',
    urgency: 'normal' | 'high' | 'urgent'
  ) => void;
  onAddCommercialAd: (newAd: CommercialAd) => void;
  onToggleCommercialAd: (adId: string) => void;
  onDeleteCommercialAd: (adId: string) => void;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
}

export const MasterPanel: React.FC<MasterPanelProps> = ({
  drivers,
  driverStatusMap,
  activeRides,
  sosEvents,
  capturedLeads,
  referrals,
  shareEvents,
  commercialAds,
  broadcastMessages,
  heatmapZones,
  platformConfig,
  onSavePlatformConfig,
  onAddDriver,
  onDeleteDriver,
  onUpdateDriverStatus,
  onApproveDriverInspection,
  onWarnDriver,
  onRestDriver,
  onBanDriver,
  onDeleteLead,
  onUpdateLeadStatus,
  onCancelRideByMaster,
  onTriggerTestDispatch,
  onSpawnSimulatedDriver,
  onResolveSOS,
  onResetTestData,
  onSwitchToPassenger,
  onSwitchToDriver,
  onLogoutMaster,
  onSendBroadcastMessage,
  onAddCommercialAd,
  onToggleCommercialAd,
  onDeleteCommercialAd,
  deviceType = 'desktop',
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'leads_approval' | 'inspections' | 'ads_control' | 'crm' | 'broadcast' | 'heatmap' | 'sandbox'
  >('leads_approval');

  // Leads Approval Filter & Search States
  const [leadCategoryFilter, setLeadCategoryFilter] = useState<'all' | 'passenger' | 'driver' | 'contract'>('all');
  const [leadStatusFilter, setLeadStatusFilter] = useState<'all' | 'pending_approval' | 'active' | 'rejected'>('all');
  const [leadSearchQuery, setLeadSearchQuery] = useState<string>('');

  // Mode Toggle (Modo Gestão vs. Modo Demonstração)
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Invite / Direct Links Modal State
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Commercial Ad Form / Modal State
  const [showNewAdModal, setShowNewAdModal] = useState<boolean>(false);
  const [newAdPartnerName, setNewAdPartnerName] = useState<string>('');
  const [newAdSegment, setNewAdSegment] = useState<string>('Comércio Local');
  const [newAdTitle, setNewAdTitle] = useState<string>('');
  const [newAdDescription, setNewAdDescription] = useState<string>('');
  const [newAdBannerUrl, setNewAdBannerUrl] = useState<string>('');
  const [newAdActionText, setNewAdActionText] = useState<string>('Ver Promoção');
  const [newAdCoupon, setNewAdCoupon] = useState<string>('');
  const [newAdDuration, setNewAdDuration] = useState<number>(6);

  // Broadcast Form State
  const [bcTitle, setBcTitle] = useState('');
  const [bcMessage, setBcMessage] = useState('');
  const [bcChannel, setBcChannel] = useState<'all' | 'drivers' | 'passengers'>('all');
  const [bcUrgency, setBcUrgency] = useState<'normal' | 'high' | 'urgent'>('normal');

  // SAC / Support CRM Tickets State
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    {
      id: 'ticket-101',
      userName: 'Marcos Vinicius (Passageiro)',
      userRole: 'passageiro',
      subject: 'Dúvida sobre Cupom W0701',
      message: 'Olá, indiquei 3 amigos e gostaria de saber quando o crédito do W-Bank é liberado.',
      date: 'Hoje às 10:45',
      status: 'aberto',
    },
    {
      id: 'ticket-102',
      userName: 'Cláudio Ferreira (Motorista)',
      userRole: 'motorista',
      subject: 'Agendamento de Vistoria Presencial',
      message: 'Enviei os documentos do Corolla Cross e gostaria de confirmar a vistoria para amanhã às 14h.',
      date: 'Hoje às 09:20',
      status: 'em_analise',
      response: 'Vistoria pré-agendada no posto oficial W Drive Centro.',
    },
    {
      id: 'ticket-103',
      userName: 'Juliana Paiva (Passageira)',
      userRole: 'passageiro',
      subject: 'Elogio Categoria W-Elas',
      message: 'Excelente atendimento da motorista Ana Paula! Carro impecável e muito seguro.',
      date: 'Ontem às 18:30',
      status: 'resolvido',
      response: 'Agradecemos o feedback! Motorista bonificada com estrelas VIP.',
    },
  ]);

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState<string>('');

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bcTitle.trim() || !bcMessage.trim()) return;
    onSendBroadcastMessage(bcTitle.trim(), bcMessage.trim(), bcChannel, bcUrgency);
    setBcTitle('');
    setBcMessage('');
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleCopyLink = (url: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(key);
      setTimeout(() => setCopiedLink(null), 2500);
    }
  };

  const handleShareWhatsApp = (text: string) => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handleReplyTicket = (ticketId: string) => {
    if (!ticketReplyText.trim()) return;
    setSupportTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: 'resolvido', response: ticketReplyText.trim() }
          : t
      )
    );
    setSelectedTicket(null);
    setTicketReplyText('');
    confetti({ particleCount: 40, spread: 50 });
  };

  const handleCreateAdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdPartnerName.trim() || !newAdTitle.trim()) return;

    const newAd: CommercialAd = {
      id: `ad-${Date.now()}`,
      partnerName: newAdPartnerName.trim(),
      segment: newAdSegment.trim() || 'Comércio Local',
      title: newAdTitle.trim(),
      description:
        newAdDescription.trim() || 'Desconto exclusivo para usuários W Drive.',
      bannerUrl:
        newAdBannerUrl.trim() ||
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
      actionText: newAdActionText.trim() || 'Aproveitar Cupom',
      discountCoupon: newAdCoupon.trim() || undefined,
      displayDurationSeconds: newAdDuration || 6,
      isActive: true,
      position: 'both',
      viewsCount: 0,
      clicksCount: 0,
    };

    onAddCommercialAd(newAd);
    setShowNewAdModal(false);
    setNewAdPartnerName('');
    setNewAdTitle('');
    setNewAdDescription('');
    setNewAdBannerUrl('');
    setNewAdCoupon('');
    confetti({ particleCount: 60, spread: 70 });
  };

  const pendingInspections = drivers.filter(
    (d) =>
      d.accountStatus === 'pending_approval' ||
      d.inspectionStatus === 'pending' ||
      d.inspectionStatus === 'scheduled'
  );

  const driverRegistrationUrl = `${window.location.origin}/?role=driver&workWithUs=true&ref=W0701`;
  const passengerRegistrationUrl = `${window.location.origin}/?role=passenger&coupon=W0701&ref=W0701`;

  return (
    <div className="w-full h-full flex flex-col p-3 sm:p-4 text-white overflow-y-auto select-none font-sans">
      {/* 1. MASTER CEO HEADER */}
      <div className="bg-[#0c0e12] border border-zinc-800 rounded-3xl p-3.5 shadow-2xl backdrop-blur-md mb-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-black border border-[#A8E63A] flex items-center justify-center shadow-[0_0_12px_rgba(168,230,58,0.35)]">
              <Shield className="w-4 h-4 text-[#A8E63A]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs font-black text-white uppercase tracking-wider">
                  W DRIVE 3.0
                </h1>
                <span className="px-1.5 py-0.2 rounded-full bg-[#A8E63A] text-black font-black text-[8px] uppercase">
                  CEO
                </span>
              </div>
              <p className="text-[9px] text-zinc-400">
                Central de Comando & Auditoria Global
              </p>
            </div>
          </div>

          {/* Mode Switcher Toggle: Gestão vs. Demonstração */}
          <div className="flex items-center bg-black/80 p-0.5 rounded-xl border border-zinc-800">
            <button
              onClick={() => setIsDemoMode(false)}
              className={`px-2 py-0.5 rounded-lg text-[9px] font-bold transition ${
                !isDemoMode
                  ? 'bg-[#A8E63A] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Gestão
            </button>
            <button
              onClick={() => setIsDemoMode(true)}
              className={`px-2 py-0.5 rounded-lg text-[9px] font-bold transition ${
                isDemoMode
                  ? 'bg-cyan-400 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Demonstração
            </button>
          </div>
        </div>

        {/* Real-Time Financial & Fleet Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 bg-black/60 p-2 rounded-2xl border border-zinc-800/80">
          <div>
            <span className="text-[8px] text-zinc-400 font-bold uppercase block">Faturamento Hoje</span>
            <span className="text-xs font-black text-[#A8E63A]">R$ 840,00</span>
          </div>
          <div className="border-x border-zinc-800/80 px-2">
            <span className="text-[8px] text-zinc-400 font-bold uppercase block">Mês Atual</span>
            <span className="text-xs font-black text-white">R$ 14.850,00</span>
          </div>
          <div className="text-right">
            <span className="text-[8px] text-zinc-400 font-bold uppercase block">Frota Ativa</span>
            <span className="text-xs font-black text-cyan-400">
              {drivers.filter((d) => d.isOnline).length} / {drivers.length}
            </span>
          </div>
        </div>

        {/* Direct Action Buttons: Invite/Links & Fast Role Switches */}
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          <button
            onClick={() => setShowShareModal(true)}
            className="flex-1 py-1.5 px-2.5 rounded-xl bg-[#A8E63A] hover:bg-[#95d130] text-black text-[11px] font-black flex items-center justify-center gap-1 shadow-lg transition active:scale-95"
            id="btn-master-invite"
          >
            <Share2 className="w-3 h-3" />
            <span>Convidar / Indicar Links</span>
          </button>

          {/* MODO TRABALHO / OPERADOR DO CEO */}
          <button
            onClick={onSwitchToDriver}
            className="py-1.5 px-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-[10px] font-black text-emerald-300 hover:bg-emerald-900/60 transition flex items-center gap-1"
            title="Ativar modo de condução e aceitar corridas no seu veículo"
          >
            <Car className="w-3 h-3" />
            <span>Modo Operador</span>
          </button>

          <button
            onClick={onSwitchToPassenger}
            className="py-1.5 px-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-[10px] font-bold text-zinc-300 transition"
          >
            Passageiro
          </button>

          <button
            onClick={onLogoutMaster}
            className="py-1.5 px-2 rounded-xl bg-red-950/40 border border-red-500/30 text-[10px] font-bold text-red-300 hover:bg-red-900/60 transition"
          >
            Sair
          </button>
        </div>
      </div>

      {/* 2. MASTER NAVIGATION TABS */}
      {(() => {
        const pendingLeadsCount = capturedLeads.filter(
          (l) => l.status === 'pending_approval' || !l.status
        ).length;

        const filteredLeads = capturedLeads.filter((lead) => {
          // Category filter
          if (leadCategoryFilter === 'passenger' && lead.type !== 'passenger') return false;
          if (leadCategoryFilter === 'driver' && (lead.type === 'passenger' || lead.companyCnpj)) return false;
          if (leadCategoryFilter === 'contract' && !lead.companyCnpj && !lead.contractNotes) return false;

          // Status filter
          const currentStatus = lead.status || 'pending_approval';
          if (leadStatusFilter !== 'all' && currentStatus !== leadStatusFilter) return false;

          // Search query
          if (leadSearchQuery.trim()) {
            const q = leadSearchQuery.toLowerCase();
            const matchName = lead.name.toLowerCase().includes(q);
            const matchPhone = lead.phone.includes(q);
            const matchCpf = lead.cpf?.toLowerCase().includes(q);
            const matchCnpj = lead.companyCnpj?.toLowerCase().includes(q);
            const matchVehicle = lead.vehicleDetails?.toLowerCase().includes(q);
            if (!matchName && !matchPhone && !matchCpf && !matchCnpj && !matchVehicle) return false;
          }

          return true;
        });

        return (
          <>
            <div className="flex items-center gap-1 bg-[#0e1116] p-1 rounded-2xl border border-zinc-800 mb-3 overflow-x-auto no-scrollbar">
              {[
                {
                  id: 'leads_approval',
                  label: `Cadastros & Aprovações (${pendingLeadsCount})`,
                  icon: UserPlus,
                  alert: pendingLeadsCount > 0,
                },
                { id: 'overview', label: 'Gestão de Frota', icon: Users },
                { id: 'ads_control', label: `Controle de Parceiros (${commercialAds.length})`, icon: Sparkles },
                {
                  id: 'inspections',
                  label: `Vistoria (${pendingInspections.length})`,
                  icon: FileCheck,
                  alert: pendingInspections.length > 0,
                },
                { id: 'crm', label: 'SAC & Reclamações', icon: MessageSquare },
                { id: 'broadcast', label: 'Broadcast', icon: Radio },
                { id: 'heatmap', label: 'Mapa de Calor', icon: Flame },
                { id: 'sandbox', label: 'Demonstração (Sandbox)', icon: Sliders },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#A8E63A] text-black shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.alert && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* TAB 0: CADASTROS & APROVAÇÕES AI */}
            {activeTab === 'leads_approval' && (
              <div className="space-y-3 animate-slide-down">
                {/* Header & Stats Banner */}
                <div className="bg-[#0e1116] border border-zinc-800 p-3.5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#A8E63A]" />
                        <span>Painel Master CEO AI • Aprovação de Cadastros</span>
                      </h3>
                      <p className="text-[10px] text-zinc-400">
                        Auditoria de novos passageiros, motoristas homologados e contratos corporativos.
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black border border-amber-500/40">
                      {pendingLeadsCount} Pendentes
                    </span>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar por nome, WhatsApp, CPF, CNPJ ou placa..."
                      value={leadSearchQuery}
                      onChange={(e) => setLeadSearchQuery(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#A8E63A] outline-none"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-800/80 text-[10px]">
                    <div className="flex items-center gap-1">
                      <span className="text-zinc-500 font-bold">Tipo:</span>
                      {[
                        { id: 'all', label: 'Todos' },
                        { id: 'passenger', label: 'Passageiros' },
                        { id: 'driver', label: 'Motoristas' },
                        { id: 'contract', label: 'Contratos PJ' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setLeadCategoryFilter(item.id as any)}
                          className={`px-2 py-0.5 rounded-lg font-bold transition ${
                            leadCategoryFilter === item.id
                              ? 'bg-[#A8E63A] text-black shadow-sm'
                              : 'bg-black/60 text-zinc-400 hover:text-white border border-zinc-800'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-zinc-500 font-bold">Status:</span>
                      {[
                        { id: 'all', label: 'Todos' },
                        { id: 'pending_approval', label: 'Pendentes' },
                        { id: 'active', label: 'Aprovados' },
                        { id: 'rejected', label: 'Reprovados' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setLeadStatusFilter(item.id as any)}
                          className={`px-2 py-0.5 rounded-lg font-bold transition ${
                            leadStatusFilter === item.id
                              ? 'bg-zinc-200 text-black shadow-sm'
                              : 'bg-black/60 text-zinc-400 hover:text-white border border-zinc-800'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Leads Card List */}
                {filteredLeads.length === 0 ? (
                  <div className="bg-[#0e1116] border border-zinc-800 p-8 rounded-2xl text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-[#A8E63A] mx-auto opacity-70" />
                    <p className="text-xs font-bold text-zinc-300">Nenhum cadastro encontrado com os filtros atuais.</p>
                    <p className="text-[10px] text-zinc-500">Novos cadastros de passageiros ou motoristas aparecerão aqui automaticamente.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {filteredLeads.map((lead) => {
                      const status = lead.status || 'pending_approval';
                      const isPending = status === 'pending_approval';
                      const isActive = status === 'active';
                      const isRejected = status === 'rejected';

                      const cleanPhone = lead.phone.replace(/\D/g, '');
                      const waPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

                      const waSecondStageText = `Olá ${lead.name}! Aqui é da Central W-DRIVER. Informamos que seu agendamento para a 2ª Etapa (Vistoria e Coleta Presencial de Dados na sua Residência) foi registrado com sucesso. Nosso Representante Legal Oficial (${lead.secondStageRepresentative || 'Wallace Soares - Diretor'}) irá até sua residência (${lead.secondStageAddress || 'no endereço informado'}) no horário: ${lead.secondStageDate || 'a combinar'} para realizar a vistoria do veículo e conferência documental. Havendo a confirmação, seu cadastro será liberado imediatamente!`;

                      const waApprovalText = `Olá ${lead.name}! Parabéns! A vistoria do veículo e confirmação de dados da 2ª Etapa foram APROVADAS com sucesso pelo nosso Representante Legal Oficial. Seu cadastro na W-DRIVER OFICIAL foi 100% LIBERADO e ATIVADO pela Diretoria! Você já pode iniciar suas atividades no aplicativo W-DRIVER. Boas viagens!`;
                      const waRejectText = `Olá ${lead.name}, aqui é da Central W-DRIVER OFICIAL 3.0. Seu cadastro necessita de revisão cadastral ou documentação complementar. Por favor, entre em contato para regularização.`;

                      return (
                        <div
                          key={lead.id}
                          className={`p-3.5 rounded-2xl border transition space-y-2.5 ${
                            isPending
                              ? 'bg-[#12151c] border-amber-500/40 shadow-lg'
                              : isActive
                              ? 'bg-black/70 border-emerald-500/30'
                              : 'bg-black/50 border-red-500/30 opacity-75'
                          }`}
                        >
                          {/* Card Top: Name & Modality & Status */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="text-xs font-black text-white">{lead.name}</h4>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                    lead.type === 'passenger'
                                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                      : lead.companyCnpj
                                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                      : 'bg-[#A8E63A]/20 text-[#A8E63A] border border-[#A8E63A]/30'
                                  }`}
                                >
                                  {lead.type === 'passenger'
                                    ? 'Passageiro'
                                    : lead.companyCnpj
                                    ? 'Contrato PJ'
                                    : `Motorista ${lead.type.toUpperCase()}`}
                                </span>
                              </div>
                              <p className="text-[10px] text-zinc-400">
                                Cadastrado em: {lead.createdAt} • {lead.city || 'João Pessoa - PB'}
                              </p>
                            </div>

                            {/* Status Indicator Pill */}
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase shrink-0 ${
                                isPending
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 animate-pulse'
                                  : isActive
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
                              }`}
                            >
                              {isPending ? 'Pendente Aprovação' : isActive ? 'Aprovado / Ativo' : 'Reprovado'}
                            </span>
                          </div>

                          {/* Details Grid */}
                          <div className="bg-black/60 p-2.5 rounded-xl border border-zinc-800 text-[10px] text-zinc-300 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            <div>
                              <strong className="text-zinc-400">WhatsApp:</strong>{' '}
                              <span className="text-[#A8E63A] font-mono font-bold">{lead.phone}</span>
                            </div>
                            {lead.cpf && (
                              <div>
                                <strong className="text-zinc-400">CPF:</strong> {lead.cpf}
                              </div>
                            )}
                            {lead.birthState && (
                              <div className="sm:col-span-2 flex items-center gap-1.5 flex-wrap">
                                <strong className="text-zinc-400">Origem & Naturalidade:</strong>
                                <span className={`px-2 py-0.5 rounded-md font-bold ${
                                  lead.isOutOfState
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                    : 'bg-[#A8E63A]/20 text-[#A8E63A] border border-[#A8E63A]/30'
                                }`}>
                                  Natural de {lead.birthState} • Reside em {lead.residenceState || 'PB'}
                                  {lead.isOutOfState && ' (Motorista de Outro Estado - Exige 2 Certidões Estaduais)'}
                                </span>
                              </div>
                            )}
                            {lead.companyCnpj && (
                              <div className="sm:col-span-2">
                                <strong className="text-cyan-400">CNPJ Corporativo:</strong> {lead.companyCnpj}
                              </div>
                            )}
                            {lead.cnhNumber && (
                              <div>
                                <strong className="text-zinc-400">CNH:</strong> {lead.cnhNumber}
                              </div>
                            )}
                            {lead.vehicleDetails && (
                              <div className="sm:col-span-2">
                                <strong className="text-zinc-400">Veículo / Equipamento:</strong> {lead.vehicleDetails}
                              </div>
                            )}
                            {/* Checklist of submitted documents */}
                            {lead.type !== 'passenger' && (
                              <div className="sm:col-span-2 pt-1 border-t border-zinc-800/80 flex items-center gap-1.5 flex-wrap">
                                <span className="text-[9px] font-bold text-zinc-400">Documentos:</span>
                                {lead.criminalCertFederal && (
                                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] border border-emerald-500/30">
                                    ✓ Certidão Federal
                                  </span>
                                )}
                                {lead.criminalCertResidenceState && (
                                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] border border-emerald-500/30">
                                    ✓ Estadual ({lead.residenceState || 'PB'})
                                  </span>
                                )}
                                {lead.isOutOfState && lead.criminalCertOriginState && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] border border-amber-500/40 font-bold">
                                    ✓ Estadual ({lead.birthState})
                                  </span>
                                )}
                                {lead.cnhEarAttached && (
                                  <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 text-[9px]">
                                    ✓ CNH EAR
                                  </span>
                                )}
                                {lead.crlvAttached && (
                                  <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 text-[9px]">
                                    ✓ CRLV do Ano
                                  </span>
                                )}
                              </div>
                            )}
                            {/* 2ª ETAPA DE HOMOLOGAÇÃO & CONFIRMAÇÃO DE DADOS */}
                            {lead.type !== 'passenger' && (
                              <div className="sm:col-span-2 p-2.5 rounded-xl bg-gradient-to-r from-blue-950/40 via-zinc-950 to-black border border-blue-500/40 space-y-1.5 mt-0.5">
                                <div className="flex items-center justify-between flex-wrap gap-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 text-[9px] font-black uppercase border border-blue-500/40">
                                      2ª Etapa: Vistoria & Coleta
                                    </span>
                                    <span className="font-bold text-white text-[10px]">
                                      🏠 Visita Presencial na Residência (Representante Legal)
                                    </span>
                                  </div>

                                  <span
                                    className={`px-2 py-0.2 rounded-md text-[9px] font-bold ${
                                      isActive
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                        : lead.secondStageStatus === 'data_collected'
                                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                        : lead.secondStageStatus === 'scheduled'
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                        : 'bg-zinc-800 text-zinc-300'
                                    }`}
                                  >
                                    {isActive
                                      ? '✓ Vistoria Realizada & Liberado'
                                      : lead.secondStageStatus === 'data_collected'
                                      ? 'Vistoria Concluída (Aguardando Liberação)'
                                      : lead.secondStageStatus === 'scheduled'
                                      ? 'Visita Residencial Agendada'
                                      : 'Pendente Agendamento da Visita'}
                                  </span>
                                </div>

                                <div className="text-[9.5px] text-zinc-300 space-y-0.5">
                                  {lead.secondStageAddress && (
                                    <div>
                                      <strong className="text-zinc-400">Endereço da Residência para Vistoria:</strong> {lead.secondStageAddress}
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between flex-wrap gap-1 text-[9px]">
                                    <div>
                                      <strong className="text-zinc-400">Representante Legal Designado:</strong>{' '}
                                      <span className="text-[#A8E63A] font-bold">
                                        {lead.secondStageRepresentative || 'Wallace Soares (Representante Legal Central)'}
                                      </span>
                                    </div>
                                    {lead.secondStageDate && (
                                      <div className="text-zinc-400">
                                        <strong>Horário Preferencial:</strong> {lead.secondStageDate}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {lead.contractNotes && (
                              <div className="sm:col-span-2 text-cyan-300">
                                <strong>Detalhes do Contrato:</strong> {lead.contractNotes}
                              </div>
                            )}
                            {lead.referralCodeUsed && (
                              <div>
                                <strong className="text-zinc-400">Código Indicação:</strong>{' '}
                                <span className="text-[#A8E63A] font-bold">{lead.referralCodeUsed}</span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons: Aprovar / Reprovar / WhatsApp */}
                          <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                            {/* Aprovar Button */}
                            <button
                              onClick={() => {
                                onUpdateLeadStatus?.(lead.id, 'active');
                                confetti({ particleCount: 50, spread: 60 });
                              }}
                              disabled={isActive}
                              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition min-w-[160px] ${
                                isActive
                                  ? 'bg-emerald-950/40 text-emerald-500 border border-emerald-500/30 cursor-default'
                                  : 'bg-[#A8E63A] hover:bg-[#95d130] text-black shadow-md active:scale-95'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>
                                {isActive
                                  ? 'Cadastro Liberado & Ativo'
                                  : lead.type !== 'passenger'
                                  ? 'Confirmar Coleta & Liberar'
                                  : 'Aprovar Cadastro'}
                              </span>
                            </button>

                            {/* WhatsApp Direct Action (Notificar 2ª Etapa ou Aprovação) */}
                            {isPending && lead.type !== 'passenger' && (
                              <button
                                onClick={() => {
                                  window.open(
                                    `https://api.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent(waSecondStageText)}`,
                                    '_blank'
                                  );
                                }}
                                className="py-1.5 px-2 rounded-xl bg-blue-950/40 border border-blue-500/40 text-blue-300 hover:bg-blue-900/60 transition text-xs font-bold flex items-center gap-1"
                                title="Enviar WhatsApp de Agendamento da 2ª Etapa / Representante Legal"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Avisar 2ª Etapa</span>
                              </button>
                            )}

                            {/* Reprovar Button */}
                            <button
                              onClick={() => {
                                onUpdateLeadStatus?.(lead.id, 'rejected');
                              }}
                              disabled={isRejected}
                              className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                                isRejected
                                  ? 'bg-red-950/40 text-red-500 border border-red-500/30 cursor-default'
                                  : 'bg-red-950/30 border border-red-500/40 hover:bg-red-900/40 text-red-300'
                              }`}
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>Reprovar</span>
                            </button>

                            {/* WhatsApp Notificação Padrão */}
                            <button
                              onClick={() => {
                                const msg = isActive
                                  ? waApprovalText
                                  : isRejected
                                  ? waRejectText
                                  : waSecondStageText;
                                window.open(`https://api.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent(msg)}`, '_blank');
                              }}
                              className="p-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 transition"
                              title="Notificar via WhatsApp Oficial"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Lead Button */}
                            <button
                              onClick={() => onDeleteLead(lead.id)}
                              className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 transition"
                              title="Remover Registro"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        );
      })()}

      {/* 3. ACTIVE TAB CONTENT */}

      {/* TAB 1: OVERVIEW & GESTÃO DE PESSOAS */}
      {activeTab === 'overview' && (
        <div className="space-y-3 animate-slide-down">
          <div className="bg-[#0e1116] border border-zinc-800 p-3.5 rounded-2xl">
            <h3 className="text-xs font-black text-white uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Gestão de Motoristas & Ações Imediatas</span>
              <span className="text-[10px] text-zinc-400">{drivers.length} cadastrados</span>
            </h3>

            <div className="space-y-2.5">
              {drivers.map((drv) => {
                const status = driverStatusMap[drv.id] || 'active';
                return (
                  <div
                    key={drv.id}
                    className="p-3 rounded-2xl bg-black/60 border border-zinc-850 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={drv.photoUrl}
                          alt={drv.name}
                          className="w-10 h-10 rounded-full object-cover border border-[#A8E63A]"
                        />
                        <div>
                          <h4 className="text-xs font-extrabold text-white">{drv.name}</h4>
                          <p className="text-[10px] text-zinc-400">
                            {drv.vehicleModel} • {drv.vehiclePlate} ({drv.category})
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : status === 'suspended'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}
                      >
                        {status === 'active' ? 'Ativo' : status === 'suspended' ? 'Descanso' : 'Bloqueado'}
                      </span>
                    </div>

                    {/* Direct Action Buttons: [Aprovar], [Modo Descanso], [Bloquear] */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-zinc-800/60">
                      <button
                        onClick={() => {
                          onUpdateDriverStatus(drv.id, 'active');
                          onApproveDriverInspection(drv.id);
                        }}
                        className="py-1 px-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-[10px] font-bold text-emerald-300 hover:bg-emerald-900/60 transition text-center"
                      >
                        ✓ Aprovar
                      </button>

                      <button
                        onClick={() => onRestDriver(drv.id)}
                        className="py-1 px-2 rounded-lg bg-amber-950/40 border border-amber-500/40 text-[10px] font-bold text-amber-300 hover:bg-amber-900/60 transition text-center"
                      >
                        ⏸ Descanso
                      </button>

                      <button
                        onClick={() => onBanDriver(drv.id)}
                        className="py-1 px-2 rounded-lg bg-red-950/40 border border-red-500/40 text-[10px] font-bold text-red-300 hover:bg-red-900/60 transition text-center"
                      >
                        ✕ Bloquear
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PÁGINA DE CONTROLE DE PROPAGANDAS / PARCEIROS (NOVA) */}
      {activeTab === 'ads_control' && (
        <div className="space-y-3 animate-slide-down">
          {/* Exclusivity Warning Banner */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/40 to-black border border-purple-500/30 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div className="text-[10px] text-zinc-300">
              <strong className="text-purple-300 block font-bold mb-0.5">
                Exclusividade de Mídia Local (Passageiros)
              </strong>
              Estes banners e cupons de parceiros locais são exibidos exclusivamente dentro do card "Para onde vamos?" do Passageiro. O App do Motorista é mantido 100% livre de qualquer anúncio.
            </div>
          </div>

          <div className="bg-[#0e1116] border border-zinc-800 p-3.5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  Parceiros Anunciantes Cadastrados
                </h3>
                <p className="text-[10px] text-zinc-400">
                  {commercialAds.filter((a) => a.isActive).length} ativos no carrossel de passageiros
                </p>
              </div>

              <button
                onClick={() => setShowNewAdModal(true)}
                className="py-1.5 px-3 rounded-xl bg-[#A8E63A] hover:bg-[#95d130] text-black text-[10px] font-black flex items-center gap-1 shadow-md transition active:scale-95"
              >
                <Plus className="w-3 h-3" />
                <span>Novo Anúncio</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {commercialAds.map((ad) => (
                <div
                  key={ad.id}
                  className="p-3 rounded-2xl bg-black/60 border border-zinc-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-[#A8E63A] font-black uppercase tracking-wider block">
                        {ad.segment}
                      </span>
                      <h4 className="text-xs font-bold text-white">{ad.partnerName}</h4>
                      <p className="text-[11px] text-zinc-300 font-medium">{ad.title}</p>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        ad.isActive
                          ? 'bg-[#A8E63A]/20 text-[#A8E63A] border border-[#A8E63A]/30'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {ad.isActive ? 'Ativo no App' : 'Pausado'}
                    </span>
                  </div>

                  <p className="text-[10px] text-zinc-400 line-clamp-1">{ad.description}</p>

                  {ad.discountCoupon && (
                    <div className="text-[10px] text-[#A8E63A] bg-[#A8E63A]/10 px-2 py-0.5 rounded-lg inline-block font-mono font-bold">
                      Cupom: {ad.discountCoupon}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-850">
                    <span className="text-[9px] text-zinc-500">
                      Exibição: {ad.displayDurationSeconds}s
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onToggleCommercialAd(ad.id)}
                        className="text-[10px] font-bold text-zinc-300 hover:text-white px-2 py-0.5 rounded-lg bg-zinc-850"
                      >
                        {ad.isActive ? 'Pausar' : 'Ativar'}
                      </button>
                      <button
                        onClick={() => onDeleteCommercialAd(ad.id)}
                        className="text-[10px] font-bold text-red-400 hover:text-red-300 px-2 py-0.5 rounded-lg bg-red-950/30"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VISTORIA PRESENCIAL */}
      {activeTab === 'inspections' && (
        <div className="space-y-3 animate-slide-down">
          <div className="bg-[#0e1116] border border-zinc-800 p-3.5 rounded-2xl">
            <h3 className="text-xs font-black text-white uppercase tracking-wider mb-1 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#A8E63A]" />
              <span>Vistoria Física & Homologação de Veículo</span>
            </h3>
            <p className="text-[10px] text-zinc-400 mb-3">
              O motorista só inicia corridas após envio de CNH, CRLV e validação presencial.
            </p>

            {pendingInspections.length === 0 ? (
              <div className="text-center py-6 text-zinc-500">
                <CheckCircle2 className="w-8 h-8 text-[#A8E63A] mx-auto mb-1.5 opacity-80" />
                <p className="text-xs font-bold text-zinc-300">Todas as vistorias estão em dia!</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingInspections.map((drv) => (
                  <div key={drv.id} className="p-3 rounded-2xl bg-black/60 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">{drv.name}</h4>
                        <p className="text-[10px] text-zinc-400">{drv.vehicleModel} • {drv.vehiclePlate}</p>
                      </div>
                      <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                        Pendente Vistoria
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onApproveDriverInspection(drv.id)}
                        className="flex-1 py-1.5 rounded-xl bg-[#A8E63A] text-black text-xs font-black hover:bg-[#95d130] transition"
                      >
                        Homologar e Liberar
                      </button>
                      <button
                        onClick={() => onBanDriver(drv.id)}
                        className="py-1.5 px-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-bold"
                      >
                        Recusar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: SAC & RECLAMAÇÕES (CRM) */}
      {activeTab === 'crm' && (
        <div className="space-y-3 animate-slide-down">
          <div className="bg-[#0e1116] border border-zinc-800 p-3.5 rounded-2xl">
            <h3 className="text-xs font-black text-white uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#A8E63A]" />
              <span>SAC & Central de Atendimento ao Usuário</span>
            </h3>

            <div className="space-y-2.5">
              {supportTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`p-3 rounded-2xl border transition ${
                    ticket.status === 'aberto'
                      ? 'bg-amber-950/20 border-amber-500/30'
                      : ticket.status === 'em_analise'
                      ? 'bg-blue-950/20 border-blue-500/30'
                      : 'bg-black/60 border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{ticket.userName}</span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        ticket.status === 'aberto'
                          ? 'bg-amber-500/20 text-amber-400'
                          : ticket.status === 'em_analise'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <h4 className="text-[11px] font-bold text-[#A8E63A]">{ticket.subject}</h4>
                  <p className="text-[10px] text-zinc-300 mt-0.5">{ticket.message}</p>

                  {ticket.response && (
                    <div className="mt-2 p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[10px] text-zinc-300">
                      <strong className="text-[#A8E63A]">Resposta Oficial:</strong> {ticket.response}
                    </div>
                  )}

                  {ticket.status !== 'resolvido' && (
                    <div className="mt-2 flex gap-1.5">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="py-1 px-3 rounded-lg bg-[#A8E63A] text-black text-[10px] font-bold hover:bg-[#95d130] transition"
                      >
                        Responder / Concluir
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: BROADCAST NOTIFICATIONS */}
      {activeTab === 'broadcast' && (
        <div className="space-y-3 animate-slide-down">
          <form onSubmit={handleSendBroadcast} className="bg-[#0e1116] border border-zinc-800 p-3.5 rounded-2xl space-y-2.5">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#A8E63A]" />
              <span>Emitir Alerta Geral em Tempo Real</span>
            </h3>

            <input
              type="text"
              value={bcTitle}
              onChange={(e) => setBcTitle(e.target.value)}
              placeholder="Título da Notificação (ex: Alta Demanda no Centro)"
              className="w-full p-2 rounded-xl bg-black/60 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#A8E63A]"
              required
            />

            <textarea
              value={bcMessage}
              onChange={(e) => setBcMessage(e.target.value)}
              placeholder="Mensagem transmitida via Push e Toast com alerta sonoro..."
              rows={3}
              className="w-full p-2 rounded-xl bg-black/60 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#A8E63A]"
              required
            />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-zinc-400 font-bold uppercase block mb-1">Destinatários</label>
                <select
                  value={bcChannel}
                  onChange={(e) => setBcChannel(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none"
                >
                  <option value="all">Todos os Usuários</option>
                  <option value="drivers">Apenas Motoristas</option>
                  <option value="passengers">Apenas Passageiros</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 font-bold uppercase block mb-1">Prioridade</label>
                <select
                  value={bcUrgency}
                  onChange={(e) => setBcUrgency(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none"
                >
                  <option value="normal">Normal</option>
                  <option value="high">Alta (Toque Duplo)</option>
                  <option value="urgent">Urgente (Alerta Sonoro)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#A8E63A] hover:bg-[#95d130] text-black font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Disparar Comunicado Imediato</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: MAPA DE CALOR */}
      {activeTab === 'heatmap' && (
        <div className="space-y-3 animate-slide-down">
          <div className="bg-[#0e1116] border border-zinc-800 p-3.5 rounded-2xl">
            <h3 className="text-xs font-black text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Zonas de Demanda Aquecida (Multiplicador Dinâmico)</span>
            </h3>
            <div className="space-y-2">
              {heatmapZones.map((zone) => (
                <div key={zone.id} className="p-2.5 rounded-xl bg-black/60 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{zone.name}</h4>
                    <p className="text-[10px] text-zinc-400">Intensidade: {zone.intensity}% • Raio {zone.radiusMeters}m</p>
                  </div>
                  <span className="text-xs font-black text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-lg">
                    {zone.multiplier}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: DEMONSTRAÇÃO (SANDBOX) & DISPARO */}
      {activeTab === 'sandbox' && (
        <div className="space-y-3 animate-slide-down">
          <div className="bg-[#0e1116] border border-zinc-800 p-3.5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Play className="w-4 h-4 text-cyan-400" />
                <span>Simulador de Despacho & Testes de Corrida</span>
              </h3>
              <span className="text-[9px] font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                Sandbox Ativo
              </span>
            </div>

            <p className="text-[10px] text-zinc-400">
              Utilize os disparadores abaixo para simular pedidos em tempo real em apresentações para investidores e novos motoristas parceiros.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onTriggerTestDispatch}
                className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-black flex flex-col items-center justify-center gap-1 hover:bg-cyan-900/60 transition text-center"
              >
                <Car className="w-4 h-4" />
                <span>Disparar Chamada Teste</span>
              </button>

              <button
                onClick={() => onSpawnSimulatedDriver('w-carro')}
                className="p-3 rounded-2xl bg-[#A8E63A]/10 border border-[#A8E63A]/30 text-[#A8E63A] text-xs font-black flex flex-col items-center justify-center gap-1 hover:bg-[#A8E63A]/20 transition text-center"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Carro Simulado</span>
              </button>
            </div>

            <div className="pt-2 border-t border-zinc-800">
              <button
                onClick={onResetTestData}
                className="w-full py-2 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-300"
              >
                Restaurar Dados Originais de Demonstração
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: CENTRAL DE COMPARTILHAMENTO & LINKS DIRETOS */}
      {showShareModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
          <div className="bg-[#111419] border border-zinc-800 rounded-3xl p-4 max-w-sm w-full space-y-3.5 shadow-2xl animate-slide-down">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#A8E63A]" />
                <h3 className="text-xs font-black uppercase text-white">Links Oficiais de Captação</h3>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* LINK 1: CADASTRO DE MOTORISTA */}
            <div className="p-3 rounded-2xl bg-black/70 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                  <span>Link 1: Cadastro de Motorista</span>
                </div>
                <span className="text-[9px] text-amber-400 font-black bg-amber-500/10 px-1.5 py-0.2 rounded-md">
                  CNH + Vistoria
                </span>
              </div>
              <p className="text-[10px] text-zinc-400">
                Formulário para envio de CNH, CRLV do veículo e agendamento de vistoria.
              </p>
              <div className="flex gap-1.5 pt-1">
                <button
                  onClick={() => handleCopyLink(driverRegistrationUrl, 'driver')}
                  className="flex-1 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold text-white flex items-center justify-center gap-1 transition"
                >
                  <Copy className="w-3 h-3 text-[#A8E63A]" />
                  <span>{copiedLink === 'driver' ? 'Copiado!' : 'Copiar Link'}</span>
                </button>
                <button
                  onClick={() =>
                    handleShareWhatsApp(
                      `🚗 Seja um Motorista Parceiro Oficial W Drive!\nGanhe 85% líquido, flexibilidade e suporte 24h.\nFaça seu cadastro e envie seus documentos:\n${driverRegistrationUrl}`
                    )
                  }
                  className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-[10px] font-bold text-white flex items-center gap-1 transition"
                >
                  <Share2 className="w-3 h-3" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            {/* LINK 2: CADASTRO DE PASSAGEIRO */}
            <div className="p-3 rounded-2xl bg-black/70 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Link 2: Cadastro de Passageiro</span>
                </div>
                <span className="text-[9px] text-[#A8E63A] font-black bg-[#A8E63A]/10 px-1.5 py-0.2 rounded-md">
                  Cupom W0701
                </span>
              </div>
              <p className="text-[10px] text-zinc-400">
                Criação rápida de conta VIP com desconto automático na 1ª corrida.
              </p>
              <div className="flex gap-1.5 pt-1">
                <button
                  onClick={() => handleCopyLink(passengerRegistrationUrl, 'passenger')}
                  className="flex-1 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold text-white flex items-center justify-center gap-1 transition"
                >
                  <Copy className="w-3 h-3 text-[#A8E63A]" />
                  <span>{copiedLink === 'passenger' ? 'Copiado!' : 'Copiar Link'}</span>
                </button>
                <button
                  onClick={() =>
                    handleShareWhatsApp(
                      `🚕 Viaje com mais segurança e conforto na W Drive!\nUse o cupom W0701 e ganhe desconto na sua primeira corrida:\n${passengerRegistrationUrl}`
                    )
                  }
                  className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-[10px] font-bold text-white flex items-center gap-1 transition"
                >
                  <Share2 className="w-3 h-3" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: RESPONDER TICKET SAC */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
          <div className="bg-[#111419] border border-zinc-800 rounded-3xl p-4 max-w-sm w-full space-y-3 shadow-2xl animate-slide-down">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="text-xs font-black uppercase text-white">Responder Chamado SAC</h3>
              <button onClick={() => setSelectedTicket(null)} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs">
              <p className="text-zinc-400 font-bold">{selectedTicket.userName}</p>
              <p className="text-[#A8E63A] font-bold">{selectedTicket.subject}</p>
              <p className="text-zinc-300 mt-1 bg-black/50 p-2 rounded-xl border border-zinc-800">{selectedTicket.message}</p>
            </div>

            <textarea
              value={ticketReplyText}
              onChange={(e) => setTicketReplyText(e.target.value)}
              placeholder="Digite a resposta oficial da central..."
              rows={3}
              className="w-full p-2.5 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#A8E63A]"
            />

            <button
              onClick={() => handleReplyTicket(selectedTicket.id)}
              className="w-full py-2 rounded-xl bg-[#A8E63A] hover:bg-[#95d130] text-black font-black text-xs uppercase transition"
            >
              Enviar Resposta e Concluir Chamado
            </button>
          </div>
        </div>
      )}

      {/* 6. MODAL: CADASTRAR NOVO PARCEIRO ANUNCIANTE */}
      {showNewAdModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
          <form
            onSubmit={handleCreateAdSubmit}
            className="bg-[#111419] border border-zinc-800 rounded-3xl p-4 max-w-sm w-full space-y-2.5 shadow-2xl animate-slide-down"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#A8E63A]" />
                <h3 className="text-xs font-black uppercase text-white">Cadastrar Anunciante</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewAdModal(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase block mb-0.5">Empresa Parceira</label>
              <input
                type="text"
                value={newAdPartnerName}
                onChange={(e) => setNewAdPartnerName(e.target.value)}
                placeholder="Ex: Pizzaria Forno & Arte"
                className="w-full p-2 rounded-xl bg-black border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#A8E63A]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-zinc-400 font-bold uppercase block mb-0.5">Segmento</label>
                <input
                  type="text"
                  value={newAdSegment}
                  onChange={(e) => setNewAdSegment(e.target.value)}
                  placeholder="Ex: Gastronomia"
                  className="w-full p-2 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 font-bold uppercase block mb-0.5">Cupom de Desconto</label>
                <input
                  type="text"
                  value={newAdCoupon}
                  onChange={(e) => setNewAdCoupon(e.target.value.toUpperCase())}
                  placeholder="Ex: PIZZA15"
                  className="w-full p-2 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase block mb-0.5">Título da Oferta</label>
              <input
                type="text"
                value={newAdTitle}
                onChange={(e) => setNewAdTitle(e.target.value)}
                placeholder="Ex: 15% OFF na Pizza Grande"
                className="w-full p-2 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#A8E63A]"
                required
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase block mb-0.5">Descrição Curta</label>
              <input
                type="text"
                value={newAdDescription}
                onChange={(e) => setNewAdDescription(e.target.value)}
                placeholder="Ex: Válido de segunda a quinta para clientes W Drive."
                className="w-full p-2 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase block mb-0.5">URL da Foto / Banner</label>
              <input
                type="url"
                value={newAdBannerUrl}
                onChange={(e) => setNewAdBannerUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none text-zinc-400 text-[10px]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#A8E63A] hover:bg-[#95d130] text-black font-black text-xs uppercase transition shadow-lg mt-2"
            >
              Publicar Anúncio no App do Passageiro
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
