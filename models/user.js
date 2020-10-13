const mongoose = require("mongoose");

const constants = require("../util/constants");

const { USER, COUNSELLOR } = constants.USER.ACCOUNT_TYPES;

const userSchema = new mongoose.Schema(
  {
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
      enum: ["female", "male"],
    },
    birthday: {
      type: Date,
    },
    bio: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: [COUNSELLOR, USER, null],
      default: null,
    },
    experience: Number,
    speciality: {
      type: [String],
      default: [],
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
    reviews: {
      type: [
        new mongoose.Schema({
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          comment: {
            type: String,
            required: true,
          },
          rating: {
            type: Number,
            required: true,
          },
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
