const Condition = require("../models/condition");

async function add(data) {
  if (await Condition.findOne({ name: data.name })) {
    throw new Error("Possible duplicate.");
  }
  return await Condition.create(data);
}

async function get() {
  return await Condition.find();
}

module.exports = {
  add,
  get,
};
