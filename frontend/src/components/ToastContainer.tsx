import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md shadow-2xl text-sm font-medium transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
              isSuccess
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200 shadow-emerald-950/40'
                : isError
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-200 shadow-rose-950/40'
                : isWarning
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-200 shadow-amber-950/40'
                : 'bg-slate-900/90 border-cyan-500/40 text-cyan-100 shadow-cyan-950/40'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {isError && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
            {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-cyan-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
