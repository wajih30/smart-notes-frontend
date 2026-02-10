export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

class ToastManager {
  private toasts: Toast[] = [];
  private listeners: Array<(toasts: Toast[]) => void> = [];

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  show(message: string, type: ToastType = 'info', duration: number = 5000) {
    const id = Math.random().toString(36).slice(2, 11);
    const toast: Toast = { id, message, type, duration };
    this.toasts.push(toast);
    this.notify();

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }

    return id;
  }

  remove(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  clear() {
    this.toasts = [];
    this.notify();
  }

  getToasts() {
    return [...this.toasts];
  }
}

export const toastManager = new ToastManager();

export const toast = {
  success: (message: string, duration?: number) =>
    toastManager.show(message, 'success', duration),
  error: (message: string, duration?: number) =>
    toastManager.show(message, 'error', duration),
  info: (message: string, duration?: number) =>
    toastManager.show(message, 'info', duration),
  warning: (message: string, duration?: number) =>
    toastManager.show(message, 'warning', duration),
};
