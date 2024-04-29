const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const reactionSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
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
  },
  {
    timestamps: true,
  }
);

reactionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Reaction", reactionSchema);
