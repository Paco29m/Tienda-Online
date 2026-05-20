import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Product, Category, Pagination } from '../../models';

@Component({
  selector: 'app-products',
  imports: [RouterLink, FormsModule, CurrencyPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  private productService  = inject(ProductService);
  private categoryService = inject(CategoryService);
  private cartService     = inject(CartService);
  private toastService    = inject(ToastService);
  private titleService    = inject(Title);
  private cdr             = inject(ChangeDetectorRef);
  private destroy$        = new Subject<void>();
  private searchSubject$  = new Subject<string>();

  products: Product[] = [];
  categories: Category[] = [];
  pagination: Pagination = { total: 0, page: 1, limit: 12, totalPages: 1 };

  selectedCategory: number | '' = '';
  searchQuery = '';
  loading = true;
  skeletons = Array(8);

  ngOnInit() {
    this.titleService.setTitle('Productos | TiendaOnline');
    this.categoryService.getAll().subscribe((res) => (this.categories = res.data));
    this.loadProducts();

    this.searchSubject$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    ).subscribe(() => this.loadProducts(1));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(page = 1) {
    this.loading = true;
    this.productService
      .getAll({
        category_id: this.selectedCategory || undefined,
        search: this.searchQuery || undefined,
        page,
        limit: this.pagination.limit,
      })
      .subscribe({
        next: (res) => {
          this.products = res.data;
          this.pagination = res.pagination;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
          this.toastService.error('Error al cargar los productos');
        },
      });
  }

  onCategoryChange() {
    this.loadProducts(1);
  }

  onSearchInput() {
    this.searchSubject$.next(this.searchQuery);
  }

  onSearch() {
    this.loadProducts(1);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.pagination.totalPages) return;
    this.loadProducts(page);
  }

  addToCart(product: Product): void {
    this.cartService.add(product, 1);
    this.toastService.success(`"${product.name}" agregado al carrito`);
  }

  get pages(): number[] {
    return Array.from({ length: this.pagination.totalPages }, (_, i) => i + 1);
  }
}
