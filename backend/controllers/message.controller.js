const messageModel = require("../models/message.model");
const chatModel = require("../models/chat.model");
const userSocketModel = require("../models/userSocket.model");

const messageController = {
  addMessage: async (req, res) => {
    try {
      let { chatId, senderId, message } = req.body;

      message.trim();
      
      if (!chatId ||!senderId ||!message) {
        return res.status(400).json({ message: "Invalid data!" });
      }

      const chat = await chatModel.findById(chatId);

      if (!chat) {
        return res.status(404).json({ message: "Chat not found!" });
      }

      const newMessage = new messageModel({
        chatId: chatId,
        senderId: senderId,
        message: message,
      });

      const result = await newMessage.save();

      let userSockets = [];

      await Promise.all(
        chat.members.map(async (member) => {
          if (member.toString() !== senderId) {
            const sockets = await userSocketModel.find({
              user: member,
            });
            userSockets.push(...sockets);
          }
        })
      );

      if (userSockets.length > 0) {
        userSockets.forEach(async (socket) => {
          global._io.to(socket.socketId).emit("new-message", result);
        });
      }

      return res.status(200).json(result);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  getMessages: async (req, res) => {
    try {
      const { chatId } = req.params;
      const result = await messageModel.find({ chatId });
      if (!result) {
        return res.status(404).json({ message: "Messages not found!" });
      }
      return res.status(200).json(result);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },
};

module.exports = messageController;