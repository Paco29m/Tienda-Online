/**
 * Manejador de errores centralizado de Express.
 * Traduce códigos de error de PostgreSQL a respuestas HTTP semánticas
 * y evita exponer el stack trace al cliente.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.code === '23505') {
    return res.status(409).json({ error: 'Resource already exists' });
  }

  if (err.code === '23503') {
    return res.status(400).json({ error: 'Referenced resource does not exist' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
