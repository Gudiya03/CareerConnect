const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ================= PROTECT ROUTES =================
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token." });
    }

    // Verify access token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    req.user = user;

    next();

  } catch (err) {

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};


// ================= ROLE AUTHORIZATION =================
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied for role: ${req.user.role}`,
      });
    }

    next();
  };
};