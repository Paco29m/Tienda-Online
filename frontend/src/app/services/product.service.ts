import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product, ProductsResponse } from '../models';
import { environment } from '../../environments/environment';

/**
 * Wrapper HTTP para el endpoint /api/products.
 * Los parámetros opcionales se omiten del query string si son undefined o vacíos.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly API = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  /** Lista paginada de productos; admite filtro por categoría, texto de búsqueda, página y límite. */
  getAll(params: { category_id?: number; search?: string; page?: number; limit?: number } = {}) {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        httpParams = httpParams.set(key, String(val));
      }
    });
    return this.http.get<ProductsResponse>(this.API, { params: httpParams });
  }

  /** Detalle de un producto por ID. */
  getOne(id: number) {
    return this.http.get<{ data: Product }>(`${this.API}/${id}`);
  }

  create(product: Partial<Product>) {
    return this.http.post<{ data: Product }>(this.API, product);
  }

  update(id: number, product: Partial<Product>) {
    return this.http.put<{ data: Product }>(`${this.API}/${id}`, product);
  }

  delete(id: number) {
    return this.http.delete<{ message: string; id: number }>(`${this.API}/${id}`);
  }
}
