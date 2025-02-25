/**
 * This file initializes the server, validates API keys for added security,
 * and routes requests to the appropriate controller methods.
 */
const rateLimit = require("express-rate-limit");
const express = require("express");
const apiRoutes = require("./routes/api");
const logger = require("./utils/logging");
require("dotenv").config();
const API_KEY = process.env.API_KEY; // Load API key from .env
const API_SECRET = process.env.API_SECRET; // Load API secret from .env

const app = express();
// Middleware for rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX, 10), // Limit each IP to 100 requests per windowMs
  message: { message: process.env.RATE_LIMIT_MESSAGE },
});
// Apply the rate limiter to all requests
app.use(limiter);
// Middleware
app.use(express.json());
// API Key Authentication Middleware
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    headers: req.headers,
  });
  const apiKey = req.headers["x-api-key"];
  const apiSecret = req.headers["x-api-secret"];
  if (apiKey === API_KEY && apiSecret === API_SECRET) {
    next(); // Proceed to the next middleware or route
  } else {
    res.status(403).json({ message: "Forbidden: Invalid API Key or Secret" });
  }
});
// API Routes
app.use("/api", apiRoutes);
// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
