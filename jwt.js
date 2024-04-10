const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const Usermodel = require('./users-app/models/User');

const cacheUserdata = {};
const genrateToken = (payload) => {
  const token = jwt.sign(payload, SECRET_KEY);
  return token;
};

const decodeToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {}
};

const verifyToken = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({ message: "Unauthorized Request" });
    }
    const token = authorization.split(" ")[1];
    const authCheck = await checkAuthorization(token);
    if (authCheck.error) {
      return res.status(401).json({ message: authCheck.error });
    }
    req.user = authCheck.user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkAuthorization = async (token) => {
  const decoded = decodeToken(token);
  if (!decoded) {
    return { error: "Unauthorized Request" };
  }

  //Checking if user data available in cache oter wise get from db
  const userid = decoded.id;
  let user = cacheUserdata[userid];
  if (!user) {
    user = await Usermodel.findById(userid).select(
      "name email mobile gender dob role"
    );
    if (!user) {
      return { error: "User not found" };
    }
    cacheUserdata[userid] = user;
  }

  if (!user) {
    return { error: "User not found" };
  }

  return { user };
};

module.exports = { genrateToken,verifyToken,cacheUserdata};
