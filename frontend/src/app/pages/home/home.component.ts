import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product, Category } from '../../models';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private title = inject(Title);
  private cdr   = inject(ChangeDetectorRef);

  featured: Product[] = [];
  categories: Category[] = [];
  loading = true;

  ngOnInit() {
    this.title.setTitle('TiendaOnline — Tu tienda en línea');
    this.productService.getAll({ limit: 8 }).subscribe({
      next: (res) => {
        this.featured = res.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); },
    });

    this.categoryService.getAll().subscribe({
      next: (res) => { this.categories = res.data; this.cdr.detectChanges(); },
    });
  }
}
