const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    // 0 - donate , 1 - withdrawal
    type: {
      type: Number,
      required: true,
    },
    // 1 - successfully, 2 - failed, cancel , 3 - pending
    status: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
    },
    url: {
      type: String,
    },
    informationWithdraw: {
      type: String,
      maxLength: 1000,
    }
  },
  {
    timestamps: true,
  }
);

transactionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Transaction", transactionSchema);
