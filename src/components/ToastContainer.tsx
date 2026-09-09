import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useHospital();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-sky-400 shrink-0" />;
        let borderBg = 'border-sky-500/30 bg-[#1e293b]/95';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
          borderBg = 'border-emerald-500/30 bg-[#172554]/95';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
          borderBg = 'border-amber-500/30 bg-[#291e10]/95';
        } else if (toast.type === 'error') {
          icon = <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
          borderBg = 'border-rose-500/30 bg-[#2c1517]/95';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border ${borderBg} backdrop-blur-md shadow-2xl flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-white tracking-wide">{toast.title}</h5>
              {toast.message && (
                <p className="text-[11px] text-neutral-300 mt-0.5 leading-snug">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-white transition-colors p-0.5 rounded-lg hover:bg-white/10 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
