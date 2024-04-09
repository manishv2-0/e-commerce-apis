const express = require("express");
const router = express.Router();
const { signup,signin,logout,validateSignup, profile,authMiddleware,updateProfile} = require("./controllers/User");
router.post("/signup", validateSignup, signup);
router.post('/signin',signin);
router.get('/logout',authMiddleware,logout);
/* 
    To be done.....
*/
router.get("/profile",authMiddleware, profile);
router.put("/profile",authMiddleware,updateProfile)
router.use((req, res) => res.status(404).json({ error: "Url not found" }));
module.exports = router;
