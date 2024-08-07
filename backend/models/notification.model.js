const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // type notification: 0 - post, 1 - comment, 2- reply, 3 - report, 4 - friends, 5 - birthdays, 6 - transactions
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
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    messages: {
      type: Object,
      maxLength: 1000,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Notification", notificationSchema);
