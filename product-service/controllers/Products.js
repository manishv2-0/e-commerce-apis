const { genrateToken, verifyToken, isAdmin } = require("../../jwt");
const ProductModel = require("../models/Product");
const Joi = require("joi");
const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({ deleted: false }).select(
      "productName price quantity description"
    );
    const user = req.user;
    res
      .status(200)
      .json({ message: "Products fetched successfully.", products: products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const viewProduct = async (req, res) => {
  try {
    const productId = req.params.productid;
    const products = await ProductModel.findById({
      deleted: false,
      _id: productId,
    }).select("-_id productName price quantity description");
    return res
      .status(200)
      .json({ message: "Products fetched successfully.", products: products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const addProduct = async (req, res) => {
  try {
    const request = req.body;
    const addProduct = new ProductModel(request);
    const saveProduct = await addProduct.save();
    return res.status(200).json({ message: "Product added successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const request = req.body;
    const productId = req.params.productid;
    const isProduct = await ProductModel.findById({
      deleted: false,
      _id: productId,
    }).select("-_id productName price quantity description");
    if (!isProduct) {
      return res.status(404).json({ message: "Product not found." });
    }
    const updateProduct = await ProductModel.findByIdAndUpdate(
      productId,
      request,
      {
        new: true,
      }
    ).select("productName price quantity description");
    return res
      .status(200)
      .json({ message: "Product added successfully.", data: updateProduct });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productid;
    const product = await ProductModel.findByIdAndUpdate(productId, {
      deleted: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    return res.status(200).json({ message: "Product removed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const productSchema = Joi.object({
  productName: Joi.string().required(),
  price: Joi.number().min(0).required(),
  quantity: Joi.number().min(0).required(),
  description: Joi.string().required(),
});

const validateProductRequest = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
module.exports = {
  verifyToken,
  getProducts,
  isAdmin,
  addProduct,
  validateProductRequest,
  deleteProduct,
  viewProduct,
  updateProduct,
};
