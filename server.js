const express = require("express");
const mongoose = require("mongoose");
const connectDb = require("./config/dbConnection");
const router = require("./routes/routes");
const cors = require("cors");
const { corsOptions } = require("./config/corsOptions");
require("dotenv").config();
const app = express();
connectDb();
app.use(cors(corsOptions));
app.use("/", router);
mongoose.connection.once("open", () => {
  console.log("connect to db successfully");
  app.listen(3500, () => {
    console.log(`Server listening on port 3500`);
  });
});
