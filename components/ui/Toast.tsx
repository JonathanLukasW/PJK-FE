"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import type { ToastMessage, ToastType } from "@/types";


interface ToastContextValue {
  toast: (opts: Omit<ToastMessage, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_ICONS: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const TOAST_STYLES: Record<ToastType, { icon: string; border: string }> = {
  success: { icon: "text-teal-400", border: "border-l-teal-400" },
  error: { icon: "text-red-400", border: "border-l-red-400" },
  warning: { icon: "text-amber-400", border: "border-l-amber-400" },
  info: { icon: "text-blue-400", border: "border-l-blue-400" },
};

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => onDismiss(toast.id), 300);
  }, [onDismiss, toast.id]);

  const Icon = TOAST_ICONS[toast.type];
  const style = TOAST_STYLES[toast.type];

  return (
    <div
      role="alert"
      className={`
        flex items-start gap-3 w-80 p-4 rounded-xl border-l-4
        bg-[var(--bg-card)] border border-[var(--border)] shadow-lg
        transition-all duration-300 ease-out
        ${style.border}
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}
      `}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${style.icon}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--fg)]">{toast.title}</p>
        {toast.description && (
          <p className="text-xs text-[var(--fg-muted)] mt-0.5 leading-relaxed">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-0.5 rounded-md text-[var(--fg-subtle)] hover:text-[var(--fg-muted)] transition-colors"
        aria-label="Tutup notifikasi"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}


export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [mounted, setMounted] = useState(false);
  const counterRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (opts: Omit<ToastMessage, "id">) => {
      const id = `toast-${Date.now()}-${++counterRef.current}`;
      const duration = opts.duration ?? 4000;

      setToasts((prev) => [...prev.slice(-4), { ...opts, id }]);

      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss]
  );

  const helpers: ToastContextValue = {
    toast: addToast,
    success: (title, description) => addToast({ type: "success", title, description }),
    error: (title, description) => addToast({ type: "error", title, description }),
    warning: (title, description) => addToast({ type: "warning", title, description }),
    info: (title, description) => addToast({ type: "info", title, description }),
  };

  return (
    <ToastContext.Provider value={helpers}>
      {children}
      {mounted &&
        createPortal(
          <div
            aria-live="polite"
            className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end"
          >
            {toasts.map((t) => (
              <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}


export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within <ToastProvider>");
  }
  return ctx;
}
