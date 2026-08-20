import React, { useState, useEffect } from 'react';
import {
  isMasterAccountRegistered,
  getRegisteredMasterInfo,
  registerInitialMaster,
  authenticateMaster,
} from '../services/masterAuthService';
import { Logo } from './Logo';
import {
  ShieldAlert,
  Lock,
  UserCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  X,
  KeyRound,
  Fingerprint,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MasterAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

export const MasterAuthModal: React.FC<MasterAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
}) => {
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [registeredInfo, setRegisteredInfo] = useState<{
    name: string;
    cpfMasked: string;
    createdAt: string;
  } | null>(null);

  // Form states
  const [name, setName] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const reg = isMasterAccountRegistered();
      setIsRegistered(reg);
      if (reg) {
        setRegisteredInfo(getRegisteredMasterInfo());
      }
      setErrorMessage('');
      setPassword('');
      setConfirmPassword('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Format CPF automatically
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 9) {
      v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (v.length > 6) {
      v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (v.length > 3) {
      v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    setCpf(v);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Informe seu nome completo.');
      return;
    }
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) {
      setErrorMessage('Informe um CPF válido com 11 dígitos.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('A senha deve conter no mínimo 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('As senhas digitadas não coincidem.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await registerInitialMaster(name, cleanCpf, password);
      if (res.success) {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        onAuthenticated();
        onClose();
      } else {
        setErrorMessage(res.error || 'Erro ao registrar conta Master.');
      }
    } catch {
      setErrorMessage('Falha inesperada no processamento seguro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) {
      setErrorMessage('Informe seu CPF completo (11 dígitos).');
      return;
    }
    if (!password) {
      setErrorMessage('Informe sua senha Master.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authenticateMaster(cleanCpf, password);
      if (res.success) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        onAuthenticated();
        onClose();
      } else {
        setErrorMessage(res.error || 'Credenciais inválidas.');
      }
    } catch {
      setErrorMessage('Erro ao validar autenticação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className="bg-[#121212] border border-[#2a2a2a] rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Logo variant="W-DRIVER" size="md" className="mx-auto" />
          
          <div className="pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A8E63A]/10 border border-[#A8E63A]/30 text-[#A8E63A] text-xs font-black uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isRegistered ? 'Acesso Restrito Master CEO' : 'Primeiro Acesso - Master CEO'}</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1.5 max-w-xs mx-auto">
              {isRegistered
                ? 'Painel administrativo 100% exclusivo do proprietário. Autentique-se com sua senha criptografada.'
                : 'Defina seu perfil único de Administrador Geral. Novos cadastros serão travados após esta criação.'}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-red-950/60 border border-red-500/80 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-red-200">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* FORM: Registration (First Access) or Login */}
        {!isRegistered ? (
          /* Initial Master Onboarding Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div className="bg-[#181818] p-3 rounded-2xl border border-zinc-800 space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-[#A8E63A]" />
                <span>Cadastro Exclusivo do Administrador Geral</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-tight">
                Estes dados serão utilizados para bloquear qualquer acesso externo de motoristas ou passageiros.
              </p>
            </div>

            <div>
              <label className="text-xs text-zinc-300 font-semibold block mb-1">
                Nome Completo do Master CEO:
              </label>
              <input
                type="text"
                placeholder="Ex: João da Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#A8E63A]"
                required
              />
            </div>

            <div>
              <label className="text-xs text-zinc-300 font-semibold block mb-1">
                CPF do Titular (11 dígitos):
              </label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCpfChange}
                className="w-full bg-black border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#A8E63A] font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs text-zinc-300 font-semibold block mb-1">
                Criar Senha Master Segura:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 dígitos"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#A8E63A] pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-300 font-semibold block mb-1">
                Confirmar Senha Master:
              </label>
              <input
                type="password"
                placeholder="Repita a senha criada"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#A8E63A]"
                required
              />
            </div>

            <div className="p-2.5 bg-black/60 rounded-xl border border-zinc-800 text-[10px] text-zinc-400 space-y-1">
              <div className="text-[#A8E63A] font-bold flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Criptografia SHA-256 Ativa</span>
              </div>
              <p>
                Sua senha nunca será salva em texto puro nem enviada em links públicos ou compartilhamentos de WhatsApp.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#A8E63A] hover:bg-[#95d130] text-black font-black text-xs uppercase tracking-wider transition shadow-xl active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Criptografando & Registrando...' : 'Criar Perfil Master & Acessar'}
            </button>
          </form>
        ) : (
          /* Master Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            {registeredInfo && (
              <div className="bg-[#181818] p-3 rounded-2xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">Administrador Registrado:</span>
                  <span className="text-xs font-bold text-white">{registeredInfo.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold block">CPF:</span>
                  <span className="text-xs font-mono text-[#A8E63A]">{registeredInfo.cpfMasked}</span>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-zinc-300 font-semibold block mb-1">
                Confirmar seu CPF:
              </label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCpfChange}
                className="w-full bg-black border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#A8E63A] font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs text-zinc-300 font-semibold block mb-1">
                Senha Pessoal Master:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha cadastrada"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#A8E63A] pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-2.5 bg-black/60 rounded-xl border border-zinc-800 text-[10px] text-zinc-400 flex items-center justify-between">
              <span className="text-zinc-400">Status da Sessão:</span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Lock className="w-3 h-3" /> Bloqueado até validação
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#A8E63A] hover:bg-[#95d130] text-black font-black text-xs uppercase tracking-wider transition shadow-xl active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Validando Criptografia...' : 'Desbloquear Painel Master CEO'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 rounded-xl text-zinc-400 hover:text-white text-xs font-semibold transition text-center block"
            >
              Voltar ao Modo Normal
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
