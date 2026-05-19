const db = require('../config/db');
const bcrypt = require('bcryptjs');

const getAll = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ data: result.rows });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [req.params.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const existing = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (!existing.rows[0]) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Non-admins can only edit their own profile
    if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id, 10)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const current = existing.rows[0];
    const { name, email, password, role } = req.body;

    let password_hash = current.password_hash;
    if (password) {
      password_hash = await bcrypt.hash(password, 10);
    }

    // Only admin can change roles
    const newRole = req.user.role === 'admin' ? (role ?? current.role) : current.role;

    const result = await db.query(
      `UPDATE users SET name=$1, email=$2, password_hash=$3, role=$4
       WHERE id=$5
       RETURNING id, name, email, role, created_at`,
      [name ?? current.name, email ?? current.email, password_hash, newRole, req.params.id]
    );
    res.json({ data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await db.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted', id: result.rows[0].id });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, update, remove };
