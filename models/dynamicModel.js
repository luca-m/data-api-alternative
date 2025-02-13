// /**
//  * Provides dynamic model generation for MongoDB collections. 
//  * This allows the application to work with any MongoDB collection without predefined schemas.
//  */
const mongoose = require("mongoose");
require("dotenv").config();

const connections = {}; // Cache for database connections
const modelsCache = {}; // Cache for models (database.collection -> Model)

function getModel(database, collection) {
  const baseURI = process.env.MONGO_URI; // Get base MongoDB connection string
  const options = process.env.MONGO_OPTIONS || ""; // Additional MongoDB options

  if (!baseURI) {
    throw new Error("MONGO_URI is not defined in .env file!");
  }

  // Create a cache key for model lookup (database.collection)
  const modelKey = `${database}.${collection}`;

  // If the model already exists in cache, return it
  if (modelsCache[modelKey]) {
    return modelsCache[modelKey];
  }

  // If a connection to this database does not exist, create it
  if (!connections[database]) {
    connections[database] = mongoose.createConnection(
      `${baseURI}/${database}${options}`,
    );

    // Handle connection errors
    connections[database].on("error", (err) => {
      console.error(`MongoDB connection error for ${database}:`, err);
    });

    connections[database].once("open", () => {
      console.log(`Connected to MongoDB database: ${database}`);
    });
  }

  const dbConnection = connections[database];

  // Define a flexible schema (no predefined structure)
  const schema = new mongoose.Schema({}, { strict: false });

  // Create and cache the model
  const model = dbConnection.model(collection, schema, collection);
  modelsCache[modelKey] = model;

  return model;
}

module.exports = getModel;
