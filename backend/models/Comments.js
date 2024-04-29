const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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
    parentCommentId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    }
  },
  { timestamps: true }
);

commentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Comment", commentSchema);
