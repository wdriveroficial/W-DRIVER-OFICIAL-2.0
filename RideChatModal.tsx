import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, AppRole } from '../types';
import { Send, X, ShieldCheck, MessageSquare, Clock } from 'lucide-react';
import { audioService } from '../services/audioService';

interface RideChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  currentRole: 'driver' | 'passenger';
  peerName: string;
  peerPhoto?: string;
  onSendMessage: (text: string) => void;
}

export const RideChatModal: React.FC<RideChatModalProps> = ({
  isOpen,
  onClose,
  messages,
  currentRole,
  peerName,
  peerPhoto,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
    audioService.playChime('notification');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#121316] border border-[#262a30] rounded-3xl w-full max-w-md h-[560px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
        {/* Chat Header */}
        <div className="px-4 py-3 bg-[#181a1f] border-b border-[#262a30] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={peerPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                alt={peerName}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#A8E63A]"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#A8E63A] rounded-full border-2 border-[#121316]"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-white">{peerName}</h3>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#A8E63A]/20 text-[#A8E63A] font-bold">
                  {currentRole === 'driver' ? 'Passageiro' : 'Motorista Oficial'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#A8E63A]" />
                Canal Seguro Criptografado W-DRIVER
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security Banner Note */}
        <div className="bg-black/60 px-4 py-1.5 border-b border-zinc-800 text-center">
          <span className="text-[10px] text-zinc-400">
            🔒 Para sua segurança e privacidade, a comunicação é realizada exclusivamente pelo chat oficial da plataforma.
          </span>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
              <MessageSquare className="w-10 h-10 text-zinc-600 mb-2 opacity-50" />
              <p className="text-xs font-semibold text-zinc-400">Inicie a conversa com {peerName}</p>
              <p className="text-[11px] text-zinc-600 mt-1 max-w-[240px]">
                Envie pontos de referência ou detalhes sobre o local de embarque.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderRole === currentRole;
              const isSystem = msg.senderRole === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="text-center my-2">
                    <span className="px-3 py-1 rounded-full bg-zinc-850 text-zinc-400 text-[10px] border border-zinc-800 inline-block font-mono">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs font-medium ${
                      isMe
                        ? 'bg-[#A8E63A] text-black rounded-tr-none shadow-md font-semibold'
                        : 'bg-[#1e2229] text-white rounded-tl-none border border-[#2e333d]'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className="text-[9px] text-zinc-500 mt-1 px-1 flex items-center gap-1 font-mono">
                    <Clock className="w-2.5 h-2.5" />
                    {msg.timestamp}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-[#16181d] border-t border-[#23272f] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(currentRole === 'driver'
            ? ['Já cheguei ao local!', 'Estou com o pisca-alerta ligado', 'Em 2 minutos chego aí', 'Qual o número exato?']
            : ['Estou descendo!', 'Estou em frente ao portão', 'Camisa preta na calçada', 'Obrigado, já te vi!']
          ).map((quickText, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSendMessage(quickText)}
              className="px-2.5 py-1 rounded-full bg-black/60 border border-zinc-800 text-[10px] text-zinc-300 hover:text-white hover:border-[#A8E63A] whitespace-nowrap transition"
            >
              {quickText}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-[#181a1f] border-t border-[#262a30] flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Mensagem para ${peerName}...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-black border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#A8E63A]"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-xl bg-[#A8E63A] hover:bg-[#95d130] disabled:bg-zinc-800 disabled:text-zinc-600 text-black flex items-center justify-center font-bold transition shadow-lg shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
