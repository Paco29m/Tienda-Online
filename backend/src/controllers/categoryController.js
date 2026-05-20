const db = require('../config/db');

/** Devuelve todas las categorías ordenadas alfabéticamente. */
const getAll = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM categories ORDER BY name ASC'
    );
    res.json({ data: result.rows });
  } catch (err) {
    next(err);
  }
};

/** Devuelve una categoría por ID; 404 si no existe. */
const getOne = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM categories WHERE id = $1',
      [req.params.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

/** Crea una categoría; el nombre tiene restricción UNIQUE en la BD (lanza 409 vía errorHandler). */
const create = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const result = await db.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json({ data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

/** Actualización parcial de categoría; respeta los valores actuales si el campo no se envía. */
const update = async (req, res, next) => {
  try {
    const existing = await db.query('SELECT * FROM categories WHERE id = $1', [req.params.id]);
    if (!existing.rows[0]) {
      return res.status(404).json({ error: 'Category not found' });
    }
    const current = existing.rows[0];
    const { name, description } = req.body;

    const result = await db.query(
      'UPDATE categories SET name=$1, description=$2 WHERE id=$3 RETURNING *',
      [name ?? current.name, description ?? current.description, req.params.id]
    );
    res.json({ data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

/** Elimina una categoría; los productos asociados quedan con category_id = NULL (ON DELETE SET NULL). */
const remove = async (req, res, next) => {
  try {
    const result = await db.query(
      'DELETE FROM categories WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted', id: result.rows[0].id });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, update, remove };
