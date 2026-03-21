const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

dotenv.config();

const app = express();

// ✅ MIDDLEWARE
app.use(express.json());

// ✅ FINAL CORS FIX (IMPORTANT)
app.use(cors({
  origin: true,
  credentials: true
}));

// STATIC
app.use("/uploads", express.static("uploads"));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// PORT
const PORT = process.env.PORT || 5000;

// DB CONNECT
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });