const onlineUsers = [];

/**
 * Setup events and callbacks for the application's socket.io
 * functionality.
 * @param {SocketIOServer} io
 */
function setupIO(io) {
  // Listen for new connections
  io.on("connection", (socket) => {
    console.log("A new client has connected");

    // Subscribe socket to channel
    socket.on("join", (data) => {
      console.log("User subscribing to", data);
      socket.join(data.username);
    });

    // Keep track of online users
    socket.on("userPresence", (data) => {
      console.log("user joined", data);
      onlineUsers[socket.id] = {
        ...data,
      };

      socket.broadcast.emit("onlineUsers", onlineUsers);
    });

    // Pass messages
    socket.on("newMessage", (data) => {
      console.log("message received", data);
      socket.to(data.to).emit("newMessage", data);
    });

    // Socket disconnected
    socket.on("disconnect", () => {
      console.log("client has disconnected");
      socket.broadcast.emit("disconnected", onlineUsers[socket.id]);

      onlineUsers[socket.id] = null;
      socket.broadcast.emit("onlineUsers", onlineUsers);
    });
  });
}

module.exports = setupIO;
