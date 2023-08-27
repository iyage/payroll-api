const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const deductionSchema = new Schema({
  deduction: {
    type: String,
  },
  percentage: Number,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
module.exports = mongoose.model("deduction", deductionSchema);
