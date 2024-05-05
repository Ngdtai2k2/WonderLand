const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxLength: 280,
    },
    content: {
      type: String,
      maxLength: 1500,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      required: true,
    },
    media: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    },
    type: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

postSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Post", postSchema);
