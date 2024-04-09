const mongoose = require("mongoose");
const crypto = require("crypto");
const TokenSchema = mongoose.Schema(
  {
    token: String,
  },
  { timestamps: true }
);
// This is for black listed tokens
const Token = mongoose.model("Token", TokenSchema);
module.exports = Token;
