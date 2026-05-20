/**
 * Fábrica de middleware de validación con Joi.
 * Valida req.body contra el esquema dado; elimina campos desconocidos y
 * devuelve 400 con todos los errores si la validación falla.
 * @param {import('joi').Schema} schema
 */
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true, stripUnknown: true });
  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({ error: 'Validation failed', details: messages });
  }
  next();
};

module.exports = validate;
