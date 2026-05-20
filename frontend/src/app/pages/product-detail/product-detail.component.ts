import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../models';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  private route          = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService    = inject(CartService);
  private toastService   = inject(ToastService);
  private titleService   = inject(Title);
  private cdr            = inject(ChangeDetectorRef);

  product: Product | null = null;
  loading      = true;
  error        = '';
  quantity     = 1;
  added        = false;
  currentIndex = 0;

  readonly sizes = ['XS', 'S', 'M', 'L', 'XL'];
  selectedSize: string | null = null;
  sizeError = false;

  get isClothing(): boolean {
    return this.product?.category_name === 'Ropa';
  }

  get isSpecsCategory(): boolean {
    const cat = this.product?.category_name;
    return cat === 'Electrónica' || cat === 'Hogar' || cat === 'Ropa';
  }

  get specsTitle(): string {
    return this.product?.category_name === 'Ropa' ? 'Composición' : 'Especificaciones';
  }

  get carouselImages(): string[] {
    if (!this.product) return [];
    if (this.product.images?.length) return this.product.images;
    const id = this.product.id;
    return [
      this.product.image_url || `https://picsum.photos/seed/${id}/600/450`,
      `https://picsum.photos/seed/${id * 3 + 1}/600/450`,
      `https://picsum.photos/seed/${id * 7 + 2}/600/450`,
    ];
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getOne(id).subscribe({
      next: (res) => {
        this.product      = res.data;
        this.currentIndex = 0;
        this.loading      = false;
        this.titleService.setTitle(`${res.data.name} | TiendaOnline`);
        this.cdr.detectChanges();
      },
      error: () => {
        this.error   = 'Producto no encontrado';
        this.loading = false;
        this.titleService.setTitle('Producto no encontrado | TiendaOnline');
        this.cdr.detectChanges();
      },
    });
  }

  prev(): void {
    this.currentIndex = (this.currentIndex - 1 + this.carouselImages.length) % this.carouselImages.length;
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.carouselImages.length;
  }

  goTo(index: number): void {
    this.currentIndex = index;
  }

  selectSize(size: string): void {
    this.selectedSize = size;
    this.sizeError    = false;
  }

  decrement(): void {
    if (this.quantity > 1) this.quantity--;
  }

  increment(): void {
    if (this.product && this.quantity < this.product.stock) this.quantity++;
  }

  addToCart(): void {
    if (!this.product) return;

    if (this.isClothing && !this.selectedSize) {
      this.sizeError = true;
      return;
    }

    this.cartService.add(
      this.product,
      this.quantity,
      this.isClothing ? this.selectedSize! : undefined
    );
    this.toastService.success(`"${this.product.name}" agregado al carrito`);
    this.added = true;
    setTimeout(() => (this.added = false), 2500);
  }
}
