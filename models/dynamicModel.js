const mongoose = require('mongoose');

function getModel(database, collection) {
  const schema = new mongoose.Schema({}, { strict: false }); // Flexible schema

  // Check if the model already exists, reuse it if so
  if (mongoose.models[collection]) {
    return mongoose.models[collection];
  }

  // Otherwise, define and return the new model
  return mongoose.model(collection, schema, collection);
}

module.exports = getModel;
