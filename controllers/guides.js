const Guide = require("../models/guide");
const CustomError = require("../util/custom-error");

async function add(data) {
  if (await Guide.findOne({ title: data.name })) {
    throw new CustomError("possible duplicate");
  }

  return await Guide.create(data);
}

async function get() {
  return await Guide.find();
}

async function findById(_id) {
  return await Guide.findById(_id);
}

module.exports = {
  add,
  get,
  findById,
};
