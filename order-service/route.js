const express = require("express");
const router = express.Router();
const {
  verifyToken,
  isAdmin,
  createOrder,
  validateOrderRequest,
  isCustomer,
  updateOrder,
  viewOrders
} = require("./controllers/Orders");

router.get("/",verifyToken,viewOrders);
router.get("/:status",verifyToken,viewOrders);
router.get("/get-order/:id",verifyToken,viewOrders);
router.post("/add-order", verifyToken,isCustomer, validateOrderRequest, createOrder);
router.put("/update-order", verifyToken,isAdmin, updateOrder);

router.use((req, res) => res.status(404).json({ error: "Url not found" }));
module.exports = router;
