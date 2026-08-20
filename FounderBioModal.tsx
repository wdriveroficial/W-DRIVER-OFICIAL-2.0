import React from 'react';
import { Logo } from './Logo';
import { AppLauncherIcon } from './AppLauncherIcon';
import {
  ShieldCheck,
  Award,
  Heart,
  Car,
  Clock,
  Sparkles,
  CheckCircle2,
  X,
  MapPin,
  Users,
} from 'lucide-react';

interface FounderBioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FounderBioModal: React.FC<FounderBioModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9500] flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in text-white select-none overflow-y-auto">
      <div className="bg-[#0e1116] border border-zinc-800 rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800/80 bg-gradient-to-r from-[#161a22] to-[#0e1116] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo variant="W-DRIVER" size="sm" />
            <span className="px-2 py-0.5 rounded-full bg-[#A8E63A]/10 border border-[#A8E63A]/30 text-[#A8E63A] text-[9px] font-black uppercase">
              História Oficial
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-zinc-300 text-xs leading-relaxed">
          {/* Hero Profile */}
          <div className="flex flex-col items-center text-center pb-2">
            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#A8E63A] via-[#76BC21] to-[#121519] p-1 shadow-[0_0_24px_rgba(168,230,58,0.3)]">
                <div className="w-full h-full rounded-[22px] bg-[#12161c] flex items-center justify-center overflow-hidden border border-zinc-800">
                  <AppLauncherIcon size={84} showSubtitle={false} withShadow={false} />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#A8E63A] text-black shadow-lg">
                <Award className="w-3.5 h-3.5" />
              </div>
            </div>

            <h2 className="text-xl font-black text-white">Wallace Motorista</h2>
            <p className="text-xs text-[#A8E63A] font-bold mt-0.5">
              Fundador e Idealizador da W-DRIVER
            </p>
            <p className="text-[11px] text-zinc-400 font-medium">
              Transporte legal de passageiros e encomendas desde 2009
            </p>
          </div>

          {/* Pillars Badges */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center">
              <Clock className="w-4 h-4 text-[#A8E63A] mx-auto mb-1" />
              <div className="text-[11px] font-black text-white">+17 Anos</div>
              <div className="text-[9px] text-zinc-400">Na Estrada</div>
            </div>

            <div className="p-2.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center">
              <ShieldCheck className="w-4 h-4 text-[#A8E63A] mx-auto mb-1" />
              <div className="text-[11px] font-black text-white">100% Legal</div>
              <div className="text-[9px] text-zinc-400">Homologado</div>
            </div>

            <div className="p-2.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center">
              <Users className="w-4 h-4 text-[#A8E63A] mx-auto mb-1" />
              <div className="text-[11px] font-black text-white">Humano</div>
              <div className="text-[9px] text-zinc-400">Apoio Direto</div>
            </div>
          </div>

          {/* Biography Text */}
          <div className="space-y-3 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/80">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A8E63A]" />
              <span>A Trajetória de Wallace Motorista</span>
            </h3>

            <p>
              A história da <strong className="text-white">W-DRIVER</strong> nasceu nas ruas em{' '}
              <strong className="text-[#A8E63A]">2009</strong>, idealizada por Wallace Motorista.
              Vivenciando dia e noite os desafios do transporte urbano, o trânsito, a falta de segurança
              e as altas taxas cobradas por plataformas multinacionais que desvalorizavam o trabalhador,
              Wallace decidiu construir um modelo humanizado, justo e 100% legal.
            </p>

            <p>
              A premissa da W-DRIVER sempre foi clara:{' '}
              <em className="text-white font-medium">
                &ldquo;Quem escolhe preço corre riscos. Quem escolhe a W-DRIVER escolhe chegar bem!&rdquo;
              </em>
            </p>

            <p>
              Com respeito à legislação, apoio aos motoristas parceiros e proteção integral às
              famílias transportadas, o projeto expandiu-se com base na confiança mútua, vistoria presencial
              obrigatória de todos os condutores e no compromisso de manter o maior repasse líquido do mercado.
            </p>
          </div>

          {/* Core Values */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">
              Pilares Fundamentais W-DRIVER 3.0:
            </h4>

            <div className="space-y-2">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-[#A8E63A] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Vistoria e Validação Presencial</div>
                  <div className="text-[11px] text-zinc-400">
                    Nenhum motorista opera sem passar por checagem documental rigorosa e vistoria física.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-[#A8E63A] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Teto Fixo de Comissão e Taxas Justas</div>
                  <div className="text-[11px] text-zinc-400">
                    Comissão central fixa a partir de R$ 3,00 com teto inviolável de R$ 70,00 para proteger o ganho do motorista.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-[#A8E63A] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Segurança Integral e Audioproteção</div>
                  <div className="text-[11px] text-zinc-400">
                    GPS 24/7 com audioproteção em tempo real e botão SOS direto com a Central de Operações.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0a0d12] border-t border-zinc-800 flex items-center justify-between">
          <div className="text-[10px] text-zinc-400">
            W-DRIVER OFICIAL 3.0 • CNPJ Homologado
          </div>

          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-[#A8E63A] hover:bg-[#95d130] text-black font-black text-xs uppercase transition shadow-md"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
