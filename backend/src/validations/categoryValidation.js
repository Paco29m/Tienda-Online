const Joi = require('joi');

/** Esquemas Joi para los endpoints de categorías. categoryUpdateSchema hace opcional name. */
const categorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow('', null),
});

const categoryUpdateSchema = categorySchema.fork(['name'], (field) =>
  field.optional()
);

module.exports = { categorySchema, categoryUpdateSchema };
