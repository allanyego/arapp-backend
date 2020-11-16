const Joi = require("joi");

const newSchema = Joi.object({
  title: Joi.string().required().trim(),
  body: Joi.string().required(),
  links: Joi.array().items(Joi.string()),
});

const voteSchema = Joi.object({
  isUpvote: Joi.boolean(),
});

module.exports = {
  newSchema,
  voteSchema,
};
