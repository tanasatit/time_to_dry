// src/components/ToastManager.tsx
'use client';

import { useEffect, useState } from 'react';

type Toast = {
  id: number;
  message: string;
  type?: 'info' | 'error' | 'success';
};

let externalAddToast: (message: string, type?: Toast['type']) => void;

// ---- Shared in-memory history store ----
const toastHistory: Toast[] = [];
export const getToastHistory = () => toastHistory;

export const addToast = (message: string, type: Toast['type'] = 'info') => {
  externalAddToast?.(message, type);
};

export default function ToastManager() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    externalAddToast = (message, type = 'info') => {
      const id = Date.now();
      const toast: Toast = { id, message, type };
      setToasts((prev) => [...prev, toast]);
      toastHistory.unshift(toast);  // newest at start (for bell panel)
      if (toastHistory.length > 20) toastHistory.length = 20; // keep 20 max

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[1000] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded shadow text-white text-sm ${
            toast.type === 'error'
              ? 'bg-red-500'
              : toast.type === 'success'
              ? 'bg-green-500'
              : 'bg-blue-500'
          }`}
        >
          {toast.message}
          <button
            className="ml-2 font-bold"
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
