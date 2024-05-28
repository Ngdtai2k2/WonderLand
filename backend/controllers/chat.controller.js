const chatModel = require("../models/chat.model");

const chatController = {
  create: async (req, res) => {
    try {
      const { senderId, receiverId } = req.body;

      const existingChat = await chatModel.findOne({
        members: {
          $all: [senderId, receiverId],
        },
      });

      if (!existingChat) {
        const newChat = new chatModel({
          members: [senderId, receiverId],
        });

        const result = await newChat.save();
        return res.status(200).json(result);
      }
      return res.status(200).json(existingChat);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },

  userChats: async (req, res) => {
    try {
      const chat = await chatModel.find({
        members: {
          $in: [req.params.userId],
        },
      });
      
      if (!chat) {
        return res.status(404).json({ message: "Chat not found!" });
      }

      return res.status(200).json(chat);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
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
        return res.status(404).json({ message: "Chat not found!" });
      }

      return res.status(200).json(chat);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred please try again later!" });
    }
  },
};

module.exports = chatController;
