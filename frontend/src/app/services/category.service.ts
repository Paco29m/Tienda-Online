import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly API = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<{ data: Category[] }>(this.API);
  }

  getOne(id: number) {
    return this.http.get<{ data: Category }>(`${this.API}/${id}`);
  }

  create(category: Partial<Category>) {
    return this.http.post<{ data: Category }>(this.API, category);
  }

  update(id: number, category: Partial<Category>) {
    return this.http.put<{ data: Category }>(`${this.API}/${id}`, category);
  }

  delete(id: number) {
    return this.http.delete<{ message: string; id: number }>(`${this.API}/${id}`);
  }
}
