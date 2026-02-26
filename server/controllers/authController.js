// const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");


// // ================= REGISTER =================
// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // const hashed = await bcrypt.hash(password, 10);
//     const salt = await bcrypt.genSalt(10);
// const hashed = await bcrypt.hash(password, salt);

//     const user = await User.create({
//       name,
//       email,
//       password: hashed,
//       role,
//     });

//     res.json({ message: "Registered successfully" });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Register error" });
//   }
// };


// // ================= LOGIN =================
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid email" });
//     }

//     const match = await bcrypt.compare(password, user.password);

//     if (!match) {
//       return res.status(400).json({ message: "Invalid password" });
//     }

//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET || "secret",
//       { expiresIn: "7d" }
//     );

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         role: user.role,
//       },
//     });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Login error" });
//   }
// };


// // ================= UPLOAD RESUME =================
// exports.uploadResume = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const user = await User.findById(req.user._id);

//     // 🔥 IMPORTANT FIX
    
//     user.resume = `${process.env.BASE_URL}/uploads/${req.file.filename}`;

//     await user.save();

//     res.json({ message: "Resume uploaded successfully" });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Resume upload error" });
//   }
// };




const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ❌ DO NOT HASH HERE
    // Model pre-save hook will hash automatically

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.json({ message: "Registered successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Register error" });
  }
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // compare plain password with hashed password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        role: user.role,
      },
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Login error" });
  }
};


// ================= UPLOAD RESUME =================
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user._id);

    user.resume = `${process.env.BASE_URL || "http://localhost:5000"}/uploads/${req.file.filename}`;

    await user.save();

    res.json({ message: "Resume uploaded successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Resume upload error" });
  }
};