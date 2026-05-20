import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

/**
 * Sistema global de notificaciones toast usando señales de Angular.
 * Los toasts se auto-descartan tras la duración indicada (por defecto 3.5 s).
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();
  private nextId = 0;

  /** Agrega un toast a la cola y programa su eliminación automática. */
  show(message: string, type: ToastType = 'info', duration = 3500): void {
    const id = this.nextId++;
    this._toasts.update(list => [...list, { id, message, type }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  success(message: string): void { this.show(message, 'success'); }
  error(message: string): void   { this.show(message, 'error'); }
  info(message: string): void    { this.show(message, 'info'); }

  /** Elimina un toast de la cola por su ID. */
  dismiss(id: number): void {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }
}
