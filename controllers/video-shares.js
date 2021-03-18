const VideoShare = require("../models/video-share");
const signUrl = require("../routes/helpers/sign-url");

const MAX_VALIDITY_PERIOD = 3600 * 24 * 7;

async function create(data) {
  const token = signUrl(data.shareTo, MAX_VALIDITY_PERIOD);
  return await VideoShare.create({
    ...data,
    token,
  });
}

async function findByUser(shareTo) {
  return await VideoShare.find({
    shareTo,
  })
    .populate("user", "_id fullName")
    .populate("incident");
}

module.exports = {
  create,
  findByUser,
};
