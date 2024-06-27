const chatModel = require("../models/chat.model");
const messageModel = require("../models/message.model");
const userModel = require("../models/user.model");
const userSocketModel = require("../models/userSocket.model");

const chatController = {
  create: async (req, res) => {
    try {
      const { senderId, receiverId } = req.body;

      const existingChat = await chatModel.findOne({
        members: {
          $all: [senderId, receiverId],
        },
      });

      if (existingChat) {
        await chatModel.findByIdAndUpdate(existingChat._id, {
          $pull: {
            deletedBy: senderId,
          },
        });
        return res.status(200).json(existingChat);
      }

      const newChat = new chatModel({
        members: [senderId, receiverId],
      });

      const result = await newChat.save();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  userChats: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: req.t("not_found.user") });
      }

      const chat = await chatModel.find({
        members: {
          $in: [userId],
        },
        deletedBy: {
          $ne: userId,
        },
      });

      if (!chat) {
        return res.status(404).json({ message: req.t("not_found.chat") });
      }

      return res.status(200).json(chat);
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  findChat: async (req, res) => {
    try {
      const chat = await chatModel.findOne({
        members: {
          $all: [req.params.firstId, req.params.secondId],
        },
      });

      if (!chat) {
        return res.status(404).json({ message: req.t("not_found.chat") });
      }

      return res.status(200).json(chat);
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },

  deleteChat: async (req, res) => {
    try {
      const { chatId } = req.params;
      const { request_user } = req.query;
      const chat = await chatModel.findById(chatId);

      if (!chat) {
        return res.status(404).json({ message: req.t("not_found.chat") });
      }

      const user = await userModel.findById(request_user);

      if (!user) {
        return res.status(404).json({ message: req.t("not_found.user") });
      }

      await chatModel.findByIdAndUpdate(chatId, {
        $addToSet: { deletedBy: user?._id },
      });

      await messageModel.updateMany(
        { chatId },
        {
          $addToSet: { deletedBy: user?._id },
        }
      );
      const userSockets = await userSocketModel.find({ user: request_user });
      if (userSockets.length > 0) {
        userSockets.forEach(async (socket) => {
          global._io
            .to(socket.socketId)
            .emit(
              "action-delete-chat",
              "Your chat was removed!",
              socket.socketId
            );
        });
      }
      return res.status(200).json({ message: req.t("chat.deleted_success") });
    } catch (error) {
      return res.status(500).json({ message: req.t("server_error") });
    }
  },
};

module.exports = chatController;
