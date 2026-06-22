const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes"); // ⭐ NEW ADMIN ROUTES
const chatRoutes = require("./routes/chatRoutes"); // ⭐ NEW CHAT ROUTES
const companyRoutes = require("./routes/companyRoutes");
const interviewExperienceRoutes = require("./routes/interviewExperienceRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://career-connect-vert-kappa.vercel.app"
    ],
    credentials: true
  }
});

// Make io accessible in routing if needed
app.set("io", io);

// ✅ MIDDLEWARE
app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests from this IP, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false
});
app.use("/api/", limiter);


app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://career-connect-vert-kappa.vercel.app"
  ],
  credentials: true
}));

// STATIC
app.use("/uploads", express.static("uploads"));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes); // ⭐ NEW ADMIN API ENDPOINT
app.use("/api/chat", chatRoutes); // ⭐ NEW CHAT ENDPOINT
app.use("/api/company", companyRoutes);
app.use("/api/interview-experience", interviewExperienceRoutes);


// SOCKET.IO EVENTS
io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("sendMessage", (data) => {
    // Broadcast message to receiver
    socket.to(data.receiverId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {});
});

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
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });