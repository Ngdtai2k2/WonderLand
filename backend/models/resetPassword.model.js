const mongoose = require("mongoose");

const resetPasswordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      max_length: 6,
    },
    exp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResetPassword", resetPasswordSchema);
