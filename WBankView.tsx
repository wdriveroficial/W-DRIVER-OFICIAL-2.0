import React, { useState } from 'react';
import { BankTransaction } from '../types';
import { Logo } from './Logo';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  Copy,
  Check,
  AlertTriangle,
  PlusCircle,
  CreditCard,
  Sparkles,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WBankViewProps {
  balance: number;
  transactions: BankTransaction[];
  onAddFunds: (amount: number) => void;
  onTransfer: (amount: number, recipient: string) => boolean;
}

export const WBankView: React.FC<WBankViewProps> = ({
  balance,
  transactions,
  onAddFunds,
  onTransfer,
}) => {
  const [copiedPix, setCopiedPix] = useState<boolean>(false);
  const [transferModalOpen, setTransferModalOpen] = useState<boolean>(false);
  const [transferAmount, setTransferAmount] = useState<string>('20.00');
  const [recipient, setRecipient] = useState<string>('wdriveroficial@gmail.com');

  const pixKey = 'pix-wdriver-teste-0701-brasil@wbank.com.br';

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleAddDemoFunds = () => {
    onAddFunds(50.0);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(transferAmount);
    if (isNaN(val) || val <= 0) return;
    const ok = onTransfer(val, recipient);
    if (ok) {
      setTransferModalOpen(false);
      confetti({ particleCount: 40, spread: 50 });
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 md:pb-6 px-3 sm:px-4 pt-3 max-w-xl mx-auto w-full space-y-4">
      {/* Test Notice Banner */}
      <div className="bg-[#1a1405] border border-amber-500/40 rounded-2xl p-3.5 flex items-start gap-3 shadow-lg">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider">
            SALDO APENAS PARA TESTES
          </h4>
          <p className="text-[11px] text-amber-200/80 leading-relaxed mt-0.5">
            Este valor de demonstração serve exclusivamente para validação das funções de pagamento de corridas, bônus e transferências no aplicativo W-DRIVER. Não possui valor financeiro real.
          </p>
        </div>
      </div>

      {/* Official W-BANK Digital Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#181818] via-[#111111] to-[#050505] p-6 border border-[#2a2a2a] shadow-2xl space-y-6">
        {/* Decorative subtle pear glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#A8E63A]/10 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <Logo variant="W-BANK" size="md" />
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-[#A8E63A]/30 text-[10px] font-bold text-[#A8E63A]">
            <ShieldCheck className="w-3 h-3" />
            <span>MODO TESTE OFICIAL</span>
          </div>
        </div>

        {/* Chip & Contactless */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-8 rounded-md bg-gradient-to-r from-amber-200 to-yellow-500 border border-amber-600/40 shadow-inner flex items-center justify-center">
            <div className="w-8 h-5 border border-amber-800/40 rounded-sm grid grid-cols-2 gap-0.5 p-0.5">
              <div className="bg-amber-400/50"></div>
              <div className="bg-amber-400/50"></div>
            </div>
          </div>
          <span className="text-xs text-zinc-500 font-mono tracking-widest">W-PAY NFC</span>
        </div>

        {/* Balance Display */}
        <div className="relative z-10">
          <span className="text-xs text-zinc-400 font-medium">Saldo Disponível em Conta</span>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl text-[#A8E63A] font-bold">R$</span>
            <span>{balance.toFixed(2)}</span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs text-zinc-400 font-mono relative z-10">
          <span>W-DRIVER PARCEIRO TESTE</span>
          <span>VAL: 12/2030</span>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          onClick={handleAddDemoFunds}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#121212] hover:bg-[#181818] border border-zinc-800 hover:border-[#A8E63A]/40 transition text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-[#A8E63A] mb-1.5 group-hover:scale-110 transition">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-white leading-tight">+ R$ 50,00</span>
          <span className="text-[10px] text-zinc-500">Recarga Teste</span>
        </button>

        <button
          onClick={() => setTransferModalOpen(true)}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#121212] hover:bg-[#181818] border border-zinc-800 hover:border-[#A8E63A]/40 transition text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-[#A8E63A] mb-1.5 group-hover:scale-110 transition">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-white leading-tight">Transferir</span>
          <span className="text-[10px] text-zinc-500">Pix ou Conta</span>
        </button>

        <button
          onClick={handleCopyPix}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#121212] hover:bg-[#181818] border border-zinc-800 hover:border-[#A8E63A]/40 transition text-center group"
        >
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-[#A8E63A] mb-1.5 group-hover:scale-110 transition">
            {copiedPix ? <Check className="w-5 h-5 text-[#A8E63A]" /> : <QrCode className="w-5 h-5" />}
          </div>
          <span className="text-xs font-bold text-white leading-tight">
            {copiedPix ? 'Copiado!' : 'Chave Pix'}
          </span>
          <span className="text-[10px] text-zinc-500">Receber</span>
        </button>
      </div>

      {/* Pix Key Card */}
      <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-300">Chave PIX W-BANK (Modo Teste)</span>
          <button
            onClick={handleCopyPix}
            className="flex items-center gap-1 text-xs font-bold text-[#A8E63A] hover:underline"
          >
            {copiedPix ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Chave</span>
              </>
            )}
          </button>
        </div>
        <div className="p-2.5 rounded-xl bg-black font-mono text-xs text-zinc-300 border border-zinc-850 break-all select-all">
          {pixKey}
        </div>
      </div>

      {/* Transaction History Feed */}
      <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Extrato de Movimentações
          </span>
          <span className="text-[11px] text-zinc-400">Tempo Real</span>
        </div>

        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#161616] hover:bg-[#1a1a1a] transition"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    tx.type === 'credit'
                      ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60'
                      : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  {tx.type === 'credit' ? (
                    <ArrowDownLeft className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-white text-xs leading-tight">{tx.title}</div>
                  <div className="text-[10px] text-zinc-400">{tx.description} • {tx.date}</div>
                </div>
              </div>

              <div
                className={`text-xs font-extrabold font-mono ${
                  tx.type === 'credit' ? 'text-[#A8E63A]' : 'text-white'
                }`}
              >
                {tx.type === 'credit' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transfer Modal */}
      {transferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#A8E63A]/40 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Transferir Saldo W-BANK (Teste)</h3>
            <form onSubmit={handleConfirmTransfer} className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Destinatário (Email ou Chave PIX):</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#A8E63A]"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Valor (R$):</label>
                <input
                  type="number"
                  step="0.01"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-sm font-bold text-[#A8E63A] focus:outline-none focus:border-[#A8E63A]"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTransferModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#A8E63A] hover:bg-[#95d130] text-black text-xs font-black uppercase"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
