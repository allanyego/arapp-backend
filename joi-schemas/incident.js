const Joi = require("joi");

const newSchema = Joi.object({
  location: Joi.object({
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
  }),
  contact: Joi.object({
    displayName: Joi.string().required(),
    phone: Joi.string().required().pattern(/^\+/),
  }),
  user: Joi.string().required(),
});

module.exports = {
  newSchema,
};
