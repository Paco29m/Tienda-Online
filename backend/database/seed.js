const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function seed() {
  const client = process.env.DATABASE_URL
    ? new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
    : new Client({
        host:     process.env.DB_HOST,
        port:     process.env.DB_PORT,
        database: process.env.DB_NAME,
        user:     process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      });

  try {
    await client.connect();
    console.log('Conectado a PostgreSQL');

    const hash = await bcrypt.hash('Admin123!', 10);

    // Users
    await client.query(`
      INSERT INTO users (name, email, password_hash, role) VALUES
        ('Administrador', 'admin@tienda.com', $1, 'admin'),
        ('Usuario Demo',  'user@tienda.com',  $1, 'user')
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;
    `, [hash]);
    console.log('Usuarios insertados');

    // Categories
    await client.query(`
      INSERT INTO categories (name, description) VALUES
        ('Electrónica', 'Dispositivos electrónicos y gadgets'),
        ('Ropa',        'Moda para hombre, mujer y niños'),
        ('Hogar',       'Artículos para el hogar y decoración'),
        ('Deportes',    'Equipos y accesorios deportivos'),
        ('Libros',      'Libros, revistas y material educativo')
      ON CONFLICT (name) DO NOTHING;
    `);
    console.log('Categorías insertadas');

    // Products (category ids 1–5 match the order above)
    await client.query(`
      INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
        ('Laptop Pro 15',    'Laptop de alto rendimiento con procesador i7',       18999.00, 15,  'https://picsum.photos/seed/laptop/400/300',   1),
        ('Smartphone X12',   'Teléfono inteligente con cámara de 108MP',            9499.00, 30,  'https://picsum.photos/seed/phone/400/300',    1),
        ('Auriculares BT',   'Auriculares inalámbricos con cancelación de ruido',   1299.00, 50,  'https://picsum.photos/seed/audio/400/300',    1),
        ('Playera Básica',   'Playera de algodón 100% en varios colores',            299.00, 100, 'https://picsum.photos/seed/shirt/400/300',    2),
        ('Jeans Slim Fit',   'Pantalón de mezclilla corte slim',                     599.00, 80,  'https://picsum.photos/seed/jeans/400/300',    2),
        ('Silla Ergonómica', 'Silla de oficina con soporte lumbar ajustable',       3499.00, 20,  'https://picsum.photos/seed/chair/400/300',    3),
        ('Lámpara LED',      'Lámpara de escritorio con control de intensidad',      549.00, 45,  'https://picsum.photos/seed/lamp/400/300',     3),
        ('Pelota Fútbol',    'Balón oficial talla 5',                                449.00, 60,  'https://picsum.photos/seed/ball/400/300',     4),
        ('Mancuernas 10kg',  'Par de mancuernas de hierro fundido',                  799.00, 35,  'https://picsum.photos/seed/weights/400/300',  4),
        ('Clean Code',       'Libro sobre buenas prácticas de programación',         650.00, 25,  'https://picsum.photos/seed/book/400/300',     5)
      ON CONFLICT DO NOTHING;
    `);
    console.log('Productos insertados');

    console.log('\nSeed completado exitosamente.');
    console.log('  admin@tienda.com / Admin123!  (rol: admin)');
    console.log('  user@tienda.com  / Admin123!  (rol: user)');
  } catch (err) {
    console.error('Error en seed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
