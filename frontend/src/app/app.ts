import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CartComponent } from './components/cart/cart.component';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, CartComponent, ToastComponent],
  template: `
    <app-header />
    <main class="main-content">
      <router-outlet />
    </main>
    <footer class="footer">
      <div class="footer__container">
        <p class="footer__text">&copy; 2025 TiendaOnline. Todos los derechos reservados.</p>
      </div>
    </footer>
    <app-cart />
    <app-toast />
  `,
})
export class App {}
