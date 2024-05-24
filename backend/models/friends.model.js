const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const friendsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    friend: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // 0 - pending, 1 - accepted, 2 - blocked
    status: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

friendsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Friends", friendsSchema);
