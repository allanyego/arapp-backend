const Joi = require("joi");

const newSchema = Joi.object({
  location: Joi.object({
    longitude: Joi.string().required(),
    latitude: Joi.string().required(),
  }),
  contact: Joi.object({
    displayName: Joi.string().required(),
    phone: Joi.string().required(),
  }),
  user: Joi.string().required(),
});

module.exports = {
  newSchema,
};
