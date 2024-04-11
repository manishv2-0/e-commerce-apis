const express = require("express");
const router = express.Router();
const {verifyToken,getProducts,isAdmin, addProduct,validateProductRequest,deleteProduct,viewProduct,updateProduct} = require("./controllers/Products");

// Routes only for admin
router.post('/add-product',verifyToken,isAdmin,validateProductRequest,addProduct);
router.put('/update-product/:productid',verifyToken,isAdmin,validateProductRequest,updateProduct);

// Routes only for loggedinuser
router.get("/:productid",verifyToken,viewProduct);
router.delete('/delete-product/:productid',verifyToken,isAdmin,deleteProduct);
router.get("/",verifyToken,getProducts);

router.use((req, res) => res.status(404).json({ error: "Url not found" }));
module.exports = router;
