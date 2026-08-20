import React, { useState } from 'react';
import { AppRole, LeadCapture } from '../types';
import { Logo } from './Logo';
import { AppLauncherIcon } from './AppLauncherIcon';
import { FounderBioModal } from './FounderBioModal';
import { BRAZILIAN_STATES } from '../constants';
import {
  Car,
  User,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Gift,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  FileText,
  MapPin,
  ArrowLeft,
  X,
  Send,
  Eye,
  EyeOff,
  Briefcase,
  UserPlus,
  BookOpen,
  Award,
  Building2,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WelcomeScreenProps {
  isOpen: boolean;
  onSelectRole: (role: AppRole) => void;
  onClose: () => void;
  onLeadCaptured: (lead: LeadCapture) => void;
  onOpenMasterAuth: () => void;
}

type WelcomeStep = 'selection' | 'passenger_register' | 'driver_register' | 'success';

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  isOpen,
  onSelectRole,
  onClose,
  onLeadCaptured,
  onOpenMasterAuth,
}) => {
  const [step, setStep] = useState<WelcomeStep>('selection');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showFounderBio, setShowFounderBio] = useState<boolean>(false);

  // Form Fields - Passenger
  const [passName, setPassName] = useState<string>('');
  const [passCpf, setPassCpf] = useState<string>('');
  const [passEmail, setPassEmail] = useState<string>('');
  const [passPhone, setPassPhone] = useState<string>('');
  const [passPassword, setPassPassword] = useState<string>('');
  const [passReferralCode, setPassReferralCode] = useState<string>('W0701');
  const [passTermsAccepted, setPassTermsAccepted] = useState<boolean>(true);

  // Form Fields - Driver
  const [drvName, setDrvName] = useState<string>('');
  const [drvCpf, setDrvCpf] = useState<string>('');
  const [drvEmail, setDrvEmail] = useState<string>('');
  const [drvPhone, setDrvPhone] = useState<string>('');
  const [drvCnh, setDrvCnh] = useState<string>('');
  const [drvBirthState, setDrvBirthState] = useState<string>('PB');
  const [drvResidenceState, setDrvResidenceState] = useState<string>('PB');
  const [drvCategory, setDrvCategory] = useState<'w-carro' | 'w-moto' | 'w-taxi' | 'w-bike'>('w-carro');
  const [drvModalityInterest, setDrvModalityInterest] = useState<'comum' | 'prime' | 'contrato'>('comum');
  const [drvVehicleModel, setDrvVehicleModel] = useState<string>('');
  const [drvVehiclePlate, setDrvVehiclePlate] = useState<string>('');
  const [drvVehicleColor, setDrvVehicleColor] = useState<string>('');
  const [drvVehicleYear, setDrvVehicleYear] = useState<string>('2022');
  const [drvCriminalCertFederal, setDrvCriminalCertFederal] = useState<boolean>(true);
  const [drvCriminalCertEstadual, setDrvCriminalCertEstadual] = useState<boolean>(true);
  const [drvCriminalCertOriginState, setDrvCriminalCertOriginState] = useState<boolean>(true);
  // 2ª Etapa: Central ou Residência
  const [drvSecondStageMethod, setDrvSecondStageMethod] = useState<'central' | 'residence'>('residence');
  const [drvSecondStageAddress, setDrvSecondStageAddress] = useState<string>('');
  const [drvPreferredTime, setDrvPreferredTime] = useState<string>('Manhã (08h às 12h)');
  const [drvTermsAccepted, setDrvTermsAccepted] = useState<boolean>(true);

  const isDrvOutOfState = drvBirthState !== drvResidenceState;

  // Success state payload
  const [successMessage, setSuccessMessage] = useState<{
    title: string;
    description: string;
    role: AppRole;
  }>({
    title: 'Cadastro Concluído com Sucesso!',
    description: 'Você já pode solicitar suas viagens na W-DRIVER.',
    role: 'passenger',
  });

  if (!isOpen) return null;

  // Handle Passenger Registration Submission
  const handlePassengerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passName.trim() || !passPhone.trim()) return;

    const newLead: LeadCapture = {
      id: `lead-pass-${Date.now()}`,
      name: passName.trim(),
      email: passEmail.trim() || `${passName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      phone: passPhone.trim(),
      cpf: passCpf.trim(),
      city: 'João Pessoa - PB',
      type: 'passenger',
      status: 'active',
      referralCodeUsed: passReferralCode || 'W0701',
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };

    onLeadCaptured(newLead);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });

    setSuccessMessage({
      title: 'Bem-vindo(a) à W-DRIVER!',
      description: 'Seu cadastro de passageiro foi concluído. Seu cupom de desconto W0701 foi ativado para sua primeira corrida!',
      role: 'passenger',
    });
    setStep('success');
  };

  // Handle Driver Registration Submission
  const handleDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drvName.trim() || !drvPhone.trim() || !drvCnh.trim()) return;

    const newLead: LeadCapture = {
      id: `lead-drv-${Date.now()}`,
      name: drvName.trim(),
      email: drvEmail.trim() || `${drvName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      phone: drvPhone.trim(),
      cpf: drvCpf.trim(),
      city: 'João Pessoa - PB',
      birthState: drvBirthState,
      residenceState: drvResidenceState,
      isOutOfState: isDrvOutOfState,
      criminalCertFederal: drvCriminalCertFederal,
      criminalCertResidenceState: drvCriminalCertEstadual,
      criminalCertOriginState: isDrvOutOfState ? drvCriminalCertOriginState : undefined,
      secondStageMethod: 'residence',
      secondStageAddress: drvSecondStageAddress.trim() || 'Endereço residencial a confirmar',
      secondStageDate: `Preferência: ${drvPreferredTime}`,
      secondStageRepresentative: 'Representante Legal Oficial (Enviado pela Central W-DRIVER)',
      secondStageStatus: 'pending_scheduling',
      type: 'driver',
      status: 'pending_approval',
      vehicleDetails: `${drvVehicleModel || 'Veículo'} - Placa: ${drvVehiclePlate || 'A verificar'} - Cor: ${drvVehicleColor || 'Prata'} (${drvVehicleYear}) [Modalidade: ${drvModalityInterest.toUpperCase()}]`,
      cnhNumber: drvCnh.trim(),
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };

    onLeadCaptured(newLead);
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });

    setSuccessMessage({
      title: 'Pré-Cadastro Enviado com Sucesso!',
      description: '1ª Etapa Concluída! Para a 2ª Etapa, a Central enviará um Representante Legal Oficial à sua residência para vistoria do veículo, coleta e validação dos dados. Havendo confirmação, seu cadastro será liberado imediatamente!',
      role: 'driver',
    });
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-lg animate-fade-in text-white overflow-y-auto select-none">
      <div className="bg-[#0e1116] border border-zinc-800 rounded-3xl w-full max-w-md max-h-[94vh] flex flex-col overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] relative">
        {/* Top Floating Bar */}
        <div className="p-4 border-b border-zinc-800/80 bg-gradient-to-r from-[#14181f] to-[#0e1116] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step !== 'selection' && step !== 'success' && (
              <button
                onClick={() => setStep('selection')}
                className="p-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition mr-1"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <Logo variant="W-DRIVER" size="sm" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-[11px] font-bold text-zinc-400 hover:text-white px-2.5 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 transition"
            >
              Pular / Entrar
            </button>
          </div>
        </div>

        {/* Dynamic Step Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {/* STEP 1: WELCOME & PROFILE SELECTION */}
          {step === 'selection' && (
            <div className="space-y-4 animate-slide-up">
              {/* Official Launcher Icon Presentation */}
              <div className="flex flex-col items-center justify-center text-center pt-2 pb-1">
                <AppLauncherIcon size="lg" showSubtitle={false} className="mb-3" />

                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#A8E63A]/10 border border-[#A8E63A]/30 text-[#A8E63A] text-[10px] font-black uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-3 h-3" />
                  OFICIAL 3.0
                </div>

                <h2 className="text-xl font-black text-white">
                  Seja Bem-vindo à <span className="text-[#A8E63A]">W-DRIVER</span>
                </h2>
                <p className="text-xs text-zinc-300 mt-1 max-w-xs leading-relaxed">
                  Transporte legal de passageiros e encomendas desde 2009. Escolha como deseja acessar:
                </p>
              </div>

              {/* Two Primary Role Cards */}
              <div className="space-y-3 pt-1">
                {/* FOUNDER STORY BANNER */}
                <div
                  onClick={() => setShowFounderBio(true)}
                  className="p-3 rounded-2xl bg-gradient-to-r from-[#17202b] to-[#12161c] border border-[#A8E63A]/40 hover:border-[#A8E63A] transition cursor-pointer flex items-center justify-between group shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#A8E63A]/20 border border-[#A8E63A]/50 flex items-center justify-center text-[#A8E63A]">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white group-hover:text-[#A8E63A] transition">
                          História do Fundador
                        </span>
                        <span className="px-1.5 py-0.2 rounded-full bg-[#A8E63A] text-black text-[8px] font-black uppercase">
                          Desde 2009
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400">
                        Conheça a trajetória de Wallace Motorista e o propósito da W-DRIVER
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-[#A8E63A] transition" />
                </div>

                {/* 1. PASSENGER CARD BUTTON */}
                <div
                  onClick={() => setStep('passenger_register')}
                  className="group p-4 rounded-2xl bg-gradient-to-r from-zinc-900 to-[#12161c] border-2 border-zinc-800 hover:border-[#A8E63A] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(168,230,58,0.2)] active:scale-[0.98] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#A8E63A]/20 border border-[#A8E63A]/50 flex items-center justify-center text-[#A8E63A] group-hover:scale-105 transition">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-black text-white group-hover:text-[#A8E63A] transition">
                          Quero ser Passageiro
                        </h3>
                        <span className="px-1.5 py-0.2 rounded-full bg-[#A8E63A] text-black text-[8px] font-black uppercase">
                          CUPOM W0701
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Viagens seguras, motoristas verificados e preço justo.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-[#A8E63A] group-hover:translate-x-0.5 transition" />
                </div>

                {/* 2. DRIVER CARD BUTTON */}
                <div
                  onClick={() => setStep('driver_register')}
                  className="group p-4 rounded-2xl bg-gradient-to-r from-zinc-900 to-[#12161c] border-2 border-zinc-800 hover:border-[#A8E63A] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(168,230,58,0.2)] active:scale-[0.98] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
                      <Car className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-black text-white group-hover:text-emerald-400 transition">
                          Quero ser Motorista
                        </h3>
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[8px] font-black uppercase">
                          TETO R$ 70
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Trabalhe com autonomia, suporte 24h e teto fixo de comissão.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
                </div>
              </div>

              {/* Quick Entry Strip for Existing Users */}
              <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                <p className="text-[10px] text-center font-bold text-zinc-400 uppercase tracking-wider">
                  Já possui conta cadastrada?
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onSelectRole('passenger');
                      onClose();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-200 hover:text-white transition flex items-center justify-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-[#A8E63A]" />
                    <span>Entrar Passageiro</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectRole('driver');
                      onClose();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-200 hover:text-white transition flex items-center justify-center gap-1.5"
                  >
                    <Car className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Entrar Motorista</span>
                  </button>
                </div>
              </div>

              {/* CEO Master Access Link */}
              <div className="pt-2 text-center">
                <button
                  onClick={() => {
                    onClose();
                    onOpenMasterAuth();
                  }}
                  className="text-[11px] text-zinc-500 hover:text-zinc-300 font-medium inline-flex items-center gap-1 transition"
                >
                  <Lock className="w-3 h-3" />
                  <span>Acesso Administrativo (CEO Master)</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PASSENGER REGISTRATION FORM */}
          {step === 'passenger_register' && (
            <form onSubmit={handlePassengerSubmit} className="space-y-3 animate-slide-up">
              <div className="text-center pb-1">
                <div className="w-10 h-10 rounded-2xl bg-[#A8E63A]/20 border border-[#A8E63A]/50 flex items-center justify-center text-[#A8E63A] mx-auto mb-2">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-white">Cadastro de Passageiro VIP</h3>
                <p className="text-xs text-zinc-400">
                  Preencha seus dados para solicitar corridas com desconto imediato.
                </p>
              </div>

              {/* Nome Completo */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">Nome Completo *</label>
                <input
                  type="text"
                  value={passName}
                  onChange={(e) => setPassName(e.target.value)}
                  placeholder="Ex: Carlos Eduardo Silva"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#A8E63A]"
                  required
                />
              </div>

              {/* CPF e Telefone */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-300">CPF *</label>
                  <input
                    type="text"
                    value={passCpf}
                    onChange={(e) => setPassCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#A8E63A]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-300">WhatsApp / Celular *</label>
                  <input
                    type="tel"
                    value={passPhone}
                    onChange={(e) => setPassPhone(e.target.value)}
                    placeholder="(83) 99999-0000"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#A8E63A]"
                    required
                  />
                </div>
              </div>

              {/* E-mail */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">E-mail</label>
                <input
                  type="email"
                  value={passEmail}
                  onChange={(e) => setPassEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#A8E63A]"
                />
              </div>

              {/* Senha */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">Senha de Acesso *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passPassword}
                    onChange={(e) => setPassPassword(e.target.value)}
                    placeholder="Mínimo de 6 dígitos"
                    className="w-full pl-3 pr-9 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#A8E63A]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Código de Indicação (W0701) */}
              <div className="p-2.5 rounded-xl bg-black/60 border border-dashed border-[#A8E63A]/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#A8E63A]" />
                  <div>
                    <p className="text-[10px] font-bold text-zinc-300">Código de Desconto</p>
                    <p className="text-xs font-mono font-black text-[#A8E63A]">W0701 (Ativo)</p>
                  </div>
                </div>
                <span className="text-[9px] font-black text-[#A8E63A] bg-[#A8E63A]/10 px-2 py-0.5 rounded-md">
                  R$ 5,00 OFF
                </span>
              </div>

              {/* Termos de Uso Checkbox */}
              <label className="flex items-start gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={passTermsAccepted}
                  onChange={(e) => setPassTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-[#A8E63A] focus:ring-[#A8E63A] bg-zinc-900 border-zinc-800"
                  required
                />
                <span className="text-[10px] text-zinc-400 leading-tight">
                  Concordo com os Termos de Uso e Política de Privacidade da W-DRIVER Oficial 3.0.
                </span>
              </label>

              {/* Botão de Ação Requisitado */}
              <button
                type="submit"
                disabled={!passTermsAccepted}
                className="w-full py-3 rounded-xl bg-[#A8E63A] hover:bg-[#95d130] text-black font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg transition active:scale-95 disabled:opacity-50"
              >
                <span>Concluir Cadastro de Passageiro</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 3: DRIVER REGISTRATION FORM */}
          {step === 'driver_register' && (
            <form onSubmit={handleDriverSubmit} className="space-y-3 animate-slide-up">
              <div className="text-center pb-1">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto mb-2">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-white">Credenciamento de Motorista Oficial</h3>
                <p className="text-xs text-zinc-400">
                  Preencha os dados do condutor e do veículo para análise presencial.
                </p>
              </div>

              {/* Categoria Pretendida */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">Categoria de Transporte *</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'w-carro', label: 'W-Carro' },
                    { id: 'w-moto', label: 'W-Moto' },
                    { id: 'w-taxi', label: 'W-Táxi' },
                    { id: 'w-bike', label: 'W-Bike' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setDrvCategory(cat.id as any)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                        drvCategory === cat.id
                          ? 'bg-[#A8E63A] text-black border-[#A8E63A]'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modalidade de Atuação */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">Modalidade de Atendimento *</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'comum', label: 'Comum', desc: 'Padrão' },
                    { id: 'prime', label: 'Prime', desc: 'Ar & Conforto' },
                    { id: 'contrato', label: 'Contratos', desc: 'Empresas/PJ' },
                  ].map((mod) => (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => setDrvModalityInterest(mod.id as any)}
                      className={`p-1.5 rounded-xl text-center border transition ${
                        drvModalityInterest === mod.id
                          ? 'bg-[#A8E63A]/10 border-[#A8E63A] text-[#A8E63A]'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <div className="text-xs font-bold">{mod.label}</div>
                      <div className="text-[9px] opacity-75">{mod.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dupla Etapa Banner */}
              <div className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-1">
                <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Dupla Etapa de Homologação:</span>
                </div>
                <p className="text-[10px] text-zinc-300 leading-tight">
                  <strong>1ª Etapa:</strong> Pré-cadastro digital com CNH e dados do veículo.<br/>
                  <strong>2ª Etapa:</strong> Validação Presencial Obrigatória em Ponto de Apoio W-DRIVER.
                </p>
              </div>

              {/* Nome Completo */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">Nome Completo *</label>
                <input
                  type="text"
                  value={drvName}
                  onChange={(e) => setDrvName(e.target.value)}
                  placeholder="Nome idêntico à CNH"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#A8E63A]"
                  required
                />
              </div>

              {/* CNH e CPF */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-300">Número da CNH (EAR) *</label>
                  <input
                    type="text"
                    value={drvCnh}
                    onChange={(e) => setDrvCnh(e.target.value)}
                    placeholder="00000000000"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#A8E63A]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-300">WhatsApp / Celular *</label>
                  <input
                    type="tel"
                    value={drvPhone}
                    onChange={(e) => setDrvPhone(e.target.value)}
                    placeholder="(83) 99999-0000"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#A8E63A]"
                    required
                  />
                </div>
              </div>

              {/* Veículo: Modelo e Placa */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-300">Modelo do Veículo *</label>
                  <input
                    type="text"
                    value={drvVehicleModel}
                    onChange={(e) => setDrvVehicleModel(e.target.value)}
                    placeholder="Ex: Onix Plus 1.0"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#A8E63A]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-300">Placa do Veículo *</label>
                  <input
                    type="text"
                    value={drvVehiclePlate}
                    onChange={(e) => setDrvVehiclePlate(e.target.value.toUpperCase())}
                    placeholder="ABC-1D23"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white font-mono uppercase placeholder-zinc-500 focus:outline-none focus:border-[#A8E63A]"
                    required
                  />
                </div>
              </div>

              {/* Cor e Ano */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-300">Cor do Veículo</label>
                  <input
                    type="text"
                    value={drvVehicleColor}
                    onChange={(e) => setDrvVehicleColor(e.target.value)}
                    placeholder="Ex: Prata"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#A8E63A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-300">Ano de Fabricação</label>
                  <input
                    type="text"
                    value={drvVehicleYear}
                    onChange={(e) => setDrvVehicleYear(e.target.value)}
                    placeholder="2022"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#A8E63A]"
                  />
                </div>
              </div>

              {/* Naturalidade e Residência (Regra Obrigatória) */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/30 to-zinc-900 border border-amber-500/40 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Regra de Naturalidade & Residência:</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-300">Natural de (UF) *</label>
                    <select
                      value={drvBirthState}
                      onChange={(e) => setDrvBirthState(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#A8E63A]"
                    >
                      {BRAZILIAN_STATES.map((st) => (
                        <option key={st.uf} value={st.uf}>
                          {st.uf} - {st.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-300">Reside em (UF) *</label>
                    <select
                      value={drvResidenceState}
                      onChange={(e) => setDrvResidenceState(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#A8E63A]"
                    >
                      {BRAZILIAN_STATES.map((st) => (
                        <option key={st.uf} value={st.uf}>
                          {st.uf} - {st.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {isDrvOutOfState && (
                  <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-[10px] text-amber-200 leading-snug">
                    <strong>⚠️ ATENÇÃO MOTORISTA DE OUTRO ESTADO:</strong> Por segurança e credibilidade, você precisará enviar a <u>Certidão Estadual de {drvBirthState}</u> (nascimento) + <u>Certidão de {drvResidenceState}</u> (residência) + <u>Federal</u>.
                  </div>
                )}
              </div>

              {/* Certidões de Antecedentes Criminais */}
              <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-1.5 text-zinc-300 font-bold text-[11px]">
                  <FileCheck className="w-3.5 h-3.5 text-[#A8E63A]" />
                  <span>Validação de Antecedentes Criminais Obrigatórias:</span>
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={drvCriminalCertFederal}
                    onChange={(e) => setDrvCriminalCertFederal(e.target.checked)}
                    className="mt-0.5 rounded text-[#A8E63A] focus:ring-[#A8E63A] bg-zinc-950 border-zinc-800"
                    required
                  />
                  <span className="text-[10px] text-zinc-300 leading-tight">
                    Possuo Certidão Negativa da Polícia Federal (Portal Gov.br).
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={drvCriminalCertEstadual}
                    onChange={(e) => setDrvCriminalCertEstadual(e.target.checked)}
                    className="mt-0.5 rounded text-[#A8E63A] focus:ring-[#A8E63A] bg-zinc-950 border-zinc-800"
                    required
                  />
                  <span className="text-[10px] text-zinc-300 leading-tight">
                    Possuo Certidão Negativa da Justiça Estadual de {drvResidenceState} (Residência).
                  </span>
                </label>

                {isDrvOutOfState && (
                  <label className="flex items-start gap-2 cursor-pointer p-1.5 rounded-lg bg-amber-950/40 border border-amber-500/40">
                    <input
                      type="checkbox"
                      checked={drvCriminalCertOriginState}
                      onChange={(e) => setDrvCriminalCertOriginState(e.target.checked)}
                      className="mt-0.5 rounded text-amber-400 focus:ring-amber-400 bg-zinc-950 border-amber-500"
                      required
                    />
                    <span className="text-[10px] text-amber-200 font-bold leading-tight">
                      Possuo Certidão Negativa da Justiça Estadual de {drvBirthState} (Estado de Nascimento - Obrigatória).
                    </span>
                  </label>
                )}
              </div>

              {/* 2ª ETAPA DE HOMOLOGAÇÃO: VISTORIA PRESENCIAL NA RESIDÊNCIA */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-950/40 via-zinc-900 to-black border border-[#A8E63A]/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[#A8E63A] bg-[#A8E63A]/10 px-2 py-0.5 rounded-full">
                    2ª Etapa Obrigatória: Vistoria Presencial
                  </span>
                  <span className="text-[9px] text-[#A8E63A] font-bold">100% Residencial</span>
                </div>

                <p className="text-[10px] text-zinc-300 leading-snug">
                  Para máxima segurança e validação documental, a vistoria do veículo e a coleta de dados é realizada <strong>presencialmente na sua residência</strong> por um <strong>Representante Legal Oficial</strong> da Central W-DRIVER. <strong className="text-[#A8E63A]">Havendo confirmação, seu cadastro é liberado imediatamente!</strong>
                </p>

                <div className="space-y-1 pt-1 border-t border-zinc-800/80">
                  <label className="text-[10px] font-bold text-[#A8E63A] flex items-center justify-between">
                    <span>Endereço Residencial Completo (Para visita e vistoria) *</span>
                    <span className="text-[8.5px] text-zinc-400 font-normal">Rua, Nº, Bairro, Ref.</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={drvSecondStageAddress}
                    onChange={(e) => setDrvSecondStageAddress(e.target.value)}
                    placeholder="Ex: Rua das Acácias, 230 - Apt 102, Manaíra"
                    className="w-full px-2.5 py-1.5 rounded-xl bg-black border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#A8E63A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-300">
                    Melhor Turno para Receber o Representante Legal:
                  </label>
                  <select
                    value={drvPreferredTime}
                    onChange={(e) => setDrvPreferredTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#A8E63A]"
                  >
                    <option value="Manhã (08h às 12h)">Manhã (08h às 12h)</option>
                    <option value="Tarde (13h às 17h)">Tarde (13h às 17h)</option>
                    <option value="Noite (18h às 20h)">Noite (18h às 20h)</option>
                    <option value="Final de Semana (Sábado pela manhã)">Final de Semana (Sábado pela manhã)</option>
                  </select>
                </div>
              </div>

              {/* Termos de Parceria */}
              <label className="flex items-start gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={drvTermsAccepted}
                  onChange={(e) => setDrvTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-[#A8E63A] focus:ring-[#A8E63A] bg-zinc-900 border-zinc-800"
                  required
                />
                <span className="text-[10px] text-zinc-400 leading-tight">
                  Declaro que as informações são verdadeiras e aceito os Termos de Credenciamento W-DRIVER.
                </span>
              </label>

              {/* Botão de Ação Requisitado */}
              <button
                type="submit"
                disabled={
                  !drvTermsAccepted ||
                  !drvCriminalCertFederal ||
                  !drvCriminalCertEstadual ||
                  (isDrvOutOfState && !drvCriminalCertOriginState)
                }
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg transition active:scale-95 disabled:opacity-50"
              >
                <span>Enviar Pré-Cadastro para Homologação</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 'success' && (
            <div className="text-center py-6 space-y-4 animate-slide-up">
              <div className="w-16 h-16 rounded-full bg-[#A8E63A]/20 border border-[#A8E63A] flex items-center justify-center mx-auto text-[#A8E63A] shadow-[0_0_20px_rgba(168,230,58,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">{successMessage.title}</h3>
                <p className="text-xs text-zinc-300 max-w-xs mx-auto leading-relaxed">
                  {successMessage.description}
                </p>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => {
                    onSelectRole(successMessage.role);
                    onClose();
                  }}
                  className="w-full py-3.5 rounded-xl bg-[#A8E63A] hover:bg-[#95d130] text-black font-black text-xs uppercase transition shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Acessar Aplicativo Agora</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Security Badge */}
        <div className="p-3 bg-black/90 border-t border-zinc-800/80 text-center">
          <p className="text-[10px] text-zinc-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A8E63A]" />
            <span>W-DRIVER 3.0 • Transporte Legal e Seguro Homologado</span>
          </p>
        </div>
      </div>

      {/* Modal da História Oficial do Fundador Wallace Motorista */}
      <FounderBioModal
        isOpen={showFounderBio}
        onClose={() => setShowFounderBio(false)}
      />
    </div>
  );
};
