const Joi = require("joi");

const create = Joi.object({
  name: Joi.string().max(255).required(),
  province: Joi.string().max(100).required(),
  ward: Joi.string().max(100).required(),
  address: Joi.string().required(),
  rawCoordinate: Joi.string().trim().min(1).required(),
  status: Joi.string().valid("active", "maintenance", "inactive").required(),
  description: Joi.string().allow(""),
  images: Joi.array().items(Joi.string()).default([]),
});

const update = Joi.object({
  name: Joi.string().max(255),
  province: Joi.string().max(100),
  ward: Joi.string().max(100),
  address: Joi.string(),
  rawCoordinate: Joi.string().trim().min(1),
  status: Joi.string().valid("active", "maintenance", "inactive"),
  description: Joi.string().allow(""),
  images: Joi.array().items(Joi.string()),
}).min(1);

module.exports = { create, update };