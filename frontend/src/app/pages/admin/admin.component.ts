import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <h2 class="admin-sidebar__title">Panel Admin</h2>
        <nav class="admin-sidebar__nav">
          <a routerLink="/admin" routerLinkActive="admin-sidebar__link--active"
             [routerLinkActiveOptions]="{ exact: true }"
             class="admin-sidebar__link">Dashboard</a>
          <a routerLink="/admin/products" routerLinkActive="admin-sidebar__link--active"
             class="admin-sidebar__link">Productos</a>
          <a routerLink="/admin/categories" routerLinkActive="admin-sidebar__link--active"
             class="admin-sidebar__link">Categorías</a>
        </nav>
      </aside>
      <main class="admin-main">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: calc(100vh - 64px);
    }
    .admin-sidebar {
      width: 220px;
      background: #1a1a2e;
      padding: 1.5rem 1rem;
      flex-shrink: 0;

      &__title {
        color: #e94560;
        font-size: 1rem;
        margin-bottom: 1.5rem;
        padding-left: 0.5rem;
      }

      &__nav {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      &__link {
        display: block;
        color: #ccc;
        text-decoration: none;
        padding: 0.6rem 0.75rem;
        border-radius: 6px;
        font-size: 0.95rem;
        transition: background 0.2s, color 0.2s;

        &:hover { background: rgba(255,255,255,0.08); color: #fff; }
        &--active { background: rgba(233,69,96,0.15); color: #e94560; }
      }
    }
    .admin-main {
      flex: 1;
      padding: 2rem;
      background: #f5f5f5;
      overflow-y: auto;
    }
    @media (max-width: 768px) {
      .admin-layout { flex-direction: column; }
      .admin-sidebar { width: 100%; }
    }
  `],
})
export class AdminComponent {}
