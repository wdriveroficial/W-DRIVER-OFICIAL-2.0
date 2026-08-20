import React, { useState } from 'react';
import { Logo } from './Logo';
import {
  ShieldCheck,
  User,
  FileText,
  UploadCloud,
  CheckCircle2,
  Camera,
  Lock,
  Phone,
  Mail,
  X,
  CreditCard,
  Car,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SafetyAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'passenger' | 'driver';
  onCompleted: (role: 'passenger' | 'driver', profileData: any) => void;
}

export const SafetyAuthModal: React.FC<SafetyAuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'passenger',
  onCompleted,
}) => {
  const [role, setRole] = useState<'passenger' | 'driver'>(initialMode);
  const [step, setStep] = useState<number>(1);

  // Passenger form states
  const [pName, setPName] = useState('Passageiro Oficial W-DRIVER');
  const [pCpf, setPCpf] = useState('123.456.789-00');
  const [pPhone, setPPhone] = useState('(83) 99888-7700');
  const [pEmail, setPEmail] = useState('passageiro@wdriver.com.br');
  const [pPassword, setPPassword] = useState('********');
  const [pPhoto, setPPhoto] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );

  // Driver form states
  const [dDocPhoto, setDDocPhoto] = useState(true);
  const [dCnh, setDCnh] = useState(true);
  const [dResidenceProof, setDResidenceProof] = useState(true);
  const [dVehicleDoc, setDVehicleDoc] = useState(true);
  const [dVehicleInsurance, setDVehicleInsurance] = useState(true);
  const [dVehiclePhoto, setDVehiclePhoto] = useState(true);
  const [dSelfieFacial, setDSelfieFacial] = useState(true);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    onCompleted(role, {
      name: pName,
      cpf: pCpf,
      phone: pPhone,
      email: pEmail,
      photo: pPhoto,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-3xl p-5 sm:p-6 max-w-lg w-full space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-[#A8E63A]/15 border border-[#A8E63A] flex items-center justify-center mx-auto text-[#A8E63A]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-white">Central de Cadastro & Segurança</h3>
          <p className="text-xs text-zinc-400">
            Validação oficial de credenciais, biometria e conformidade técnica W-DRIVER.
          </p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-black rounded-2xl border border-zinc-800">
          <button
            onClick={() => setRole('passenger')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              role === 'passenger'
                ? 'bg-[#A8E63A] text-black shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Conta Passageiro</span>
          </button>
          <button
            onClick={() => setRole('driver')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              role === 'driver'
                ? 'bg-[#A8E63A] text-black shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Conta Motorista / Parceiro</span>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSave} className="space-y-3.5">
          {role === 'passenger' ? (
            <>
              {/* Passenger fields: Nome, CPF, Telefone, Email, Senha, Foto */}
              <div className="flex items-center gap-3 bg-black p-3 rounded-2xl border border-zinc-800">
                <img
                  src={pPhoto}
                  alt="Perfil"
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#A8E63A]"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Foto de Perfil Oficial</span>
                  <span className="text-[10px] text-[#A8E63A]">✓ Validação Biométrica Ativa</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Nome Completo:</label>
                <input
                  type="text"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#A8E63A]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">CPF:</label>
                  <input
                    type="text"
                    value={pCpf}
                    onChange={(e) => setPCpf(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#A8E63A]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Telefone / WhatsApp:</label>
                  <input
                    type="text"
                    value={pPhone}
                    onChange={(e) => setPPhone(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#A8E63A]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">E-mail Oficial:</label>
                <input
                  type="email"
                  value={pEmail}
                  onChange={(e) => setPEmail(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#A8E63A]"
                  required
                />
              </div>
            </>
          ) : (
            <>
              {/* Driver Document Verification Checklist */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Checklist de Documentos do Parceiro:
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between p-3 bg-black rounded-xl border border-zinc-800 text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#A8E63A]" />
                      <span className="text-zinc-300">Documento Oficial com Foto (RG / CNH)</span>
                    </div>
                    <span className="text-[#A8E63A] font-bold text-[11px]">✓ Homologado</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-black rounded-xl border border-zinc-800 text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#A8E63A]" />
                      <span className="text-zinc-300">CNH com Observação EAR</span>
                    </div>
                    <span className="text-[#A8E63A] font-bold text-[11px]">✓ Homologado</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-black rounded-xl border border-zinc-800 text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#A8E63A]" />
                      <span className="text-zinc-300">Comprovante de Residência Atualizado</span>
                    </div>
                    <span className="text-[#A8E63A] font-bold text-[11px]">✓ Homologado</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-black rounded-xl border border-zinc-800 text-xs">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-[#A8E63A]" />
                      <span className="text-zinc-300">Documento do Veículo (CRLV)</span>
                    </div>
                    <span className="text-[#A8E63A] font-bold text-[11px]">✓ Homologado</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-black rounded-xl border border-zinc-800 text-xs">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#A8E63A]" />
                      <span className="text-zinc-300">Seguro / Proteção Patrimonial Veicular</span>
                    </div>
                    <span className="text-[#A8E63A] font-bold text-[11px]">✓ Ativo</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-black rounded-xl border border-zinc-800 text-xs">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-[#A8E63A]" />
                      <span className="text-zinc-300">Selfie com Reconhecimento Facial</span>
                    </div>
                    <span className="text-[#A8E63A] font-bold text-[11px]">✓ Verificado</span>
                  </div>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#A8E63A] hover:bg-[#95d130] text-black font-black text-xs uppercase tracking-wider transition shadow-xl"
          >
            Confirmar e Salvar Perfil
          </button>
        </form>
      </div>
    </div>
  );
};
