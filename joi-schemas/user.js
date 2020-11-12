const Joi = require("joi");
const { REGEX } = require("../util/constants");

const newSchema = Joi.object({
  fullName: Joi.string().required().trim(),
  email: Joi.string().email().required().trim(),
  username: Joi.string().required().trim(),
  gender: Joi.string().allow(""),
  birthday: Joi.date().allow(""),
  password: Joi.string(),
  phone: Joi.string().required().pattern(REGEX.PHONE).trim(),
  accountType: Joi.string().required(),
});

const editSchema = Joi.object({
  fullName: Joi.string().trim(),
  email: Joi.string().trim(),
  bio: Joi.string(),
  password: Joi.string(),
  newPassword: Joi.string(),
  experience: Joi.number().min(1),
  phone: Joi.string().pattern(REGEX.PHONE).trim(),
  education: Joi.array().items(
    Joi.object({
      institution: Joi.string(),
      areaOfStudy: Joi.string(),
      startDate: Joi.string(),
      endDate: Joi.string(),
    })
  ),
  speciality: Joi.string().trim(),
  conditions: Joi.array().items(Joi.string()),
});

module.exports = {
  newSchema,
  editSchema,
};
