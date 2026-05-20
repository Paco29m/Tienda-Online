const db = require('../config/db');

/** Lista paginada de productos con JOIN a categorías; admite filtros por category_id y búsqueda ILIKE. */
const getAll = async (req, res, next) => {
  try {
    const { category_id, search, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];

    if (category_id) {
      params.push(category_id);
      conditions.push(`p.category_id = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`p.name ILIKE $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await db.query(
      `SELECT COUNT(*) FROM products p ${where}`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    params.push(limit, offset);
    const result = await db.query(
      `SELECT p.*, c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ${where}
       ORDER BY p.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({
      data: result.rows,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

/** Devuelve un producto por ID con el nombre de su categoría. */
const getOne = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT p.*, c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [req.params.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

/** Crea un producto; images y specifications se almacenan como JSONB. */
const create = async (req, res, next) => {
  try {
    const { name, description, price, stock, image_url, images, category_id, specifications } = req.body;
    const result = await db.query(
      `INSERT INTO products (name, description, price, stock, image_url, images, category_id, specifications)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, description, price, stock || 0, image_url, JSON.stringify(images || []), category_id, JSON.stringify(specifications || [])]
    );
    res.status(201).json({ data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

/** Actualización parcial: solo sobreescribe los campos presentes en el body. */
const update = async (req, res, next) => {
  try {
    const existing = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (!existing.rows[0]) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const current = existing.rows[0];
    const { name, description, price, stock, image_url, images, category_id, specifications } = req.body;

    const result = await db.query(
      `UPDATE products
       SET name=$1, description=$2, price=$3, stock=$4, image_url=$5, images=$6, category_id=$7, specifications=$8
       WHERE id=$9
       RETURNING *`,
      [
        name            ?? current.name,
        description     ?? current.description,
        price           ?? current.price,
        stock           ?? current.stock,
        image_url       ?? current.image_url,
        images !== undefined ? JSON.stringify(images) : current.images,
        category_id     ?? current.category_id,
        specifications !== undefined ? JSON.stringify(specifications) : current.specifications,
        req.params.id,
      ]
    );
    res.json({ data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

/** Elimina un producto; devuelve 404 si no existe. */
const remove = async (req, res, next) => {
  try {
    const result = await db.query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted', id: result.rows[0].id });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, update, remove };
