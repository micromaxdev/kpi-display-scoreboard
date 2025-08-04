const path = require("path");
const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

const port = process.env.PORT || 5000;
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/users", require("./routes/userRoutes"));

// Serve frontend (React) in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "build")));

  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"))
  );
}

// Custom error handler middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
