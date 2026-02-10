import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { toastManager, type Toast } from '../../utils/toast';
import { cn } from '../../utils/cn';

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] max-w-md',
              colors[toast.type]
            )}
          >
            <Icon className="flex-shrink-0" size={20} />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => toastManager.remove(toast.id)}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
