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

module.exports = {
  add,
  findById,
  getUserIncidents,
};
