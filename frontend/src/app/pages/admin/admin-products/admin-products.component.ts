import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product, Category, Spec } from '../../../models';

const SPECS_CATEGORIES = ['Electrónica', 'Hogar', 'Ropa'];

@Component({
  selector: 'app-admin-products',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss',
})
export class AdminProductsComponent implements OnInit {
  private productService  = inject(ProductService);
  private categoryService = inject(CategoryService);
  private cdr             = inject(ChangeDetectorRef);

  products:  Product[]  = [];
  categories: Category[] = [];
  loading   = true;
  showForm  = false;
  editingId: number | null = null;
  error   = '';
  success = '';

  form: Partial<Product> = this.emptyForm();
  formSpecs:   Spec[]   = [];
  formImages:  string[] = [];

  emptyForm(): Partial<Product> {
    return { name: '', description: '', price: 0, stock: 0, image_url: '', category_id: undefined };
  }

  get isSpecsCategory(): boolean {
    const cat = this.categories.find(c => c.id === Number(this.form.category_id));
    return SPECS_CATEGORIES.includes(cat?.name ?? '');
  }

  get specsLabel(): string {
    const cat = this.categories.find(c => c.id === Number(this.form.category_id));
    return cat?.name === 'Ropa' ? 'Composición' : 'Especificaciones técnicas';
  }

  ngOnInit() {
    this.loadProducts();
    this.categoryService.getAll().subscribe(res => (this.categories = res.data));
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAll({ limit: 100 }).subscribe({
      next:  res => { this.products = res.data; this.loading = false; this.cdr.detectChanges(); },
      error: ()  => { this.loading = false; this.cdr.detectChanges(); },
    });
  }

  openCreate() {
    this.form       = this.emptyForm();
    this.formSpecs  = [];
    this.formImages = [];
    this.editingId  = null;
    this.showForm   = true;
    this.error      = '';
  }

  openEdit(product: Product) {
    this.form       = { ...product };
    this.formSpecs  = product.specifications ? [...product.specifications.map(s => ({ ...s }))] : [];
    this.formImages = product.images ? [...product.images] : [];
    this.editingId  = product.id;
    this.showForm   = true;
    this.error      = '';
  }

  closeForm() {
    this.showForm   = false;
    this.editingId  = null;
    this.form       = this.emptyForm();
    this.formSpecs  = [];
    this.formImages = [];
  }

  addSpec() {
    this.formSpecs.push({ key: '', value: '' });
  }

  removeSpec(index: number) {
    this.formSpecs.splice(index, 1);
  }

  addImage() {
    this.formImages.push('');
  }

  removeImage(index: number) {
    this.formImages.splice(index, 1);
  }

  submit() {
    this.error = '';
    const payload: Partial<Product> = {
      ...this.form,
      images: this.formImages.filter(url => url.trim()),
      specifications: this.isSpecsCategory
        ? this.formSpecs.filter(s => s.key.trim() && s.value.trim())
        : [],
    };

    const action = this.editingId
      ? this.productService.update(this.editingId, payload)
      : this.productService.create(payload);

    action.subscribe({
      next: () => {
        this.success = this.editingId ? 'Producto actualizado' : 'Producto creado';
        this.closeForm();
        this.loadProducts();
        setTimeout(() => (this.success = ''), 3000);
      },
      error: err => (this.error = err.error?.error || 'Error al guardar'),
    });
  }

  delete(id: number) {
    if (!confirm('¿Eliminar este producto?')) return;
    this.productService.delete(id).subscribe({
      next: () => {
        this.success = 'Producto eliminado';
        this.loadProducts();
        setTimeout(() => (this.success = ''), 3000);
      },
      error: err => (this.error = err.error?.error || 'Error al eliminar'),
    });
  }
}
