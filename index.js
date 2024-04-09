const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  proxy = require("express-http-proxy");
require("dotenv").config();
const port = process.env.PORT;
const uri = process.env.URI;
const connection = mongoose.connect(uri);
const {
  checkIfuserTokenExpired,
  markTokenExpire,
} = require("./isTokenexpiredMiddleware");
app.get("/sigma", checkIfuserTokenExpired, (req, res) => {
  return res.send("dfodof");
});
app.use("/users/logout", checkIfuserTokenExpired, markTokenExpire);
app.use("/users", checkIfuserTokenExpired, proxy("http://localhost:3001"));
app.use("/products", proxy("http://localhost:3002"));
app.get("/", (req, res) => res.send("App listening"));
app.listen(port, () => console.log(`App listening on port ${port}!`));
