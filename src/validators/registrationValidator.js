const Joi = require('joi');

const singleSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().pattern(/^\d{6}$/).required().messages({
    'string.pattern.base': 'Код должен состоять ровно из 6 цифр',
  }),
});

const arraySchema = Joi.array().items(singleSchema).min(1);

module.exports = { singleSchema, arraySchema };