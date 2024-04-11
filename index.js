const express = require("express"),
  app = express();
  proxy = require("express-http-proxy");
require("dotenv").config();
const { connectToDatabase, mongoose } = require("./connectToDatabase");

const port = process.env.PORT;
const uri = process.env.URI;

app.use("/orders", proxy("http://localhost:3003"));
app.use("/products", proxy("http://localhost:3002"));
app.use("/users", proxy("http://localhost:3001"));
app.get("/", (req, res) => res.send("App listening"));

connectToDatabase(uri).then(() => {
  app.listen(port, () => {
    console.log(`App is running on port ${port}`);
  });
});
