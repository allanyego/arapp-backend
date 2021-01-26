const fs = require("fs");
const path = require("path");

const Incident = require("../models/incident");

async function create(data) {
  return await Incident.create(data);
}

async function deleteVideoFile(incident) {
  await new Promise((resolve, reject) => {
    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "videos",
      incident.videoEvidence
    );
    fs.unlink(filePath, (err) => {
      if (err) {
        reject(error);
      }

      resolve();
    });
  });

  return await Incident.updateOne(
    {
      _id: incident._id,
    },
    {
      videoEvidence: null,
    }
  );
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
  create,
  deleteVideoFile,
  findById,
  getUserIncidents,
  updateIncident,
};
