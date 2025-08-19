import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import dynamicModelRouter from "./routes/dynamicModelRoutes.js";
import kpiRouter from "./routes/kpiRoutes.js";
import thresholdRouter from "./routes/thresholdRoutes.js";
import displayRouter from "./routes/displayRoutes.js";
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
  credentials: true
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
