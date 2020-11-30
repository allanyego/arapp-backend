const Joi = require("joi");

const newSchema = Joi.object({
  subject: Joi.string().required(),
  date: Joi.date().required(),
  time: Joi.date().required(),
  duration: Joi.number().required(),
});

const editSchema = Joi.object({
  status: Joi.string(),
});

module.exports = {
  newSchema,
  editSchema,
};
