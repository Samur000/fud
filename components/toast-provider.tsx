'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Toast, ToastAction, ToastClose, ToastDescription, ToastProvider as ToastProviderPrimitive, ToastTitle, ToastViewport } from '@/components/ui/toast';

interface ToastContextType {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, removeToast, success, error } = useToast();

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}
      <ToastProviderPrimitive>
        {toasts.map((toast) => (
          <Toast key={toast.id} variant={toast.variant}>
            <div className="grid gap-1">
              <ToastTitle>{toast.title}</ToastTitle>
              {toast.description && (
                <ToastDescription>{toast.description}</ToastDescription>
              )}
            </div>
            <ToastClose onClick={() => removeToast(toast.id)} />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProviderPrimitive>
    </ToastContext.Provider>
  );
} 