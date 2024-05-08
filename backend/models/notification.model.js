const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // type notification: 0 - post, 1 - comment, 2- reply
    type: {
      type: Number,
      required: true,
    },
    read: {
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
    link: {
      type: String,
      maxLength: 1000,
    },
    image: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

notificationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Notification", notificationSchema);
