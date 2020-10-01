const mongoose = require("mongoose");

const conditionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  symptoms: {
    type: String,
    required: true,
  },
  remedies: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Condition", conditionSchema);
