import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models';

@Component({
  selector: 'app-admin-categories',
  imports: [FormsModule],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.scss',
})
export class AdminCategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private cdr             = inject(ChangeDetectorRef);

  categories: Category[] = [];
  loading = true;
  showForm = false;
  editingId: number | null = null;
  error = '';
  success = '';

  form: Partial<Category> = { name: '', description: '' };

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (res) => {
        this.categories = res.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); },
    });
  }

  openCreate() {
    this.form = { name: '', description: '' };
    this.editingId = null;
    this.showForm = true;
    this.error = '';
  }

  openEdit(cat: Category) {
    this.form = { ...cat };
    this.editingId = cat.id;
    this.showForm = true;
    this.error = '';
  }

  closeForm() {
    this.showForm = false;
    this.editingId = null;
    this.form = { name: '', description: '' };
  }

  submit() {
    this.error = '';
    const action = this.editingId
      ? this.categoryService.update(this.editingId, this.form)
      : this.categoryService.create(this.form);

    action.subscribe({
      next: () => {
        this.success = this.editingId ? 'Categoría actualizada' : 'Categoría creada';
        this.closeForm();
        this.loadCategories();
        setTimeout(() => (this.success = ''), 3000);
      },
      error: (err) => (this.error = err.error?.error || 'Error al guardar'),
    });
  }

  delete(id: number) {
    if (!confirm('¿Eliminar esta categoría?')) return;
    this.categoryService.delete(id).subscribe({
      next: () => {
        this.success = 'Categoría eliminada';
        this.loadCategories();
        setTimeout(() => (this.success = ''), 3000);
      },
      error: (err) => (this.error = err.error?.error || 'Error al eliminar'),
    });
  }
}
