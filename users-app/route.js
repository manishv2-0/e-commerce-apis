const express = require("express");
const router = express.Router();
const { signup,signin,logout,validateSignup, profile,verifyToken,updateProfile} = require("./controllers/User");
router.post("/signup", validateSignup, signup);
router.post('/signin',signin);
router.get('/logout',verifyToken,logout);
router.get("/profile",verifyToken, profile);
router.put("/profile",verifyToken,updateProfile)
router.use((req, res) => res.status(404).json({ error: "Url not found" }));
module.exports = router;
