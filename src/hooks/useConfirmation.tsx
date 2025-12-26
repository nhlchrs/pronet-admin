import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ConfirmationState {
  isOpen: boolean;
  title: string;
  message: string;
  details?: string;
  confirmText: string;
  cancelText: string;
  isDangerous?: boolean;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ConfirmationContextType {
  confirm: (options: ConfirmationOptions) => Promise<boolean>;
  state: ConfirmationState;
  handleConfirm: () => void;
  handleCancel: () => void;
}

interface ConfirmationOptions {
  title: string;
  message: string;
  details?: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export const ConfirmationProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ConfirmationState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDangerous: false,
  });

  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        title: options.title,
        message: options.message,
        details: options.details,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        isDangerous: options.isDangerous || false,
      });
      setResolvePromise(() => resolve);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
  }, [resolvePromise]);

  const handleCancel = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
  }, [resolvePromise]);

  return (
    <ConfirmationContext.Provider value={{ confirm, state, handleConfirm, handleCancel }}>
      {children}
    </ConfirmationContext.Provider>
  );
};

export const useConfirmation = (): ConfirmationContextType => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within ConfirmationProvider');
  }
  return context;
};
