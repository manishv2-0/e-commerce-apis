const { genrateToken, verifyToken, cacheUserdata } = require("../../jwt");
const uuid = require("uuid");
// const  = {};
const getProducts = async (req, res) => {
  const user = req.user;
  res.status(200).json({ message: "Hello.",user:user });
};
module.exports = {
  verifyToken,
  getProducts
};
