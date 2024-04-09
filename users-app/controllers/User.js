const Usermodel = require("../models/User");
const { genrateToken, decodeToken } = require("../jwt");
const User = require("../models/User");
const uuid = require("uuid");
const cacheUserdata = {};
const signup = async (req, res) => {
  try {
    const reqbody = req.body;
    const newUser = new Usermodel(reqbody);
    newUser.setPassword(reqbody.password);
    const user = await newUser.save();
    const payload = { id: user.id, email: user.email };
    const authtoken = genrateToken(payload);
    res
      .status(200)
      .json({ message: "Signup successful.", authtoken: authtoken });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Something went wrong." });
  }
};

const signin = async (req, res) => {
  try {
    const { password, email } = req.body;
    const user = await Usermodel.findOne({ email: email });
    if (user) {
      const User = new Usermodel(user);
      const isPasswordmatch = await User.validatePassword(password);
      if (isPasswordmatch) {
        const payload = { id: user.id, email: user.email, uuid: uuid.v4() };
        const authtoken = genrateToken(payload);
        return res
          .status(200)
          .json({ message: "Signin successful.", authtoken: authtoken });
      }
    }
    return res.status(400).json({ message: "Inavalid credentials" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    return res.status(200).json({ message: "Logout success" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const validateSignup = async (req, res, next) => {
  const { name, email, mobile, gender, dob, password } = req.body;

  if (!name || !mobile || !email || !gender || !dob || !password) {
    return res.status(400).json({ message: "All fields are mandatory." });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email address." });
  }

  if (!["male", "female", "other"].includes(gender.toLowerCase())) {
    return res
      .status(400)
      .json({ message: "Gender must be male, female, or other." });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long." });
  }
  const user = await Usermodel.findOne({ email: email });
  if (user) {
    return res.status(400).json({ message: "Duplicate email address." });
  }
  next();
};

const authMiddleware = async (req, res, next) => {
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

const profile = async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized Request" });
    }
    return res
      .status(200)
      .json({ data: user, message: "Data fetched successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized Request" });
    }
    const { name, mobile, gender, dob } = req.body;
    if (gender && !["male", "female", "other"].includes(gender.toLowerCase())) {
      return res
        .status(400)
        .json({ message: "Gender must be male, female, or other." });
    }
    const updateData = {};

    if (name) {
      updateData.name = name;
    }
    if (gender) {
      updateData.gender = gender;
    }

    if (dob) {
      updateData.dob = dob;
    }

    if (mobile) {
      updateData.mobile = mobile;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Update data can't be empty" });
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, updateData, {
      new: true,
    }).select("name email mobile gender dob role");

    //updating cache data of user
    cacheUserdata[user._id] = updatedUser;
    return res
      .status(200)
      .json({ message: "User data updated successfully", data: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  signup,
  signin,
  logout,
  validateSignup,
  profile,
  authMiddleware,
  updateProfile,
};
