const mongoose = require("mongoose");
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODBCN, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectDb;
