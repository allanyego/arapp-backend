const mongoose = require("mongoose");

const guideSchema = new mongoose.Schema(
  {
    active: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    links: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Guide", guideSchema);
