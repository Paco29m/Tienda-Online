import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthResponse, User } from '../models';
import { environment } from '../../environments/environment';

/**
 * Gestiona el estado de autenticación mediante señales de Angular.
 * Token y datos de usuario se persisten en localStorage para sobrevivir recargas de página.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = `${environment.apiUrl}/auth`;

  private _token = signal<string | null>(localStorage.getItem('token'));
  private _user = signal<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));

  token = this._token.asReadonly();
  user = this._user.asReadonly();
  isLoggedIn = computed(() => !!this._token());
  isAdmin = computed(() => this._user()?.role === 'admin');

  constructor(private http: HttpClient, private router: Router) {}

  /** Envía las credenciales y almacena el JWT y los datos del usuario devueltos. */
  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.API}/login`, { email, password }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this._token.set(res.token);
        this._user.set(res.user);
      })
    );
  }

  /** Registra un nuevo usuario (el rol 'user' se asigna en el servidor). */
  register(name: string, email: string, password: string) {
    return this.http.post(`${this.API}/register`, { name, email, password });
  }

  /** Limpia la sesión local y redirige a /login. */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/login']);
  }
}
