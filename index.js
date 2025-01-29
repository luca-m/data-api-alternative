const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
require("dotenv").config();
const mongoURI = process.env.MONGO_URI;

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
const MONGODB_URI = mongoURI; // Replace with your MongoDB connection string
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// API Routes
app.use('/api', apiRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
