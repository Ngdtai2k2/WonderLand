const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      max_length: 50,
    },
    nickname: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      max_length: 20,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    fullname: {
      type: String,
      required: true,
    },
    gender: {
      type: Number,
    },
    birthday: {
      type: Date,
    },
    about: {
      type: String,
      default: "Hello world!",
    },
    hometown: {
      type: String,
    },
    phone: {
      type: String,
      max_length: 20,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    media: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    },
    coverArt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    },
    amount: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("User", userSchema);
