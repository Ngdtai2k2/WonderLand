const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const categoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    media: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      required: true,
    },
    follow: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        isNotification: {
          type: Boolean,
          default: false,
        },
      },
    ],
    like: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

categoriesSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Categories", categoriesSchema);
