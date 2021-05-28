const Joi = require('joi');
const { HttpCode } = require('../../../helpers/constants');

// POST
const schemaCreateContact = Joi.object({
  name: Joi.string()
    .regex(/[A-Z]\w+/)
    .min(3)
    .max(30)
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua'] },
    })
    .required(),
  phone: Joi.string()
    .regex(/^[0-9]{10,13}$/)
    .required(),
});

// PUT
const schemaUpdateContact = Joi.object({
  name: Joi.string()
    .regex(/[A-Z]\w+/)
    .min(3)
    .max(30)
    .optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua'] },
    })
    .optional(),
  phone: Joi.string()
    .regex(/^[0-9]{10,13}$/)
    .optional(),
}).min(1); // Должно прийти минимум одно поле

// PATCH
const schemaUpdateContactFavorite = Joi.object({
  favorite: Joi.boolean().optional(),
});

// Function Validate
const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (err) {
    next({ status: HttpCode.BAD_REQUEST, message: err.message });
  }
};

module.exports.validateCreateContact = (req, _, next) => {
  return validate(schemaCreateContact, req.body, next);
};

module.exports.validateUpdateContact = (req, _, next) => {
  return validate(schemaUpdateContact, req.body, next);
};

module.exports.validateUpdateContactFavorite = (req, _, next) => {
  return validate(schemaUpdateContactFavorite, req.body, next);
};
