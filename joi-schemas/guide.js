const Joi = require("joi");

const newSchema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
  tags: Joi.array().items(Joi.string()),
});

module.exports = {
  newSchema,
};
