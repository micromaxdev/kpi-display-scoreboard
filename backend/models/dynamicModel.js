const mongoose = require('mongoose');

// Cache for created models to avoid recreating them
const modelCache = new Map();

function getDynamicModel(collectionName) {
  // Check if model already exists in cache
  if (modelCache.has(collectionName)) {
    return modelCache.get(collectionName);
  }

  // Create completely flexible schema - no required fields
  const schema = new mongoose.Schema(
    {}, // Empty schema - no predefined fields
    { 
      strict: false, // Allow any fields
      collection: collectionName,
      timestamps: true // Adds createdAt and updatedAt automatically
    }
  );

  // Add common indexes for better performance (optional)
  schema.index({ createdAt: -1 });
  schema.index({ updatedAt: -1 });

  // Create and cache the model
  const model = mongoose.model(collectionName, schema, collectionName);
  modelCache.set(collectionName, model);
  
  return model;
}

module.exports = getDynamicModel;
