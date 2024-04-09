const express = require("express"),
  app = express(),
  mongoose = require("mongoose");
require("dotenv").config();
app.use(express.json());
const port = process.env.PORT;
const uri = process.env.URI;
try {
  const connection = mongoose.connect(uri);
  app.listen(port, () => {
    console.log(`App is running on port ${port}`);
  });
} catch (err) {
  console.error("Error connecting to MongoDB:", err);
}

const routes = require("./route");
app.use("/", routes);
