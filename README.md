# TiendaOnline — Prueba de Desarrollo de Software

## Demo en vivo

| | URL |
|---|---|
| Frontend (Vercel) | https://tienda-online-rust-six.vercel.app |
| Backend API (Railway) | https://tienda-online-production-60e1.up.railway.app/api/health |

---

E-commerce completo con **Angular 19** (frontend) + **Node.js / Express** (backend) + **PostgreSQL** (base de datos).

---

## Tecnologías utilizadas

| Capa | Tecnología |
|---|---|
| Frontend | Angular 19 (standalone components, signals) |
| Estilos | SCSS con metodología BEM |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL |
| Autenticación | JWT + bcryptjs |
| Validación | Joi |

---

## Estructura del proyecto

```
Segundo filtro/
├── backend/
│   ├── database/
│   │   ├── schema.sql        # Definición de tablas y triggers
│   │   ├── seed.js           # Datos de prueba (bcrypt en tiempo de ejecución)
│   │   └── init.js           # Inicialización de conexión
│   ├── src/
│   │   ├── config/           # Pool de conexión a PostgreSQL
│   │   ├── controllers/      # Lógica de negocio (auth, products, categories, users)
│   │   ├── middlewares/      # auth (JWT), validate (Joi), errorHandler
│   │   ├── routes/           # Endpoints REST
│   │   └── validations/      # Esquemas Joi
│   ├── server.js
│   └── .env
│
├── frontend/
│   └── src/app/
│       ├── components/       # Header, Cart (carrito lateral)
│       ├── guards/           # authGuard, adminGuard
│       ├── interceptors/     # Inyección automática de JWT
│       ├── models/           # Interfaces TypeScript
│       ├── pages/            # Home, Products, ProductDetail, Login, Register, Admin
│       └── services/         # AuthService, ProductService, CategoryService, CartService
│
├── ER-Diagram.html           # Diagrama entidad-relación (abrir en navegador)
├── TiendaOnline.postman_collection.json  # Colección Postman importable
└── README.md
```

---

## Requisitos del sistema

| Herramienta | Versión mínima |
|---|---|
| Node.js | 18 LTS |
| npm | 9+ |
| PostgreSQL | 14+ |
| Angular CLI | 19 (`npm install -g @angular/cli`) |

---

## Configuración y ejecución local

### 1. Configurar el Backend

```bash
cd backend
npm install
```

Crea el archivo `.env` en la carpeta `backend/` con las siguientes variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña
JWT_SECRET=una_clave_secreta_segura
JWT_EXPIRES_IN=24h
NODE_ENV=development
ALLOWED_ORIGIN=http://localhost:4200
```

### 2. Crear la base de datos en PostgreSQL

```sql
CREATE DATABASE ecommerce_db;
```

### 3. Inicializar el esquema

```bash
psql -U postgres -d ecommerce_db -f database/schema.sql
```

### 4. Cargar datos de prueba

```bash
npm run seed
```

Inserta 2 usuarios, 5 categorías y 10 productos. Las contraseñas se hashean con bcrypt en tiempo de ejecución.

### 5. Iniciar el servidor

```bash
npm run dev      # Desarrollo (nodemon, recarga automática)
npm start        # Producción
```

Servidor disponible en: `http://localhost:3000`

---

### 6. Configurar e iniciar el Frontend

```bash
cd frontend
npm install
ng serve
```

Aplicación disponible en: `http://localhost:4200`

---

## Credenciales de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Admin | admin@tienda.com | Admin123! |
| Usuario | user@tienda.com | Admin123! |

---

## Endpoints de la API

La documentación interactiva completa está en `TiendaOnline.postman_collection.json`. Impórtala en Postman para probar todos los endpoints con ejemplos de request/response.

### Auth — `/api/auth`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/register` | Público | Registrar nuevo usuario |
| POST | `/login` | Público | Login → devuelve JWT |
| GET | `/me` | Privado | Perfil del usuario autenticado |

**Ejemplo login:**
```json
// POST /api/auth/login
{ "email": "admin@tienda.com", "password": "Admin123!" }

// Respuesta
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...", "user": { "id": 1, "role": "admin" } }
```

**Rutas protegidas:** incluir header `Authorization: Bearer <token>`

---

### Productos — `/api/products`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/` | Público | Lista paginada con filtros |
| GET | `/:id` | Público | Detalle de un producto |
| POST | `/` | Admin | Crear producto |
| PUT | `/:id` | Admin | Actualizar producto |
| DELETE | `/:id` | Admin | Eliminar producto |

