const UserSocket = require("../models/userSocket.model");

const socketService = {
    connection: async (socket) => {
        console.log("⚡ User connected:", socket.id);
        // Save to DB
        const userSocket = new UserSocket({
            user: socket.handshake.query.userId,
            socketId: socket.id,
        });
        userSocket.save();

        // event on - disconnect
        socket.on("disconnect", async () => {
            console.log("⚡ User disconnected:", socket.id);
            await UserSocket.findOneAndDelete({ socketId: socket.id });
        });
    }
};

module.exports = socketService;

