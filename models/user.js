const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
  gender: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  bio: {
    type: String,
  },
  conditions: {
    type: [String],
    default: [],
  },
  contact: {
    phone: String,
    email: String,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
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
});

module.exports = mongoose.model("User", userSchema);
