const Joi = require("joi");

const newSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  symptoms: Joi.string().required(),
  remedies: Joi.string().required(),
});

module.exports = {
  newSchema,
};
