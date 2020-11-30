const mongoose = require("mongoose");
const { APPOINTMENT } = require("../util/constants");
const { UNANSWERED, ACCEPTED, REJECTED, CLOSED } = APPOINTMENT.STATUSES;

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [UNANSWERED, ACCEPTED, REJECTED, CLOSED],
      default: UNANSWERED,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
