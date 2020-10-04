const Joi = require("joi");

const newSchema = Joi.object({
  sender: Joi.string().required(),
  recipient: Joi.string().required(),
  body: Joi.string().required(),
  thread: Joi.string(),
});

module.exports = {
  newSchema,
};
