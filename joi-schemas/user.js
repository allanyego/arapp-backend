const Joi = require("joi");
const { REGEX } = require("../util/constants");

const newSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  gender: Joi.string().allow(""),
  birthday: Joi.date().allow(""),
  password: Joi.string().required(),
  phone: Joi.string().required().pattern(REGEX.PHONE),
  accountType: Joi.string().required(),
});

const editSchema = Joi.object({
  fullName: Joi.string(),
  email: Joi.string(),
  bio: Joi.string(),
  accountType: Joi.string(),
  experience: Joi.number().min(1),
  phone: Joi.string().pattern(REGEX.PHONE),
  education: Joi.array().items(
    Joi.object({
      institution: Joi.string(),
      areaOfStudy: Joi.string(),
      startDate: Joi.string(),
      endDate: Joi.string(),
    })
  ),
  speciality: Joi.string(),
  conditions: Joi.array().items(Joi.string()),
});

const reviewSchema = Joi.object({
  user: Joi.string().required(),
  comment: Joi.string().required(),
  rating: Joi.string().required(),
});

module.exports = {
  newSchema,
  editSchema,
  reviewSchema,
};
