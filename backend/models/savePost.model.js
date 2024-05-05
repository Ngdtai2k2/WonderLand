const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const savePostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

savePostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("SavePost", savePostSchema);
