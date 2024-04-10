const express = require("express");
const router = express.Router();
const {verifyToken,getProducts} = require("./controllers/Products");
router.get("/",verifyToken,getProducts)
router.use((req, res) => res.status(404).json({ error: "Url not found" }));
module.exports = router;
