const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../users-app/controllers/User");
router.get("/", authMiddleware, (req, res) => {
  res.send("hiiiii");
});

module.exports = router;
