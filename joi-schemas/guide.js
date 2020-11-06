const Joi = require("joi");

const newSchema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
  tags: Joi.array().items(Joi.string()),
  links: Joi.array().items(Joi.string()),
});

const voteSchema = Joi.object({
  isUpvote: Joi.boolean(),
});

module.exports = {
  newSchema,
  voteSchema,
};
