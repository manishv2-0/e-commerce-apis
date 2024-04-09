const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const genrateToken =  (payload) => {
  const token = jwt.sign(payload, SECRET_KEY);
  return token;
};

const decodeToken = (token) => {
  try {
    return jwt.verify(token,SECRET_KEY);
  } catch (error) {
    
  }
};

module.exports = { genrateToken,decodeToken };
