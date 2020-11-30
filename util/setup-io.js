const fs = require("fs");
const path = require("path");

const incidentController = require("../controllers/incidents");
const { INCIDENT_TYPES } = require("./constants");

/**
 * Setup events and callbacks for the application's socket.io
 * functionality.
 * @param {SocketIOServer} io
 */
function setupIO(io) {
  // Listen for new connections
  io.on("connection", (socket) => {
    // Set custom identifier
    socket.customId = socket.handshake.query.userId;

    // Setup video collection
    let videoUploads = {};

    function deleteKey(key) {
      delete videoUploads[key];
    }

    function saveVideo(incidentId) {
      const fileName = `${incidentId}.webm`;
      const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        "videos",
        fileName
      );
      fs.writeFile(
        filePath,
        Buffer.concat(videoUploads[incidentId]),
        {
          encoding: null,
        },
        async (err) => {
          if (err) {
            console.log("video save error", error);
            deleteKey(incidentId);
          }

          await incidentController.create({
            type: INCIDENT_TYPES.VIDEO,
            videoEvidence: fileName,
            user: socket.customId,
          });
          deleteKey(incidentId);
        }
      );
    }

    // Join a socket to a room
    socket.on("join", (data) => {
      socket
        .join(data.room)
        .to(data.room)
        .emit("user-joined", {
          userId: socket.customId,
          peer: data.peer || false,
        });

      // Pass messages
      socket.on("new-message", (data) => {
        socket.to(data.room).emit("new-message", {
          message: data.message,
        });
      });

      // When a user leaves the room explicitly without
      // internet disconnection
      socket.on("left-room", ({ room, peer }) => {
        socket.leave(room, () => {
          io.to(room).emit("left-room", {
            userId: socket.customId,
            peer: peer || false,
          });
        });
      });
    });

    // Handle alerts
    socket.on("alert", ({ alert }) =>
      socket.broadcast.emit("alert", { alert })
    );
    socket.on("respond", ({ alert }) =>
      socket.broadcast.emit("respond", { alert })
    );

    // Handle videos sent for evidence
    socket.on("video-evidence", ({ incidentId, chunk }) => {
      const _chunk = new Uint8Array(chunk);
      if (videoUploads[incidentId]) {
        videoUploads[incidentId].push(_chunk);
      } else {
        videoUploads[incidentId] = [_chunk];
      }
    });

    // The user ends the stream manually
    socket.on("merge-video", (incidentId) => {
      if (!videoUploads[incidentId]) {
        return;
      }

      saveVideo(incidentId);
    });

    // Socket disconnected
    socket.on("disconnect", () => {
      // Save all video chunks that haven't been saved
      for (let incident in videoUploads) {
        saveVideo(incident);
      }

      socket.broadcast.emit("disconnected", {
        userId: socket.customId,
      });
    });
  });
}

module.exports = setupIO;
