import React, { useEffect } from 'react';
import { ToastItem } from '../types';
import {
  Bell,
  Radio,
  Car,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 z-[99999] w-[92vw] max-w-md flex flex-col gap-2.5 pointer-events-none"
      id="toast-notification-hub"
    >
      {toasts.map((toast) => (
        <ToastSingleItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastSingleItem: React.FC<{
  toast: ToastItem;
  onDismiss: (id: string) => void;
}> = ({ toast, onDismiss }) => {
  const duration = toast.durationMs ?? 5500;

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'broadcast':
        return <Radio className="w-4 h-4 text-[#A8E63A] animate-pulse" />;
      case 'ride_status':
        return <Car className="w-4 h-4 text-[#A8E63A]" />;
      case 'chat':
        return <MessageSquare className="w-4 h-4 text-cyan-400" />;
      case 'sos':
        return <ShieldAlert className="w-4 h-4 text-red-400 animate-bounce" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-[#A8E63A]" />;
      case 'info':
      default:
        return <Bell className="w-4 h-4 text-[#A8E63A]" />;
    }
  };

  const getBorderAndBackground = () => {
    if (toast.type === 'sos') {
      return 'bg-[#180808]/95 border-red-500/80 shadow-[0_10px_35px_rgba(239,68,68,0.35)]';
    }
    if (toast.type === 'broadcast') {
      return toast.urgency === 'urgent'
        ? 'bg-[#151a0d]/95 border-[#A8E63A] shadow-[0_10px_35px_rgba(168,230,58,0.4)]'
        : 'bg-[#11141a]/95 border-[#A8E63A]/60 shadow-[0_10px_30px_rgba(168,230,58,0.25)]';
    }
    if (toast.type === 'warning') {
      return 'bg-[#1c1409]/95 border-amber-500/60 shadow-[0_10px_30px_rgba(245,158,11,0.25)]';
    }
    if (toast.type === 'chat') {
      return 'bg-[#0b141a]/95 border-cyan-500/60 shadow-[0_10px_30px_rgba(6,182,212,0.25)]';
    }
    return 'bg-[#121418]/95 border-zinc-700/80 shadow-[0_10px_30px_rgba(0,0,0,0.85)]';
  };

  const getBadgeLabel = () => {
    switch (toast.type) {
      case 'broadcast':
        return 'Central W Drive • Comunicado';
      case 'ride_status':
        return 'Status da Corrida';
      case 'chat':
        return 'Mensagem no Chat';
      case 'sos':
        return 'Alerta SOS Emergência';
      case 'warning':
        return 'Aviso do Sistema';
      case 'success':
        return 'W Drive Oficial';
      default:
        return 'Notificação';
    }
  };

  return (
    <div
      className={`pointer-events-auto rounded-2xl border backdrop-blur-xl p-3.5 text-white transition-all transform duration-300 animate-slide-down relative overflow-hidden group select-none ${getBorderAndBackground()}`}
      role="alert"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="p-1 rounded-lg bg-black/60 border border-white/10 shrink-0">
            {getIcon()}
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#A8E63A] truncate">
            {getBadgeLabel()}
          </span>
          {toast.timestamp && (
            <span className="text-[9px] text-zinc-400 font-medium shrink-0">
              • {toast.timestamp}
            </span>
          )}
        </div>

        <button
          onClick={() => onDismiss(toast.id)}
          className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition shrink-0"
          aria-label="Fechar notificação"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="pl-0.5 space-y-1">
        <h4 className="text-xs font-bold text-white leading-tight">
          {toast.title}
        </h4>
        <p className="text-[11px] text-zinc-300 leading-snug break-words">
          {toast.message}
        </p>
      </div>

      {/* Action Button if provided */}
      {toast.actionLabel && (
        <div className="mt-2.5 pt-2 border-t border-white/10 flex justify-end">
          <button
            onClick={() => {
              if (toast.onAction) toast.onAction();
              onDismiss(toast.id);
            }}
            className="px-3 py-1 rounded-xl bg-[#A8E63A] hover:bg-[#95d130] text-black font-black text-[10px] uppercase flex items-center gap-1 transition shadow active:scale-95"
          >
            <span>{toast.actionLabel}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Subtle Progress Bar */}
      {duration > 0 && (
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#A8E63A]/40 overflow-hidden"
          style={{
            animation: `toast-progress ${duration}ms linear forwards`,
          }}
        />
      )}
    </div>
  );
};
