const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    mediaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
