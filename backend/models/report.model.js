const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    replyComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment.replies",
    },
    rule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rule",
    },
    reason: {
      type: String,
      maxLength: 1000,
    },
    status: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Report", reportSchema);
