const mongoose = require("mongoose");

const constants = require("../util/constants");

const { USER, COUNSELLOR, HEALTH_FACILITY } = constants.USER.ACCOUNT_TYPES;

const userSchema = new mongoose.Schema(
  {
    accountType: {
      type: String,
      enum: [COUNSELLOR, USER, HEALTH_FACILITY],
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["female", "male", null],
      default: null,
    },
    birthday: {
      type: Date,
      default: null,
    },
    bio: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      default: null,
    },
    experience: {
      type: Number,
      default: null,
    },
    speciality: {
      type: String,
      default: null,
    },
    education: {
      type: [
        new mongoose.Schema({
          institution: String,
          areaOfStudy: String,
          startDate: String,
          endDate: String,
        }),
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
