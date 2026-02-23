const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use("/uploads", express.static("uploads"));


// ROUTES
app.use("/api/auth", authRoutes);        // login / register
app.use("/api/jobs", jobRoutes);         // create / list jobs
//app.use("/api/apply", applicationRoutes);
 // apply + applications
 app.use("/api/applications", applicationRoutes);

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

const PORT = 5000;

// CONNECT DB → START SERVER
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
