const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // type notification: 0 - post, 2 - comment
    type: {
      type: Number,
      required: true,
    },
    // 0 - pending, 1 - sent
    status: {
      type: Boolean,
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    replyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment.replies",
    },
    message: {
      type: String,
      maxLength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Notification", notificationSchema);
