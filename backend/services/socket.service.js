const UserSocket = require("../models/userSocket.model");

const socketService = {
  connection: async (socket) => {
    console.log("⚡ User connected:", socket.id);
    if (socket.handshake.query.userId !== "undefined") {
      await UserSocket.deleteMany({ user: socket.handshake.query.userId });
      const userSocket = new UserSocket({
        user: socket.handshake.query.userId,
        socketId: socket.id,
      });
      await userSocket.save();

      // event on - disconnect
      socket.on("disconnect", async () => {
        console.log("⚡ User disconnected:", socket.id);
        await UserSocket.findOneAndDelete({ socketId: socket.id });
      });
    }
  },
  getSocket: async (user) => {
    const userSockets = await UserSocket.find({ user: user });
    if (userSockets) {
      return userSockets;
    } else {
      return null;
    }
  }
};

module.exports = socketService;
