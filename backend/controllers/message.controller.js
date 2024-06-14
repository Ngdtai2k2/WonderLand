const userModel = require("../models/user.model");
const chatModel = require("../models/chat.model");
const messageModel = require("../models/message.model");
const userSocketModel = require("../models/userSocket.model");

const messageController = {
  addMessage: async (req, res) => {
    try {
      let { chatId, senderId, message } = req.body;

      message.trim();

      if (!chatId || !senderId || !message) {
        return res.status(400).json({ message: req.t("message.invalid_data") });
      }

      const chat = await chatModel.findById(chatId);

      if (!chat) {
        return res.status(404).json({ message: req.t("not_found.chat") });
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
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  getMessages: async (req, res) => {
    try {
      const { chatId } = req.params;
      const { request_user } = req.query;

      const result = await messageModel.find({
        chatId,
        deletedBy: {
          $ne: request_user,
        },
      });
      if (!result) {
        return res.status(404).json({ message: req.t("not_found.messages") });
      }
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  countUnread: async (req, res) => {
    try {
      const { request_user } = req.query;

      const user = await userModel.findById(request_user);
      if (!user)
        return res.status(404).json({ message: req.t("not_found.user") });

      const chats = await chatModel.find({ members: request_user });

      const chatIds = chats.map((chat) => chat._id);

      const unreadChats = await messageModel.aggregate([
        {
          $match: {
            chatId: { $in: chatIds },
            isRead: false,
            isRemoved: false,
            senderId: { $ne: user._id },
            deletedBy: { $ne: user._id },
          },
        },
        {
          $group: {
            _id: "$chatId",
          },
        },
      ]);

      const unreadChatsCount = unreadChats.length;

      return res.status(200).json({ result: unreadChatsCount });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },
  // mark read or unread
  markMessagesByChat: async (req, res) => {
    try {
      // type = false => mark read
      const { chatId, type } = req.body;
      const { request_user } = req.query;

      const chat = await chatModel.findById(chatId);
      if (!chat) {
        return res.status(404).json({ message: req.t("not_found.chat") });
      }

      const messages = await messageModel.updateMany(
        {
          chatId: chatId,
          senderId: { $ne: request_user },
          isRead: !type,
          isRemoved: false,
        },
        {
          $set: { isRead: type },
        }
      );

      // push socket mark read
      const userSockets = await userSocketModel.find({ user: request_user });
      if (userSockets.length > 0) {
        userSockets.forEach(async (socket) => {
          global._io
            .to(socket.socketId)
            .emit("action-mark-messages", messages, chat._id);
        });
      }

      return res.status(200).json({ mark: true, messages });
    } catch (error) {
      return res
        .status(500)
        .json({ message: req.t("server_error"), mark: false });
    }
  },
};

module.exports = messageController;
