export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
}

export interface Spec {
  key: string;
  value: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
  images?: string[];
  specifications?: Spec[];
  category_id?: number;
  category_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsResponse {
  data: Product[];
  pagination: Pagination;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}
