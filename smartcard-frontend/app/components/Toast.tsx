"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'loading';
  showAdvanceStep?: boolean;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'loading', showAdvanceStep?: boolean) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'loading' = 'info', showAdvanceStep: boolean = false): string => {
    const id = Date.now().toString();
    const toast: Toast = { id, message, type, showAdvanceStep };
    setToasts(prev => [...prev, toast]);

    // Auto remove after 3 seconds for non-loading toasts
    if (type !== 'loading') {
      setTimeout(() => {
        removeToast(id);
      }, 3000);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC<{ toasts: Toast[]; removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="space-y-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </div>
  );
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-700 shadow-2xl';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-700 shadow-2xl';
      case 'loading':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-700 shadow-2xl';
      case 'info':
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-700 shadow-2xl';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'loading':
        return (
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        );
      case 'info':
      default:
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`flex items-center p-6 rounded-xl shadow-2xl border-l-4 transform transition-all duration-500 ease-out animate-in zoom-in-95 scale-95 pointer-events-auto max-w-md mx-auto ${getToastStyles()}`}
    >
      <div className="flex-shrink-0 mr-4">
        {getIcon()}
      </div>
      <div className="flex-1 text-center">
        <div className="text-lg font-semibold mb-1">
          {toast.message}
        </div>
        {toast.showAdvanceStep && toast.type === 'success' && (
          <div className="text-sm opacity-90 font-medium">
            Advance Step
          </div>
        )}
      </div>
      {toast.type !== 'loading' && (
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 ml-4 text-white hover:text-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};