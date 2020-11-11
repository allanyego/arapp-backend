const Incident = require("../models/incident");

async function add(data) {
  return await Incident.create(data);
}

async function findById(id) {
  return await Incident.findById(id);
}

async function getUserIncidents(user) {
  return await Incident.find({
    user,
  });
}

async function updateIncident(_id, data) {
  return await Incident.updateOne({ _id }, data);
}

module.exports = {
  add,
  findById,
  getUserIncidents,
  updateIncident,
};
