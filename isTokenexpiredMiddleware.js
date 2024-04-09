const TokenModel = require("./models/Tokens");

const checkIfuserTokenExpired = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.split(" ")[1];
    const isTokenBlackListed = await TokenModel.findOne({ token: token });
    if (isTokenBlackListed) {
      return res.status(401).json({ message: "Token expired" });
    }
  }
  next();
};

const markTokenExpire = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.split(" ")[1];
    const Blacklisttoken = new TokenModel({ token });
    await Blacklisttoken.save();
}
next();
};
module.exports = { checkIfuserTokenExpired,markTokenExpire };
