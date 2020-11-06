const Joi = require("joi");

const newSchema = Joi.object({
  sender: Joi.string().required(),
  recipient: Joi.string(),
  body: Joi.string().required(),
  thread: Joi.string(),
});

const publicThreadSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
});

module.exports = {
  newSchema,
  publicThreadSchema,
};
