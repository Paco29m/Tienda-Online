import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  cart = inject(CartService);

  increment(item: CartItem): void {
    this.cart.setQuantity(item.product.id, item.quantity + 1, item.size);
  }

  decrement(item: CartItem): void {
    this.cart.setQuantity(item.product.id, item.quantity - 1, item.size);
  }
}
