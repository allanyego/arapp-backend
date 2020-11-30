const fs = require("fs");
const path = require("path");

const Incident = require("../models/incident");
const VideoShare = require("../models/video-share");

async function sendVideo(req, res, next) {
  const MAX_CHUNK_SIZE = 1024 * 1024;
  const { filename } = req.params;
  const { userId } = res.locals;
  const filePath = path.join(__dirname, "..", "uploads", "videos", filename);

  // Check if this is the user's incident or is a cop
  // requesting
  try {
    const incident = await Incident.findOne({
      videoEvidence: filename,
    });

    if (!incident) {
      return res.sendStatus(404);
    }

    const share = await VideoShare.findOne({
      incident: incident._id,
    });
    const isAuthorized =
      String(incident.user) === userId ||
      (share && String(share.shareTo) === userId);

    if (!isAuthorized) {
      return res.sendStatus(403);
    }
  } catch (error) {
    return next(error);
  }

  try {
    const stats = await new Promise((resolve, reject) => {
      fs.stat(filePath, (err, fileStats) => {
        if (err) {
          reject(err);
        }

        resolve(fileStats);
      });
    });

    const range = req.headers.range;
    if (!range) {
      // Wrong range
      return res.sendStatus(416);
    }

    const positions = range.replace(/bytes=/, "").split("-");
    const start = parseInt(positions[0], 10);
    const total = stats.size;
    let end = positions[1] ? parseInt(positions[1], 10) : total - 1;
    let chunksize = end - start + 1;
    // Don't send more than specified size
    if (chunksize > MAX_CHUNK_SIZE) {
      end = start + MAX_CHUNK_SIZE - 1;
      chunksize = end - start + 1;
    }

    res.status(206).set({
      "Content-Range": "bytes " + start + "-" + end + "/" + total,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/webm",
    });

    const stream = fs
      .createReadStream(filePath, { start, end })
      .on("open", () => {
        stream.pipe(res);
      })
      .on("error", (err) => {
        res.end(err);
      });
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.sendStatus(404);
    }

    res.end(error);
  }
}

module.exports = sendVideo;
