import { Injectable, computed, inject, signal } from '@angular/core';
import { CartItem, Product } from '../models';
import { ToastService } from './toast.service';

/**
 * Gestiona el carrito de compras con señales de Angular.
 * El estado se persiste en localStorage en cada mutación para sobrevivir recargas.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private toast = inject(ToastService);
  private _items = signal<CartItem[]>(
    JSON.parse(localStorage.getItem('cart') || '[]')
  );
  private _isOpen = signal(false);

  items      = this._items.asReadonly();
  isOpen     = this._isOpen.asReadonly();
  totalItems = computed(() => this._items().reduce((sum, i) => sum + i.quantity, 0));
  totalPrice = computed(() =>
    this._items().reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0)
  );

  /** Agrega un producto; si ya existe con la misma talla, incrementa la cantidad hasta el stock disponible. */
  add(product: Product, quantity = 1, size?: string): void {
    this._items.update(items => {
      const idx = items.findIndex(i => i.product.id === product.id && i.size === size);
      if (idx >= 0) {
        return items.map((item, i) =>
          i === idx
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...items, { product, quantity: Math.min(quantity, product.stock), size }];
    });
    this.persist();
    this.open();
  }

  /** Elimina un ítem del carrito y muestra una notificación toast. */
  remove(productId: number, size?: string): void {
    const name = this._items().find(i => i.product.id === productId && i.size === size)?.product.name;
    this._items.update(items =>
      items.filter(i => !(i.product.id === productId && i.size === size))
    );
    this.persist();
    if (name) this.toast.info(`"${name}" eliminado del carrito`);
  }

  /** Cambia la cantidad de un ítem; delega a remove() si quantity ≤ 0. */
  setQuantity(productId: number, quantity: number, size?: string): void {
    if (quantity <= 0) { this.remove(productId, size); return; }
    this._items.update(items =>
      items.map(i =>
        i.product.id === productId && i.size === size ? { ...i, quantity } : i
      )
    );
    this.persist();
  }

  clear(): void {
    this._items.set([]);
    this.persist();
  }

  open():  void { this._isOpen.set(true); }
  close(): void { this._isOpen.set(false); }

  /** Serializa el estado actual del carrito a localStorage. */
  private persist(): void {
    localStorage.setItem('cart', JSON.stringify(this._items()));
  }
}
