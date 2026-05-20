import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  template: `
    <div class="dashboard">
      <h1 class="dashboard__title">Dashboard</h1>
      <div class="dashboard__cards">
        <div class="stat-card">
          <span class="stat-card__icon">📦</span>
          <div class="stat-card__info">
            <span class="stat-card__value">{{ totalProducts }}</span>
            <span class="stat-card__label">Productos</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-card__icon">🏷️</span>
          <div class="stat-card__info">
            <span class="stat-card__value">{{ totalCategories }}</span>
            <span class="stat-card__label">Categorías</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard__title { font-size: 1.5rem; margin-bottom: 1.5rem; color: #1a1a2e; }
    .dashboard__cards { display: flex; gap: 1rem; flex-wrap: wrap; }
    .stat-card {
      background: #fff;
      border-radius: 10px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      min-width: 200px;

      &__icon { font-size: 2.5rem; }
      &__value { font-size: 2rem; font-weight: 700; color: #e94560; display: block; }
      &__label { color: #666; font-size: 0.9rem; }
    }
  `],
})
export class AdminDashboardComponent implements OnInit {
  private productService  = inject(ProductService);
  private categoryService = inject(CategoryService);
  private title = inject(Title);
  private cdr   = inject(ChangeDetectorRef);

  totalProducts = 0;
  totalCategories = 0;

  ngOnInit() {
    this.title.setTitle('Dashboard | Admin | TiendaOnline');
    this.productService.getAll({ limit: 1 }).subscribe(res => {
      this.totalProducts = res.pagination.total;
      this.cdr.detectChanges();
    });
    this.categoryService.getAll().subscribe(res => {
      this.totalCategories = res.data.length;
      this.cdr.detectChanges();
    });
  }
}
