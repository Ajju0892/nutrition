import React from 'react';
import { useEcoSync } from '../../context/EcoSyncContext.jsx';


export default function ToastContainer() {
  const { toasts, removeToast } = useEcoSync();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 md:right-6 z-50 flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((toast) => {
        const iconColor =
          toast.type === 'secondary'
            ? 'text-secondary'
            : toast.type === 'error'
            ? 'text-error'
            : 'text-primary';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-2xl text-on-surface animate-slide-left min-w-[280px] max-w-sm"
          >
            <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0">
              <span className={`material-symbols-outlined text-lg ${iconColor}`}>{toast.icon}</span>
            </div>
            <div className="flex-1 pr-2">
              <p className="font-headline font-bold text-sm leading-snug">{toast.title}</p>
              <p className="text-xs text-on-surface-variant line-clamp-1">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-outline hover:text-on-surface transition-colors p-1"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
