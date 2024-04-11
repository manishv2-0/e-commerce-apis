const express = require("express"),
  app = express();
// mongoose = require("mongoose");
require("dotenv").config();
app.use(express.json());
var bodyParser = require('body-parser');
app.use(bodyParser.json());
const port = process.env.PORT;
const uri = process.env.URI;
const { connectToDatabase, mongoose } = require("../connectToDatabase");

connectToDatabase(uri).then(() => {
  app.listen(port, () => {
    console.log(`App is running on port ${port}`);
  });
});

const routes = require("./route");
app.use("/", routes);
