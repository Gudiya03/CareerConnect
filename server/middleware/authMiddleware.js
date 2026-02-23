const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    req.user = await User.findById(decoded.id).select("-password");

    next();

  } catch (err) {
    console.log("TOKEN ERROR:", err.message);
    res.status(401).json({ message: "Token failed" });
  }
};