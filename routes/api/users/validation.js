const Joi = require('joi');
const { HttpCode } = require('../../../helpers/constants');

// Signup
const schemaUserSignup = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua'] },
    })
    .required(),
  password: Joi.string().required(),
});

// Login
const schemaUserLogin = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua'] },
    })
    .required(),
  password: Joi.string().required(),
});

// Function Validate
const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (err) {
    next({
      status: HttpCode.BAD_REQUEST,
      message: 'Ошибка от Joi или другой библиотеки валидации',
    });
  }
};

module.exports.validateUserSignup = (req, _, next) => {
  return validate(schemaUserSignup, req.body, next);
};

module.exports.validateUserLogin = (req, _, next) => {
  return validate(schemaUserLogin, req.body, next);
};
