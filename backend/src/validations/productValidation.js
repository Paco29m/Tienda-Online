const Joi = require('joi');

const specSchema = Joi.object({
  key:   Joi.string().max(100).required(),
  value: Joi.string().max(255).required(),
});

const productSchema = Joi.object({
  name:           Joi.string().min(2).max(200).required(),
  description:    Joi.string().allow('', null),
  price:          Joi.number().min(0).precision(2).required(),
  stock:          Joi.number().integer().min(0).default(0),
  image_url:      Joi.string().uri().allow('', null),
  images:         Joi.array().items(Joi.string().uri()).default([]),
  category_id:    Joi.number().integer().allow(null),
  specifications: Joi.array().items(specSchema).default([]),
});

const productUpdateSchema = productSchema.fork(
  ['name', 'price'],
  (field) => field.optional()
);

module.exports = { productSchema, productUpdateSchema };
