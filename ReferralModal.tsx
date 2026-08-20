import React, { useState } from 'react';
import { ReferralRecord } from '../types';
import { Logo } from './Logo';
import {
  Gift,
  Share2,
  Copy,
  Check,
  X,
  Users,
  Award,
  Sparkles,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  referrals: ReferralRecord[];
  referralCode?: string;
  userRoleLabel?: string;
  onClaimBonus?: (amount: number) => void;
  onShareTracked?: (platform: 'whatsapp' | 'facebook' | 'instagram' | 'youtube' | 'email' | 'copy_link', code: string) => void;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({
  isOpen,
  onClose,
  referrals,
  referralCode = 'W0701',
  userRoleLabel = 'Passageiro & Parceiro',
  onClaimBonus,
  onShareTracked,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'share' | 'stats' | 'rules'>('share');

  if (!isOpen) return null;

  // Complete, fully-qualified HTTPS link guaranteed to be clickable on WhatsApp and social networks
  const getFullShareUrl = (actionType: 'cadastro' | 'motorista' | 'passageiro' = 'cadastro') => {
    if (typeof window !== 'undefined' && window.location.origin && window.location.origin.startsWith('http')) {
      return `${window.location.origin}/?ref=${referralCode}&action=${actionType}`;
    }
    return `https://wdriver.app/ref/${referralCode}`;
  };

  const shareUrl = getFullShareUrl('cadastro');
  const driverShareUrl = getFullShareUrl('motorista');
  const passengerShareUrl = getFullShareUrl('passageiro');

  const totalEarned = referrals.reduce((acc, r) => acc + (r.isPaid ? r.bonusEarned : 0), 0);
  const totalRidesAccumulated = referrals.reduce((acc, r) => acc + r.completedRides, 0);

  // Exact Official Referral Message Required with clean URL line for WhatsApp link auto-recognition
  const officialShareMessage = `Conheça a W-DRIVER.

Transporte legal de passageiros e entregas.

Quem escolhe preço corre riscos. Quem escolhe a W-DRIVER escolhe chegar bem.

Cadastre-se utilizando meu código de indicação:
${referralCode}

Após suas viagens você poderá receber benefícios e descontos.

${shareUrl}`;

  const handleCopyLink = (customUrl?: string) => {
    const textToCopy = customUrl ? customUrl : officialShareMessage;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    if (onShareTracked) onShareTracked('copy_link', referralCode);
    setTimeout(() => setCopied(false), 2500);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
  };

  const handleShareWhatsApp = (customText?: string) => {
    if (onShareTracked) onShareTracked('whatsapp', referralCode);
    const message = customText || officialShareMessage;
    const text = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareFacebook = () => {
    if (onShareTracked) onShareTracked('facebook', referralCode);
    const url = encodeURIComponent(shareUrl);
    const quote = encodeURIComponent(officialShareMessage);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`, '_blank');
  };

  const handleShareInstagram = () => {
    if (onShareTracked) onShareTracked('instagram', referralCode);
    navigator.clipboard.writeText(officialShareMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.open('https://instagram.com/wdriveroficial', '_blank');
  };

  const handleOpenYouTube = () => {
    if (onShareTracked) onShareTracked('youtube', referralCode);
    window.open('https://youtube.com/@wdriveroficial', '_blank');
  };

  const handleShareEmail = () => {
    if (onShareTracked) onShareTracked('email', referralCode);
    const subject = encodeURIComponent(`Convite Especial W-DRIVER (Código de Indicação: ${referralCode})`);
    const body = encodeURIComponent(officialShareMessage);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#121212] border border-[#282828] rounded-3xl p-5 sm:p-6 max-w-lg w-full space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="text-center space-y-2 pt-1">
          <Logo variant="W-DRIVER" size="md" className="justify-center" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A8E63A]/15 border border-[#A8E63A]/40 text-[#A8E63A] text-xs font-black">
            <Gift className="w-3.5 h-3.5" />
            <span>CENTRAL DE COMPARTILHAMENTO OFICIAL</span>
          </div>
          <h3 className="text-lg font-black text-white">Indique & Ganhe Bônus no W-BANK</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Disponível para <b>Passageiros</b>, <b>Motoristas</b>, <b>Entregadores (W-MOTO / W-BIKE)</b>, <b>Taxistas</b> e <b>Master CEO</b>.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-black p-1 rounded-2xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('share')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'share' ? 'bg-[#A8E63A] text-black shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            📢 Compartilhar
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'stats' ? 'bg-[#A8E63A] text-black shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            📊 Meus Indicados ({referrals.length})
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'rules' ? 'bg-[#A8E63A] text-black shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            📋 Regras de Bônus
          </button>
        </div>

        {activeTab === 'share' && (
          <div className="space-y-4">
            {/* User Code Highlight Banner */}
            <div className="bg-black/90 p-4 rounded-2xl border border-zinc-800 text-center space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-[#A8E63A] to-transparent opacity-75" />
              <div className="flex items-center justify-between text-[11px] text-zinc-400 font-semibold px-2">
                <span>Perfil: <strong className="text-white">{userRoleLabel}</strong></span>
                <span className="text-[#A8E63A]">Código Individual Ativo</span>
              </div>

              <div className="py-2">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                  Seu Código de Indicação
                </span>
                <div className="text-3xl font-black text-[#A8E63A] tracking-widest font-mono select-all mt-0.5">
                  {referralCode}
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 font-mono bg-[#141414] py-1.5 px-3 rounded-xl border border-zinc-800 truncate">
                {shareUrl}
              </div>
            </div>

            {/* Quick Action Category Share Links */}
            <div className="bg-[#181818] p-3 rounded-2xl border border-zinc-800 space-y-2">
              <div className="text-[11px] font-extrabold text-white flex items-center justify-between">
                <span>Links Diretos por Objetivo</span>
                <span className="text-[#A8E63A] text-[10px]">100% Clicáveis</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    const msg = `🚗 Seja um Motorista / Parceiro W-DRIVER! Cadastre-se com meu código ${referralCode} e ganhe bônus:\n\n${driverShareUrl}`;
                    handleShareWhatsApp(msg);
                  }}
                  className="p-2.5 rounded-xl bg-black/60 hover:bg-black border border-zinc-700 hover:border-[#A8E63A] text-left text-xs transition active:scale-95 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white text-[11px]">🚗 Indicar Motorista</div>
                    <div className="text-[10px] text-zinc-400">Trabalhe Conosco</div>
                  </div>
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                </button>

                <button
                  onClick={() => {
                    const msg = `👤 Conheça a W-DRIVER! Transporte seguro e entregas rápidas. Cadastre-se com meu código ${referralCode}:\n\n${passengerShareUrl}`;
                    handleShareWhatsApp(msg);
                  }}
                  className="p-2.5 rounded-xl bg-black/60 hover:bg-black border border-zinc-700 hover:border-[#A8E63A] text-left text-xs transition active:scale-95 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white text-[11px]">👤 Indicar Passageiro</div>
                    <div className="text-[10px] text-zinc-400">Quero Viajar</div>
                  </div>
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                </button>
              </div>
            </div>

            {/* Multiplatform Share Action Grid */}
            <div className="space-y-2">
              <div className="text-xs font-black text-white uppercase tracking-wider flex items-center justify-between">
                <span>Compartilhamento Multiplataforma</span>
                <span className="text-[10px] text-zinc-400 font-normal">Clique para enviar direto</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {/* WhatsApp */}
                <button
                  onClick={handleShareWhatsApp}
                  className="p-3 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-white flex flex-col items-center gap-1.5 transition active:scale-95 text-center group"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold text-emerald-400">📱 WhatsApp</span>
                  <span className="text-[10px] text-zinc-400">Enviar para amigos</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={handleShareFacebook}
                  className="p-3 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-white flex flex-col items-center gap-1.5 transition active:scale-95 text-center group"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition">
                    <Facebook className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold text-blue-400">📘 Facebook</span>
                  <span className="text-[10px] text-zinc-400">Publicar no feed</span>
                </button>

                {/* Instagram */}
                <button
                  onClick={handleShareInstagram}
                  className="p-3 rounded-2xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-white flex flex-col items-center gap-1.5 transition active:scale-95 text-center group"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold text-pink-400">📸 Instagram</span>
                  <span className="text-[10px] text-zinc-400">Copiar & Abrir</span>
                </button>

                {/* YouTube */}
                <button
                  onClick={handleOpenYouTube}
                  className="p-3 rounded-2xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-white flex flex-col items-center gap-1.5 transition active:scale-95 text-center group"
                >
                  <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition">
                    <Youtube className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold text-red-400">▶️ YouTube</span>
                  <span className="text-[10px] text-zinc-400">Canal Oficial</span>
                </button>

                {/* E-mail */}
                <button
                  onClick={handleShareEmail}
                  className="p-3 rounded-2xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-white flex flex-col items-center gap-1.5 transition active:scale-95 text-center group"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold text-amber-400">📧 E-mail</span>
                  <span className="text-[10px] text-zinc-400">Enviar convite</span>
                </button>

                {/* Copiar Link / Mensagem */}
                <button
                  onClick={handleCopyLink}
                  className="p-3 rounded-2xl bg-[#A8E63A]/20 hover:bg-[#A8E63A]/30 border border-[#A8E63A]/40 text-white flex flex-col items-center gap-1.5 transition active:scale-95 text-center group"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#A8E63A] flex items-center justify-center text-black shadow-md group-hover:scale-110 transition">
                    {copied ? <Check className="w-5 h-5 text-black" /> : <Copy className="w-5 h-5" />}
                  </div>
                  <span className="text-xs font-extrabold text-[#A8E63A]">
                    {copied ? '✓ Copiado!' : '🔗 Copiar Link'}
                  </span>
                  <span className="text-[10px] text-zinc-400">Mensagem completa</span>
                </button>
              </div>
            </div>

            {/* Official Message Preview Box */}
            <div className="bg-[#181818] border border-zinc-800 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-300">
                <span>Mensagem Automática de Indicação:</span>
                <span className="text-[#A8E63A] text-[10px]">Texto Oficial W-DRIVER</span>
              </div>
              <div className="bg-black/80 p-3 rounded-xl border border-zinc-800/80 text-[11px] text-zinc-300 leading-relaxed font-sans whitespace-pre-line border-l-2 border-l-[#A8E63A]">
                {officialShareMessage}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-3.5">
            {/* 4 Summary Stats Blocks */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-3 bg-[#181818] rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-semibold uppercase block">Meu Código</span>
                <div className="text-sm font-black text-[#A8E63A] font-mono">{referralCode}</div>
              </div>
              <div className="p-3 bg-[#181818] rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-semibold uppercase block">Indicados</span>
                <div className="text-sm font-black text-white">{referrals.length}</div>
              </div>
              <div className="p-3 bg-[#181818] rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-semibold uppercase block">Viagens Feitas</span>
                <div className="text-sm font-black text-white">{totalRidesAccumulated}</div>
              </div>
              <div className="p-3 bg-[#181818] rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-semibold uppercase block">Bônus Ganho</span>
                <div className="text-sm font-black text-[#A8E63A]">R$ {totalEarned.toFixed(2)}</div>
              </div>
            </div>

            {/* Referrals Progress List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Progresso dos Seus Indicados
                </span>
                <span className="text-[11px] text-[#A8E63A]">Meta: 5 viagens</span>
              </div>

              <div className="space-y-2">
                {referrals.map((item) => {
                  const remaining = Math.max(0, item.targetRides - item.completedRides);
                  return (
                    <div
                      key={item.id}
                      className="bg-[#181818] border border-zinc-800 p-3 rounded-2xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">
                            {item.referredType === 'passenger' && '👤'}
                            {item.referredType === 'driver' && '🚗'}
                            {item.referredType === 'biker' && '🚲'}
                            {item.referredType === 'motoboy' && '🏍️'}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-white">{item.referredName}</div>
                            <div className="text-[10px] text-zinc-400">
                              Cadastrado em {item.date} • {item.referredType.toUpperCase()}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                              item.isPaid
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-[#A8E63A]/15 text-[#A8E63A] border border-[#A8E63A]/30'
                            }`}
                          >
                            {item.isPaid ? 'Bônus Pago: R$ 5,00' : `${item.completedRides} de 5 viagens`}
                          </span>
                          {!item.isPaid && (
                            <div className="text-[10px] text-zinc-400 mt-0.5">
                              Faltam <strong>{remaining}</strong> {remaining === 1 ? 'viagem' : 'viagens'}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-black h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            item.isPaid ? 'bg-emerald-400' : 'bg-[#A8E63A]'
                          }`}
                          style={{ width: `${Math.min(100, (item.completedRides / item.targetRides) * 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="bg-[#181818] border border-zinc-800 rounded-2xl p-4 space-y-3 text-xs text-zinc-300">
            <div className="flex items-center gap-2 text-[#A8E63A] font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Como Funciona o Bônus de Indicação W-DRIVER</span>
            </div>

            <div className="space-y-2 text-[11px] text-zinc-400 leading-relaxed">
              <p>
                1. <strong>Compartilhe seu Código:</strong> Envie seu código único ({referralCode}) para amigos, clientes e motoristas por WhatsApp, Facebook, Instagram ou E-mail.
              </p>
              <p>
                2. <strong>Cadastro Automático:</strong> A pessoa se cadastra como passageiro ou motorista utilizando seu link/código de indicação.
              </p>
              <p>
                3. <strong>Critério de 5 Viagens:</strong> Quando o seu indicado completar <strong>5 viagens válidas</strong> no aplicativo, o sistema libera automaticamente <strong>R$ 5,00</strong> em sua conta digital <strong>W-BANK</strong>.
              </p>
              <p>
                4. <strong>Sem Limite de Ganhos:</strong> Você pode indicar quantos amigos desejar. Os bônus são creditados instantaneamente no saldo da sua carteira W-BANK para você viajar ou transferir via PIX.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
