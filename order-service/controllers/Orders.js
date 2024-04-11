const { genrateToken, verifyToken, isAdmin, isCustomer } = require("../../jwt");
const OrderModel = require("../models/Orders");
const ProductModel = require("../../product-service/models/Product");
const Joi = require("joi");

const createOrder = async (req, res) => {
  try {
    const user = req.user;
    const userId = user.id;
    const { product, orderQuantity, orderAmount, address } = req.body;
    const productDetails = await ProductModel.findById({
      deleted: false,
      _id: product,
    }).select("-_id productName price quantity description");

    if (!productDetails) {
      return res.status(400).json({ message: "Product not found." });
    }
    const productCost = productDetails.price;
    const availableProducts = productDetails.quantity;
    if (availableProducts < orderQuantity) {
      return res.status(400).json({ message: "Insufficient stock quantity." });
    }

    const calculatedAmount = productCost * orderQuantity;
    if (orderAmount !== calculatedAmount) {
      return res.status(400).json({ message: "Invalid order amount." });
    }

    const order = new OrderModel({
      product,
      user,
      orderQuantity,
      orderAmount,
      address,
    });
    await order.save();
    return res.status(200).json({ message: "Order created successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const orderSchema = Joi.object({
  product: Joi.string().required(),
  orderQuantity: Joi.number().integer().min(1).required(),
  orderAmount: Joi.number().positive().required(),
  address: Joi.string().required(),
});
const validateOrderRequest = (req, res, next) => {
  const { error } = orderSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const updateOrder = async (req, res) => {
  const session = await OrderModel.startSession();
  session.startTransaction();

  try {
    const { orderId, status } = req.body;
    const orderDetails = await OrderModel.findById(orderId).session(session);

    if (!orderDetails) {
      return res.status(400).json({ message: "Order not found" });
    }

    const orderStatus = orderDetails.status;

    if (orderStatus !== "pending") {
      return res
        .status(401)
        .json({ message: `Order is already ${orderStatus}` });
    }

    orderDetails.status = status;

    if (status === "approved") {
      const productId = orderDetails.product;
      const orderQuantity = orderDetails.orderQuantity;
      const product = await ProductModel.findById(productId)
        .session(session)
        .exec();
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "Product not found" });
      }
      product.quantity -= orderQuantity;
      if (product.quantity < 0) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ message: "Insufficient product quantity" });
      }
      await product.save();
    }

    // Save the updated order within the transaction
    await orderDetails.save();

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const viewOrders = async (req, res) => {
  try {
    const status = req.params.status;
    const orderId = req.params.id;
    const { role, id } = req.user;
    let where = {};

    if(status){
      where['status'] = status; 
    }
    if (role !== "admin") {
      where['user'] = id; 
    }

    if(orderId){
      where['_id'] = orderId;
    }
    let orders;

    orders = await OrderModel.find(where)
    .populate("product", "_id productName description")
    .populate("user", "_id name mobile email gender")
    .select("_id orderQuantity orderAmount address status");
    return res.status(200).json({ message: "Orders fetched successfully",data:orders });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = {
  verifyToken,
  isAdmin,
  validateOrderRequest,
  createOrder,
  isCustomer,
  updateOrder,
  viewOrders,
};
