const mongoose = require("mongoose");
const connectDb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://yage_001:RQScWYFl0JADLCBv@cluster0.nuboekh.mongodb.net/payrollDB?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectDb;