**Query params disponibles en GET `/`:**
- `page` — página actual (default: 1)
- `limit` — elementos por página (default: 12)
- `category_id` — filtrar por categoría
- `search` — búsqueda por nombre (ILIKE)

**Body para crear/actualizar producto:**
```json
{
  "name": "Laptop Pro",
  "description": "Descripción del producto",
  "price": 15999.99,
  "stock": 20,
  "image_url": "https://ejemplo.com/imagen.jpg",
  "images": ["https://ejemplo.com/img1.jpg", "https://ejemplo.com/img2.jpg"],
  "category_id": 1,
  "specifications": [
    { "key": "Procesador", "value": "Intel Core i7" },
    { "key": "RAM", "value": "16GB" }
  ]
}
```

---

### Categorías — `/api/categories`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/` | Público | Listar todas las categorías |
| GET | `/:id` | Público | Detalle de categoría |
| POST | `/` | Admin | Crear categoría |
| PUT | `/:id` | Admin | Actualizar categoría |
| DELETE | `/:id` | Admin | Eliminar categoría |

---

### Usuarios — `/api/users`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/` | Admin | Listar todos los usuarios |
| GET | `/:id` | Privado | Ver usuario (propio o admin) |
| PUT | `/:id` | Privado | Actualizar (propio o admin) |
| DELETE | `/:id` | Admin | Eliminar usuario |

---

### Health Check

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Verifica que el servidor está activo |

---

## Base de datos

El diagrama entidad-relación visual está en `ER-Diagram.html` (ábrelo en el navegador).

### Tablas (Tercera Forma Normal — 3NF)

**`users`**
- Almacena credenciales y rol.
- `role` CHECK constraint: solo `'admin'` o `'user'`.
- Sin dependencias transitivas.

**`categories`**
- Entidad independiente. `name` UNIQUE.

**`products`**
- FK a `categories.id` con `ON DELETE SET NULL`.
- El nombre de categoría se obtiene por JOIN, no se duplica (cumple 3NF).
- `images` — JSONB array de URLs para el carrusel.
- `specifications` — JSONB array de `{key, value}` para especificaciones técnicas o composición.
- `updated_at` — se actualiza automáticamente vía trigger PostgreSQL.

### Relación

```
categories (1) ──────< products (N)
  category_id FK → categories.id   ON DELETE SET NULL
```

---

## Funcionalidades implementadas

### Frontend
- [x] Catálogo de productos con paginación
- [x] Filtro por categoría y búsqueda por nombre
- [x] Detalle de producto con carrusel de imágenes
- [x] Selección de talla (XS / S / M / L / XL) para categoría Ropa
- [x] Sección de especificaciones técnicas (Electrónica, Hogar) y composición (Ropa)
- [x] Carrito de compras lateral con persistencia en localStorage
- [x] Registro de usuario
- [x] Login con JWT (roles admin y user)
- [x] Panel de administración protegido (solo admin)
- [x] CRUD de productos con gestión de imágenes y especificaciones
- [x] CRUD de categorías
- [x] Dashboard con métricas (total de productos y categorías)
- [x] Diseño responsive (mobile-first)
- [x] Metodología BEM en CSS
- [x] Lazy loading de rutas (Angular)
- [x] Guards de autenticación y autorización por rol

### Backend
- [x] CRUD completo (products, categories, users)
- [x] Autenticación con JWT (24h de expiración)
- [x] Dos roles: admin y user
- [x] Middleware de autenticación JWT
- [x] Middleware de autorización por rol
- [x] Validación de datos con Joi en todos los endpoints de escritura
- [x] Manejo centralizado de errores
- [x] Paginación y filtros en productos
- [x] JSONB para especificaciones e imágenes (flexible, sin tablas extra)
- [x] Trigger automático para `updated_at`
- [x] Seed idempotente con `ON CONFLICT`

---

## Notas de seguridad

- Contraseñas hasheadas con **bcryptjs** (10 salt rounds).
- JWT firmado con clave secreta via variable de entorno.
- Validación de entrada con Joi; campos desconocidos se descartan automáticamente.
- Errores internos de BD normalizados (no se exponen al cliente).
- CORS restringido al dominio configurado en `ALLOWED_ORIGIN` (soporta múltiples orígenes separados por coma).