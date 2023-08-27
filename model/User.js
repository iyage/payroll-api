const mongoose = require("mongoose");
const { format } = require("date-fns");
const { roles } = require("../utils/roles");
const Schema = mongoose.Schema;
const userModel = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  jobTile: {
    type: String,
    default: null,
  },
  position: {
    type: String,
    default: null,
  },
  reportTo: {
    type: String,
    default: null,
  },
  startDate: {
    type: Date,
    default: null,
  },
  endDate: {
    type: Date,
    default: null,
  },
  reasonForLeaving: {
    type: String,
    default: null,
  },
  bonuses: [
    {
      bonus: String,
      amount: Number,
      dateReceived: { type: Date, default: new Date() },
    },
  ],
  promotions: [
    { promotion: String, newPosition: String, oldPosition: String, date: Date },
  ],
  roles: {
    type: [String],
    default: [roles.user],
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("User", userModel);
