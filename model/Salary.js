const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const salarySchema = new Schema({
  salary: {
    type: Number,
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: "User",
    unique: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("salary", salarySchema);
