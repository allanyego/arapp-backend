const Joi = require("joi");

const adminEditSchema = Joi.object({
  active: Joi.boolean(),
});

module.exports = {
  adminEditSchema,
};
