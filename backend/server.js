const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");
const { errorHandler } = require("./middleware/errorMiddleware.js");
const dynamicModelRouter = require("./routes/dynamicModelRoutes.js");
const kpiRouter = require("./routes/kpiRoutes.js");
const thresholdRouter = require("./routes/thresholdRoutes.js");
const displayRouter = require("./routes/displayRoutes.js");
const fileRouter = require("./routes/fileUploadRoutes.js");
const screenRouter = require("./routes/screenRoutes.js");
dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  exposedHeaders: ['Content-Disposition', 'Content-Length', 'Content-Type']
}));
// Basic Hello World route
app.get('/', (req, res) => {
  res.json({ message: 'Hello World! Welcome to the API' });
});

// API Routes
app.use('/api', dynamicModelRouter);
app.use('/kpi-api', kpiRouter);
app.use('/threshold-api', thresholdRouter);
app.use('/display-api', displayRouter);
app.use('/file-api', fileRouter);
app.use('/screen-api', screenRouter);

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
