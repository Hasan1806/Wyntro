"use client";

import { create } from "zustand";
import { CheckCircle2, Info, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: "success" | "info" | "error";
}

interface ToastStore {
  toasts: ToastMessage[];
  push: (toast: Omit<ToastMessage, "id">) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3600);
  },
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export function toast(input: Omit<ToastMessage, "id">) {
  useToastStore.getState().push(input);
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex items-start gap-3 rounded-[10px] border bg-white p-3.5 shadow-lg",
            t.variant === "error"
              ? "border-[#FDA29B]"
              : t.variant === "info"
              ? "border-[#B2DDFF]"
              : "border-[#E4E7EC]"
          )}
        >
          {t.variant === "error" ? (
            <AlertCircle className="h-4 w-4 text-[#F04438] shrink-0 mt-0.5" />
          ) : t.variant === "info" ? (
            <Info className="h-4 w-4 text-[#2E90FA] shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-[#12B76A] shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-[#101828]">{t.title}</p>
            {t.description && (
              <p className="text-[12px] text-[#667085] mt-0.5">{t.description}</p>
            )}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="text-[#98A2B3] hover:text-[#101828] cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
