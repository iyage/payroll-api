const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const payslipModel = new Schema({
  gross: {
    type: Number,
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  deductions: [{ deduction: String, percentage: Number, value: Number }],
  net: Number,
  date: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Payslip", payslipModel);
