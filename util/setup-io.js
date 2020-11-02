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
    onlineUsers[socket.id] = socket.customId;

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

      // When a user leaves the room for whatever reason
      socket.on("left-room", ({ room, peer }) => {
        socket.leave(room, () => {
          io.to(room).emit("left-room", {
            userId: socket.customId,
            peer: peer || false,
          });
        });
      });
    });

    // Socket disconnected
    socket.on("disconnect", () => {
      socket.broadcast.emit("disconnected", {
        userId: socket.customId,
      });
    });
  });
}

module.exports = setupIO;
