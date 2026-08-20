import React, { useState } from 'react';
import { LeadCapture } from '../types';
import { Logo } from './Logo';
import { BRAZILIAN_STATES } from '../constants';
import {
  Users,
  UserCheck,
  Bike,
  Flame,
  Car,
  ShieldCheck,
  CheckCircle2,
  X,
  Send,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  FileText,
  Briefcase,
  User,
  Building2,
  MessageCircle,
  ExternalLink,
  Camera,
  Home,
  FileCheck,
  AlertTriangle,
  UploadCloud,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CustomerAcquisitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadCaptured: (lead: LeadCapture) => void;
  initialMode?: 'work' | 'passenger' | 'contract';
  initialReferralCode?: string;
}

export const CustomerAcquisitionModal: React.FC<CustomerAcquisitionModalProps> = ({
  isOpen,
  onClose,
  onLeadCaptured,
  initialMode = 'work',
  initialReferralCode = 'W0701',
}) => {
  const [mainMode, setMainMode] = useState<'work' | 'passenger' | 'contract'>(initialMode);
  const [partnerCategory, setPartnerCategory] = useState<'biker' | 'motoboy' | 'driver' | 'taxi'>('driver');

  // Personal Info
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [cnhNumber, setCnhNumber] = useState<string>('');
  const [city, setCity] = useState<string>('João Pessoa - PB');

  // Naturalidade & Residência
  const [birthState, setBirthState] = useState<string>('PB');
  const [residenceState, setResidenceState] = useState<string>('PB');

  // Document attachments / confirmations
  const [profilePhotoAttached, setProfilePhotoAttached] = useState<boolean>(true);
  const [residenceProofAttached, setResidenceProofAttached] = useState<boolean>(true);
  const [cnhEarAttached, setCnhEarAttached] = useState<boolean>(true);
  const [crlvAttached, setCrlvAttached] = useState<boolean>(true);
  const [criminalCertFederal, setCriminalCertFederal] = useState<boolean>(true);
  const [criminalCertResidenceState, setCriminalCertResidenceState] = useState<boolean>(true);
  const [criminalCertOriginState, setCriminalCertOriginState] = useState<boolean>(true);

  // 2ª Etapa de Homologação: Central ou Residência (Envio de Representante Legal)
  const [secondStageMethod, setSecondStageMethod] = useState<'central' | 'residence'>('residence');
  const [secondStageAddress, setSecondStageAddress] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>('Manhã (08h às 12h)');

  // Corporate & Vehicle
  const [companyName, setCompanyName] = useState<string>('');
  const [cnpj, setCnpj] = useState<string>('');
  const [employeeCount, setEmployeeCount] = useState<string>('');
  const [vehicleModel, setVehicleModel] = useState<string>('');
  const [vehiclePlate, setVehiclePlate] = useState<string>('');
  const [referralCodeInput, setReferralCodeInput] = useState<string>(initialReferralCode || 'W0701');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Sync mode if changed from props
  React.useEffect(() => {
    setMainMode(initialMode);
  }, [initialMode]);

  React.useEffect(() => {
    if (initialReferralCode) {
      setReferralCodeInput(initialReferralCode);
    }
  }, [initialReferralCode]);

  if (!isOpen) return null;

  const isOutOfState = birthState !== residenceState;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    let leadType: 'passenger' | 'driver' | 'biker' | 'motoboy' | 'taxi' = 'passenger';
    if (mainMode === 'work') {
      leadType = partnerCategory;
    } else if (mainMode === 'contract') {
      leadType = 'driver';
    }

    const newLead: LeadCapture = {
      id: `lead-${Date.now()}`,
      name: mainMode === 'contract' && companyName ? `${companyName} (${name})` : name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      phone,
      cpf: cpf || undefined,
      cnhNumber: cnhNumber || undefined,
      companyCnpj: cnpj || undefined,
      contractNotes:
        mainMode === 'contract'
          ? `Empresa: ${companyName} | Funcionários: ${employeeCount || 'A definir'}`
          : undefined,
      city,
      birthState,
      residenceState,
      isOutOfState,
      criminalCertFederal,
      criminalCertResidenceState,
      criminalCertOriginState: isOutOfState ? criminalCertOriginState : undefined,
      cnhEarAttached: mainMode === 'work' ? cnhEarAttached : undefined,
      crlvAttached: mainMode === 'work' ? crlvAttached : undefined,
      residenceProofAttached: mainMode === 'work' ? residenceProofAttached : undefined,
      profilePhotoAttached: mainMode === 'work' ? profilePhotoAttached : undefined,
      secondStageMethod: 'residence',
      secondStageAddress:
        mainMode === 'work'
          ? secondStageAddress.trim() || 'Endereço residencial a confirmar'
          : undefined,
      secondStageDate: mainMode === 'work' ? `Preferência: ${preferredTime}` : undefined,
      secondStageRepresentative:
        mainMode === 'work'
          ? 'Representante Legal Oficial (Enviado pela Central W-DRIVER)'
          : undefined,
      secondStageStatus: 'pending_scheduling',
      type: leadType,
      status: 'pending_approval',
      vehicleDetails:
        mainMode === 'work'
          ? `${vehicleModel ? vehicleModel : 'Veículo a cadastrar'} - Placa: ${vehiclePlate || 'A verificar'}`
          : undefined,
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };

    onLeadCaptured(newLead);
    setIsSuccess(true);
    confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
  };

  // WhatsApp numbers
  const whatsAppNumber =
    mainMode === 'passenger'
      ? '5583988381869'
      : mainMode === 'work'
      ? '5583996830050'
      : '5583981179524';

  const whatsAppLabel =
    mainMode === 'passenger'
      ? 'WhatsApp Passageiro: (83) 98838-1869'
      : mainMode === 'work'
      ? 'WhatsApp Parceiro Motorista: (83) 99683-0050'
      : 'WhatsApp Contratos PJ: (83) 98117-9524';

  const openDirectWhatsApp = () => {
    const text =
      mainMode === 'passenger'
        ? `Olá W-DRIVER Oficial! Meu nome é ${name || 'Passageiro'}, gostaria de suporte e informações sobre viagens.`
        : mainMode === 'work'
        ? `Olá W-DRIVER Oficial! Meu nome é ${name || 'Motorista Parceiro'}, realizei o pré-cadastro na categoria ${partnerCategory.toUpperCase()} (Naturalidade: ${birthState} / Residência: ${residenceState}).
2ª Etapa: Vistoria & Coleta Presencial na Minha Residência pelo Representante Legal Oficial.
Endereço para visita: ${secondStageAddress || 'A informar'}.
Horário preferido: ${preferredTime}.
Gostaria de agendar a visita para vistoria e liberação do cadastro.`
        : `Olá W-DRIVER Oficial! Meu nome é ${name || 'Gestor'} da empresa ${companyName || 'minha empresa'}, gostaria de fechar contrato corporativo de transporte para funcionários.`;

    window.open(`https://api.whatsapp.com/send?phone=${whatsAppNumber}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in text-white select-none overflow-y-auto">
      <div className="bg-[#0D0F12] border border-zinc-800 rounded-3xl p-4 sm:p-6 max-w-2xl w-full space-y-4 shadow-2xl relative max-h-[94vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-zinc-800 transition z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* TOP OFFICIAL BANNER: "PRÉ-CADASTRO COMO PARCEIRO W-DRIVER! - Desde 2009" */}
        <div className="text-center space-y-1 pt-1 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center justify-center gap-2">
            <Logo variant="W-DRIVER" size="md" className="justify-center" />
          </div>
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#A8E63A]/10 border border-[#A8E63A]/30 text-[#A8E63A] text-[10px] font-black uppercase tracking-wider mt-1">
            Desde 2009 • Transporte Legal & Seguro
          </div>
          <h2 className="text-lg sm:text-xl font-black text-[#A8E63A] uppercase tracking-wide">
            PRÉ-CADASTRO COMO PARCEIRO W-DRIVER!
          </h2>
          <p className="text-xs text-zinc-300 max-w-md mx-auto">
            Plataforma 100% legalizada em conformidade com as diretrizes de segurança urbana.
          </p>
        </div>

        {/* 3 Main Mode Selectors: 👤 Quero Viajar | 🚗 Motorista Parceiro | 🏢 Contratos PJ */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-black rounded-2xl border border-zinc-800">
          <button
            type="button"
            onClick={() => {
              setMainMode('work');
              setIsSuccess(false);
            }}
            className={`py-2 px-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition ${
              mainMode === 'work'
                ? 'bg-[#A8E63A] text-black shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Motorista</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMainMode('passenger');
              setIsSuccess(false);
            }}
            className={`py-2 px-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition ${
              mainMode === 'passenger'
                ? 'bg-[#A8E63A] text-black shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Passageiro</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMainMode('contract');
              setIsSuccess(false);
            }}
            className={`py-2 px-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition ${
              mainMode === 'contract'
                ? 'bg-[#A8E63A] text-black shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Contratos PJ</span>
          </button>
        </div>

        {/* If Mode = Work, Sub-tabs for Partner Categories */}
        {mainMode === 'work' && !isSuccess && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Selecione a categoria de transporte:
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => setPartnerCategory('driver')}
                className={`p-2 rounded-xl text-center flex flex-col items-center gap-0.5 border transition ${
                  partnerCategory === 'driver'
                    ? 'bg-[#A8E63A]/15 border-[#A8E63A] text-white shadow-sm'
                    : 'bg-black/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Car className="w-4 h-4 text-[#A8E63A]" />
                <span className="text-[10px] font-bold">W-CARRO</span>
                <span className="text-[8px] text-zinc-400">Motorista</span>
              </button>

              <button
                type="button"
                onClick={() => setPartnerCategory('motoboy')}
                className={`p-2 rounded-xl text-center flex flex-col items-center gap-0.5 border transition ${
                  partnerCategory === 'motoboy'
                    ? 'bg-[#A8E63A]/15 border-[#A8E63A] text-white shadow-sm'
                    : 'bg-black/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Flame className="w-4 h-4 text-[#A8E63A]" />
                <span className="text-[10px] font-bold">W-MOTO</span>
                <span className="text-[8px] text-zinc-400">Motociclista</span>
              </button>

              <button
                type="button"
                onClick={() => setPartnerCategory('taxi')}
                className={`p-2 rounded-xl text-center flex flex-col items-center gap-0.5 border transition ${
                  partnerCategory === 'taxi'
                    ? 'bg-[#A8E63A]/15 border-[#A8E63A] text-white shadow-sm'
                    : 'bg-black/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#A8E63A]" />
                <span className="text-[10px] font-bold">W-TÁXI</span>
                <span className="text-[8px] text-zinc-400">Taxista</span>
              </button>

              <button
                type="button"
                onClick={() => setPartnerCategory('biker')}
                className={`p-2 rounded-xl text-center flex flex-col items-center gap-0.5 border transition ${
                  partnerCategory === 'biker'
                    ? 'bg-[#A8E63A]/15 border-[#A8E63A] text-white shadow-sm'
                    : 'bg-black/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Bike className="w-4 h-4 text-[#A8E63A]" />
                <span className="text-[10px] font-bold">W-BIKE</span>
                <span className="text-[8px] text-zinc-400">Ciclista</span>
              </button>
            </div>
          </div>
        )}

        {/* 3 OFFICIAL PILLARS FROM POSTER (When Mode = Work) */}
        {mainMode === 'work' && !isSuccess && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {/* PILLAR 1 */}
            <div className="p-3 rounded-2xl bg-black/60 border-2 border-[#A8E63A]/40 space-y-1.5">
              <div className="text-[11px] font-black text-[#A8E63A] uppercase tracking-wide flex items-center gap-1">
                <span>1. IDENTIFICAÇÃO & RESIDÊNCIA</span>
              </div>
              <div className="space-y-1 text-[10.5px] text-zinc-300">
                <div className="flex items-start gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#A8E63A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Foto de Perfil</strong>
                    <span className="text-zinc-400 text-[9.5px]">De frente, centralizada, sem óculos</span>
                  </div>
                </div>
                <div className="flex items-start gap-1.5 pt-1">
                  <Home className="w-3.5 h-3.5 text-[#A8E63A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Comprovante Residência</strong>
                    <span className="text-zinc-400 text-[9.5px]">Recente, até 90 dias, de qualquer estado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PILLAR 2 */}
            <div className="p-3 rounded-2xl bg-black/60 border-2 border-[#A8E63A]/40 space-y-1.5">
              <div className="text-[11px] font-black text-[#A8E63A] uppercase tracking-wide flex items-center gap-1">
                <span>2. HABILITAÇÃO & SEGURANÇA</span>
              </div>
              <div className="space-y-1 text-[10.5px] text-zinc-300">
                <div className="flex items-start gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#A8E63A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">CNH COM EAR</strong>
                    <span className="text-zinc-400 text-[9.5px]">Exerce Atividade Remunerada</span>
                  </div>
                </div>
                <div className="flex items-start gap-1.5 pt-1">
                  <FileCheck className="w-3.5 h-3.5 text-[#A8E63A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Certidões Antecedentes</strong>
                    <span className="text-zinc-400 text-[9.5px]">Portal Gov.br e Estaduais</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PILLAR 3 */}
            <div className="p-3 rounded-2xl bg-black/60 border-2 border-[#A8E63A]/40 space-y-1.5">
              <div className="text-[11px] font-black text-[#A8E63A] uppercase tracking-wide flex items-center gap-1">
                <span>3. VEÍCULO & CATEGORIAS</span>
              </div>
              <div className="space-y-1 text-[10.5px] text-zinc-300">
                <div className="flex items-start gap-1.5">
                  <Car className="w-3.5 h-3.5 text-[#A8E63A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Foto do CRLV</strong>
                    <span className="text-zinc-400 text-[9.5px]">Certificado do Veículo, do ano</span>
                  </div>
                </div>
                <div className="flex items-start gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A8E63A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Checagem de Segurança</strong>
                    <span className="text-zinc-400 text-[9.5px]">Conforme regra de naturalidade</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REGRA DE NATURALIDADE & RESIDÊNCIA (Documentos Antecedentes Criminais) - EXATAMENTE DO POSTER */}
        {mainMode === 'work' && !isSuccess && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-black border-2 border-amber-500/60 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <h4 className="text-xs font-black text-amber-300 uppercase tracking-wide">
                REGRA DE NATURALIDADE & RESIDÊNCIA (Documentos Antecedentes Criminais)
              </h4>
            </div>

            <div className="p-2.5 rounded-xl bg-black/80 border border-amber-500/30 text-[11px] text-zinc-200 leading-relaxed space-y-1">
              <p className="font-bold text-amber-200">
                ⚠️ IMPORTANTE PARA MOTORISTAS NATURAIS DE OUTRO ESTADO (AUMENTO DE SEGURANÇA E CREDIBILIDADE):
              </p>
              <p className="text-zinc-300">
                Além da <strong className="text-white">Certidão Federal</strong> e da{' '}
                <strong className="text-white">Certidão Estadual da Paraíba (Onde reside)</strong>, é{' '}
                <strong className="text-[#A8E63A] underline">
                  OBRIGATÓRIO enviar também a CERTIDÃO ESTADUAL de Antecedentes Criminais do estado em que você nasceu. ✓
                </strong>
              </p>
            </div>

            {/* Selectors for Birth State and Current Residence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-zinc-300">
                  Estado onde Nasceu (Naturalidade) *
                </label>
                <select
                  value={birthState}
                  onChange={(e) => setBirthState(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#A8E63A] outline-none"
                >
                  {BRAZILIAN_STATES.map((st) => (
                    <option key={st.uf} value={st.uf}>
                      {st.name} ({st.uf})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-zinc-300">
                  Estado onde Reside Atualmente *
                </label>
                <select
                  value={residenceState}
                  onChange={(e) => setResidenceState(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#A8E63A] outline-none"
                >
                  {BRAZILIAN_STATES.map((st) => (
                    <option key={st.uf} value={st.uf}>
                      {st.name} ({st.uf})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dynamic Status Tag */}
            <div className="flex items-center justify-between text-[10.5px] px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800">
              <span className="text-zinc-400">Exigência de Certidões:</span>
              <span className={`font-black ${isOutOfState ? 'text-amber-400' : 'text-[#A8E63A]'}`}>
                {isOutOfState
                  ? `Natural de ${birthState} • Reside em ${residenceState} (2 Estaduais + 1 Federal Obrigatórias)`
                  : `Natural de ${birthState} (1 Estadual + 1 Federal)`}
              </span>
            </div>
          </div>
        )}

        {/* Success View */}
        {isSuccess ? (
          <div className="bg-[#14181f] border border-[#A8E63A]/40 rounded-2xl p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#A8E63A]/20 border border-[#A8E63A] flex items-center justify-center mx-auto text-[#A8E63A]">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-black text-white">Cadastro Enviado ao Painel Master CEO!</h4>
              <p className="text-xs text-zinc-300">
                {mainMode === 'passenger'
                  ? 'Seus dados de passageiro foram enviados para validação da Diretoria e já estão no Painel Master.'
                  : mainMode === 'work'
                  ? `Seus dados para atuação como parceiro oficial (${partnerCategory.toUpperCase()}) foram recebidos pela Central.`
                  : 'Sua solicitação de contrato corporativo para empresas foi enviada ao departamento comercial.'}
              </p>
            </div>

            <div className="bg-black/70 p-3 rounded-xl border border-zinc-800 text-[11px] text-zinc-300 text-left space-y-1">
              <div>• <strong>Nome:</strong> {name}</div>
              <div>• <strong>WhatsApp:</strong> {phone}</div>
              {cpf && <div>• <strong>CPF:</strong> {cpf}</div>}
              {cnhNumber && <div>• <strong>CNH:</strong> {cnhNumber}</div>}
              {mainMode === 'work' && (
                <>
                  <div>• <strong>Naturalidade:</strong> {birthState} | <strong>Residência:</strong> {residenceState}</div>
                  <div className="text-[#A8E63A] font-bold">
                    • <strong>2ª Etapa (Vistoria Presencial):</strong>{' '}
                    Visita na Residência ({secondStageAddress || 'A confirmar'} - {preferredTime})
                  </div>
                  <div className="text-zinc-400 text-[10px]">
                    * A Central enviará um Representante Legal Oficial até sua residência para vistoria do veículo e conferência de dados. Havendo confirmação, seu cadastro será liberado!
                  </div>
                </>
              )}
              <div>• <strong>Canal de Suporte:</strong> {whatsAppLabel.split(':')[1]}</div>
              {referralCodeInput && <div>• <strong>Código de Indicação:</strong> {referralCodeInput}</div>}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={openDirectWhatsApp}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Confirmar via WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-[#A8E63A] hover:bg-[#95d130] text-black text-xs font-black transition shadow-lg"
              >
                Entrar no App
              </button>
            </div>
          </div>
        ) : (
          /* Main Form */
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Corporate Mode Specific Fields */}
            {mainMode === 'contract' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/30">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-cyan-300">Razão Social / Nome da Empresa *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Empresa de Logística & Serviços LTDA"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-cyan-400 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-cyan-300">CNPJ ou CPF do Gestor *</label>
                  <input
                    type="text"
                    required
                    placeholder="00.000.000/0001-00"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-cyan-400 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-cyan-300">Nº de Funcionários (Crachá/Farda)</label>
                  <input
                    type="text"
                    placeholder="Ex: 25 colaboradores"
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Basic Personal Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">
                  {mainMode === 'contract' ? 'Nome do Gestor / Contato *' : 'Nome Completo *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Wallace Soares"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#A8E63A] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">WhatsApp Oficial *</label>
                <input
                  type="tel"
                  required
                  placeholder="(83) 99683-0050"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#A8E63A] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">CPF do Titular *</label>
                <input
                  type="text"
                  required={mainMode !== 'contract'}
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#A8E63A] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">E-mail</label>
                <input
                  type="email"
                  placeholder="wdriveroficial@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#A8E63A] outline-none"
                />
              </div>
            </div>

            {/* Additional Fields for Driver/Work Mode */}
            {mainMode === 'work' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-300">Número da CNH (EAR) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 01234567890"
                      value={cnhNumber}
                      onChange={(e) => setCnhNumber(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#A8E63A] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-300">
                      {partnerCategory === 'biker' ? 'Modelo da Bicicleta' : 'Modelo do Veículo'}
                    </label>
                    <input
                      type="text"
                      placeholder={
                        partnerCategory === 'biker'
                          ? 'Ex: Caloi Vulcan / Elétrica'
                          : partnerCategory === 'motoboy'
                          ? 'Ex: Honda CG 160 Fan'
                          : partnerCategory === 'taxi'
                          ? 'Ex: Toyota Corolla Táxi'
                          : 'Ex: Fiat Cronos / Corolla Cross'
                      }
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#A8E63A] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-300">
                      {partnerCategory === 'biker' ? 'Equipamento' : 'Placa do Veículo'}
                    </label>
                    <input
                      type="text"
                      placeholder={partnerCategory === 'biker' ? 'Ex: Mochila Térmica' : 'Ex: WDR-2026'}
                      value={vehiclePlate}
                      onChange={(e) => setVehiclePlate(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#A8E63A] outline-none uppercase"
                    />
                  </div>
                </div>

                {/* Document Verification Checkboxes */}
                <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="text-[11px] font-bold text-zinc-300 flex items-center justify-between">
                    <span>Documentação Obrigatória para Homologação:</span>
                    <span className="text-[10px] text-[#A8E63A]">Checklist Oficial</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px]">
                    <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg bg-black/60 border border-zinc-800/80">
                      <input
                        type="checkbox"
                        checked={profilePhotoAttached}
                        onChange={(e) => setProfilePhotoAttached(e.target.checked)}
                        className="rounded text-[#A8E63A] focus:ring-[#A8E63A] bg-zinc-900 border-zinc-700"
                        required
                      />
                      <span className="text-zinc-300">Foto de Perfil (de frente, sem óculos)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg bg-black/60 border border-zinc-800/80">
                      <input
                        type="checkbox"
                        checked={residenceProofAttached}
                        onChange={(e) => setResidenceProofAttached(e.target.checked)}
                        className="rounded text-[#A8E63A] focus:ring-[#A8E63A] bg-zinc-900 border-zinc-700"
                        required
                      />
                      <span className="text-zinc-300">Comprovante de Residência (&lt; 90 dias)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg bg-black/60 border border-zinc-800/80">
                      <input
                        type="checkbox"
                        checked={cnhEarAttached}
                        onChange={(e) => setCnhEarAttached(e.target.checked)}
                        className="rounded text-[#A8E63A] focus:ring-[#A8E63A] bg-zinc-900 border-zinc-700"
                        required
                      />
                      <span className="text-zinc-300">CNH com EAR (Exerce Atividade Remunerada)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg bg-black/60 border border-zinc-800/80">
                      <input
                        type="checkbox"
                        checked={crlvAttached}
                        onChange={(e) => setCrlvAttached(e.target.checked)}
                        className="rounded text-[#A8E63A] focus:ring-[#A8E63A] bg-zinc-900 border-zinc-700"
                        required
                      />
                      <span className="text-zinc-300">CRLV (Certificado do Veículo do ano)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg bg-black/60 border border-zinc-800/80">
                      <input
                        type="checkbox"
                        checked={criminalCertFederal}
                        onChange={(e) => setCriminalCertFederal(e.target.checked)}
                        className="rounded text-[#A8E63A] focus:ring-[#A8E63A] bg-zinc-900 border-zinc-700"
                        required
                      />
                      <span className="text-zinc-300">Certidão Federal Gov.br</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg bg-black/60 border border-zinc-800/80">
                      <input
                        type="checkbox"
                        checked={criminalCertResidenceState}
                        onChange={(e) => setCriminalCertResidenceState(e.target.checked)}
                        className="rounded text-[#A8E63A] focus:ring-[#A8E63A] bg-zinc-900 border-zinc-700"
                        required
                      />
                      <span className="text-zinc-300">Certidão Estadual de {residenceState} (Residência)</span>
                    </label>

                    {isOutOfState && (
                      <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg bg-amber-950/40 border border-amber-500/50 sm:col-span-2">
                        <input
                          type="checkbox"
                          checked={criminalCertOriginState}
                          onChange={(e) => setCriminalCertOriginState(e.target.checked)}
                          className="rounded text-amber-400 focus:ring-amber-400 bg-zinc-900 border-amber-600"
                          required
                        />
                        <span className="text-amber-200 font-bold">
                          Certidão Estadual de {birthState} (Estado onde nasceu - Obrigatória)
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                {/* 2ª ETAPA DE HOMOLOGAÇÃO: VISTORIA E COLETA PRESENCIAL NA RESIDÊNCIA */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0F1622] to-black border border-[#A8E63A]/50 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-[#A8E63A] text-black font-black text-[9px] uppercase tracking-wider">
                        2ª Etapa Obrigatória
                      </span>
                      <h4 className="text-xs font-black text-white uppercase tracking-wide">
                        Vistoria & Coleta Presencial na Residência
                      </h4>
                    </div>
                    <span className="text-[10px] text-[#A8E63A] font-bold">100% Presencial</span>
                  </div>

                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    Para elevar a segurança, conformidade e rigor da homologação, a 2ª etapa é realizada <strong>presencialmente na residência do motorista</strong>. A Central enviará um <strong>Representante Legal Oficial</strong> para realizar a vistoria do veículo e a coleta/conferência dos documentos. <strong className="text-[#A8E63A]">Havendo a confirmação, o cadastro é liberado imediatamente!</strong>
                  </p>

                  <div className="p-2.5 rounded-xl bg-black/60 border border-[#A8E63A]/30 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#A8E63A]">
                      <span>🏠 Procedimento Oficial: Visita Domiciliar & Vistoria</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#A8E63A] flex items-center justify-between">
                        <span>Endereço Residencial Completo (Onde o Representante fará a vistoria) *</span>
                        <span className="text-[9px] text-zinc-400 font-normal">Rua, Nº, Bairro, Complemento e Ponto de Ref.</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Rua das Acácias, 230 - Apt 102, Manaíra, João Pessoa - PB"
                        value={secondStageAddress}
                        onChange={(e) => setSecondStageAddress(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#A8E63A] outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-300">
                        Melhor Turno/Horário para Receber o Representante Legal da Central:
                      </label>
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-[#A8E63A] outline-none"
                      >
                        <option value="Manhã (08h às 12h)">Manhã (08h às 12h)</option>
                        <option value="Tarde (13h às 17h)">Tarde (13h às 17h)</option>
                        <option value="Noite (18h às 20h)">Noite (18h às 20h)</option>
                        <option value="Final de Semana (Sábado pela manhã)">Final de Semana (Sábado pela manhã)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Referral Code Field */}
            <div className="space-y-1 pt-1">
              <label className="text-[11px] font-bold text-[#A8E63A] flex items-center justify-between">
                <span>Código de Indicação (Opcional)</span>
                <span className="text-[10px] text-zinc-400 font-normal">Ganha bônus no W-BANK</span>
              </label>
              <input
                type="text"
                value={referralCodeInput}
                onChange={(e) => setReferralCodeInput(e.target.value)}
                placeholder="Ex: W0701"
                className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-[#A8E63A] font-mono font-bold placeholder-zinc-600 focus:border-[#A8E63A] outline-none uppercase"
              />
            </div>

            {/* Slogan & Submit Button */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#A8E63A] hover:bg-[#95d130] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>
                  {mainMode === 'passenger'
                    ? 'Enviar Cadastro de Passageiro para Aprovação'
                    : mainMode === 'work'
                    ? `Enviar Pré-Cadastro ${partnerCategory.toUpperCase()} ao CEO`
                    : 'Solicitar Contrato de Empresa / PJ'}
                </span>
              </button>

              {/* FOOTER STRIP OFICIAL DA IMAGEM: Telefone, Taxa R$ 3,00 e Pilares */}
              <div className="p-3 rounded-2xl bg-black border border-[#A8E63A]/40 text-center space-y-1.5 shadow-inner">
                <div className="text-xs sm:text-sm font-black text-[#A8E63A] flex items-center justify-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  <span>CADASTRE-SE COMO PARCEIRO - Tel. (83) 99683-0050</span>
                </div>
                <p className="text-[11px] font-bold text-white leading-tight">
                  VIAGENS PAGAS PELOS PASSAGEIROS DE R$ 10,00 A R$ 100,00, SÓ SERÃO DESCONTADOS PELA TAXA DE INDICAÇÃO DA CENTRAL W-DRIVER R$ 3,00. ✓
                </p>
                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pt-0.5">
                  TRANSPARÊNCIA • LEGALIDADE • RESPEITO • DESDE 2009
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
