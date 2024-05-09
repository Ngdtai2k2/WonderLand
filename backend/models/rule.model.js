const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ruleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minLength: 1,
      maxLength: 100,
    },
    description: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 3000,
    },
  },
  {
    timestamps: true,
  }
);

ruleSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Rule", ruleSchema);
