const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: {
        name: {
          type: String,
          required: true,
        },
        longitude: {
          type: String,
          required: true,
        },
        latitude: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    videoEvidence: {
      type: String,
      default: null,
    },
    contact: {
      type: {
        displayName: String,
        phone: String,
      },
      required: true,
    },
    sendSuccess: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Incident", incidentSchema);
