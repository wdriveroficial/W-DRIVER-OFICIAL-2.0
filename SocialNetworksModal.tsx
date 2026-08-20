import React from 'react';
import { Logo } from './Logo';
import {
  X,
  Globe,
  MessageCircle,
  Instagram,
  Facebook,
  Youtube,
  Mail,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface SocialNetworksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackAction?: (network: string) => void;
}

export const SocialNetworksModal: React.FC<SocialNetworksModalProps> = ({
  isOpen,
  onClose,
  onTrackAction,
}) => {
  if (!isOpen) return null;

  const handleOpenLink = (url: string, networkName: string) => {
    if (onTrackAction) onTrackAction(networkName);
    window.open(url, '_blank');
  };

  const socialLinks = [
    {
      id: 'whatsapp_passengers',
      name: 'Atendimento Passageiros (WhatsApp)',
      handle: '(83) 98838-1869 • Suporte Direto',
      description: 'Atendimento exclusivo para passageiros, dúvidas sobre viagens e agendamentos.',
      icon: MessageCircle,
      iconColor: 'text-[#A8E63A]',
      bgColor: 'bg-[#A8E63A]/10 border-[#A8E63A]/30 hover:border-[#A8E63A]',
      btnText: 'WhatsApp Passageiros',
      url: 'https://api.whatsapp.com/send?phone=5583988381869&text=Ol%C3%A1%20W-DRIVER%20Oficial%2C%20sou%20passageiro%20e%20gostaria%20de%20atendimento.',
    },
    {
      id: 'whatsapp_drivers',
      name: 'Cadastro Motorista / Parceiro (WhatsApp)',
      handle: '(83) 99683-0050 • Central de Credenciamento',
      description: 'Envio de documentos, CNH com EAR, agendamento de vistoria presencial e suporte a parceiros.',
      icon: MessageCircle,
      iconColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-400',
      btnText: 'WhatsApp Motoristas',
      url: 'https://api.whatsapp.com/send?phone=5583996830050&text=Ol%C3%A1%20W-DRIVER%20Oficial%2C%20gostaria%20de%20me%20cadastrar%20como%20motorista%2Fparceiro.',
    },
    {
      id: 'whatsapp_contracts',
      name: 'Contratos Empresas / Funcionários / CNPJ',
      handle: '(83) 98117-9524 • Setor Corporativo',
      description: 'Contratos corporativos, faturamento quinzenal/mensal e transporte para funcionários com crachá ou farda.',
      icon: MessageCircle,
      iconColor: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/30 hover:border-cyan-400',
      btnText: 'WhatsApp Contratos PJ',
      url: 'https://api.whatsapp.com/send?phone=5583981179524&text=Ol%C3%A1%20W-DRIVER%20Oficial%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20contratos%20corporativos%20e%20transporte%20de%20funcion%C3%A1rios.',
    },
    {
      id: 'instagram',
      name: 'Instagram Oficial',
      handle: '@wdriveroficial',
      description: 'Novidades, promoções, avisos de segurança e bastidores da operação.',
      icon: Instagram,
      iconColor: 'text-pink-400',
      bgColor: 'bg-pink-500/10 border-pink-500/30 hover:border-pink-400',
      btnText: 'Abrir Instagram',
      url: 'https://instagram.com/wdriveroficial',
    },
    {
      id: 'youtube',
      name: 'Canal Oficial W-DRIVER',
      handle: 'YouTube wdriveroficial',
      description: 'Vídeos institucionais, tutoriais do app e comunicados da diretoria.',
      icon: Youtube,
      iconColor: 'text-red-400',
      bgColor: 'bg-red-500/10 border-red-500/30 hover:border-red-400',
      btnText: 'Acessar YouTube',
      url: 'https://youtube.com/@wdriveroficial',
    },
    {
      id: 'email',
      name: 'E-mail Oficial W-DRIVER',
      handle: 'wdriveroficial@gmail.com',
      description: 'Ouvidoria, documentação e assuntos jurídicos/institucionais.',
      icon: Mail,
      iconColor: 'text-zinc-300',
      bgColor: 'bg-zinc-900 border-zinc-800 hover:border-zinc-700',
      btnText: 'Enviar E-mail',
      url: 'mailto:wdriveroficial@gmail.com?subject=Contato%20Oficial%20W-DRIVER&body=Ol%C3%A1%20equipe%20W-DRIVER%2C',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#121212] border border-zinc-800 rounded-3xl p-5 sm:p-6 max-w-lg w-full space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 pt-1">
          <Logo variant="W-DRIVER" size="md" className="justify-center" />
          <div className="flex items-center justify-center gap-1.5 pt-1 text-[#A8E63A] font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span className="uppercase tracking-wider">Canais e Redes Oficiais Verificados</span>
          </div>
          <h3 className="text-lg font-black text-white">REDES OFICIAIS W-DRIVER</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Acompanhe nossas comunicações oficiais, atendimento humanizado e comunidades exclusivas.
          </p>
        </div>

        {/* List of Official Channels */}
        <div className="space-y-2.5 pt-2">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <div
                key={link.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${link.bgColor}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl bg-black/60 border border-zinc-800 shrink-0 ${link.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-white">{link.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#A8E63A]" />
                    </div>
                    <div className="text-[11px] font-mono text-zinc-300 font-semibold">{link.handle}</div>
                    <p className="text-[10px] text-zinc-400 leading-snug">{link.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenLink(link.url, link.id)}
                  className="sm:self-center w-full sm:w-auto px-3.5 py-2 rounded-xl bg-black/80 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-zinc-700 hover:border-[#A8E63A] transition shadow-md shrink-0 active:scale-95"
                >
                  <span>{link.btnText}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#A8E63A]" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Security Notice */}
        <div className="bg-black/60 border border-zinc-800 p-3 rounded-2xl text-center space-y-1">
          <p className="text-[10px] text-zinc-400">
            A W-DRIVER não solicita senhas ou códigos bancários por mensagens. Verifique sempre o selo oficial.
          </p>
        </div>
      </div>
    </div>
  );
};
