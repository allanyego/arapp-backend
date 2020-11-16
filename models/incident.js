const mongoose = require("mongoose");

const { INCIDENT_TYPES } = require("../util/constants");

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
      default: null,
    },
    type: {
      type: String,
      enum: [INCIDENT_TYPES.SMS, INCIDENT_TYPES.VIDEO],
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
      default: null,
    },
    sendSuccess: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Incident", incidentSchema);
