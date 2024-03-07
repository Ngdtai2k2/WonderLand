const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
dotenv.config();

mongoose
  .connect(process.env.MONGOOSE_DB)
  .then(() => {
    console.log(">>> Connected to MongoDB successfully!");
  })
  .catch((error) => {
    console.error(">>> Error connecting to MongoDB:", error);
  });

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.listen(8000, () => {
  console.log(">>> Server running on port 8000!");
});
