const Appointment = require("../models/appointment");

async function create(data) {
  return await Appointment.create(data);
}

const fields = "_id fullName";

async function findById(id) {
  return await Appointment.findById(id)
    .populate("user", fields)
    .populate("serviceProvider", fields);
}

async function findByUser(userId) {
  return await Appointment.find({
    $or: [{ user: userId }, { serviceProvider: userId }],
  })
    .populate("user", fields)
    .populate("serviceProvider", fields);
}

module.exports = {
  create,
  findById,
  findByUser,
};
