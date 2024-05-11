const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { format } = require("date-fns");

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      maxLength: 1000,
    },
    media: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    replies: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        commentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment",
          required: true,
        },
        content: {
          type: String,
          maxLength: 1000,
        },
        media: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Media",
        },
        isHidden: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssxxx"),
        },
        updatedAt: {
          type: Date,
          default: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssxxx"),
        },
      },
    ],
  },
  { timestamps: true }
);

commentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Comment", commentSchema);
