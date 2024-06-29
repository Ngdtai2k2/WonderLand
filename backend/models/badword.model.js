const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const BadWordSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

BadWordSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("BadWord", BadWordSchema);
