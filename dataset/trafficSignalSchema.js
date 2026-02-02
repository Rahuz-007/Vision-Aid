/**
 * Mongoose schema for storing traffic signal detection results
 */

const mongoose = require('mongoose');

const trafficSignalSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
    enum: ['red', 'yellow', 'green', 'unknown'],
    lowercase: true,
    trim: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
    validate: {
      validator: function(value) {
        return value >= 0 && value <= 1;
      },
      message: 'Confidence must be between 0 and 1'
    }
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  // Optional: Store RGB values if detected
  rgb: {
    r: {
      type: Number,
      min: 0,
      max: 255
    },
    g: {
      type: Number,
      min: 0,
      max: 255
    },
    b: {
      type: Number,
      min: 0,
      max: 255
    }
  },
  // Optional: Store matched color name from color database
  matchedColorName: {
    type: String,
    trim: true
  },
  // Optional: Additional metadata
  metadata: {
    imagePath: String,
    detectionMethod: String,
    location: {
      latitude: Number,
      longitude: Number
    }
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
  collection: 'traffic_signals' // Custom collection name
});

// Index for efficient queries
trafficSignalSchema.index({ timestamp: -1 }); // Descending order for recent first
trafficSignalSchema.index({ color: 1, timestamp: -1 }); // Compound index for color-based queries
trafficSignalSchema.index({ confidence: -1 }); // For sorting by confidence

// Virtual for formatted timestamp
trafficSignalSchema.virtual('formattedTimestamp').get(function() {
  return this.timestamp.toISOString();
});

// Method to get detection summary
trafficSignalSchema.methods.getSummary = function() {
  return {
    color: this.color,
    confidence: (this.confidence * 100).toFixed(2) + '%',
    timestamp: this.timestamp,
    rgb: this.rgb || null
  };
};

// Static method to find detections by color
trafficSignalSchema.statics.findByColor = function(color) {
  return this.find({ color: color.toLowerCase() }).sort({ timestamp: -1 });
};

// Static method to find high confidence detections
trafficSignalSchema.statics.findHighConfidence = function(minConfidence = 0.8) {
  return this.find({ confidence: { $gte: minConfidence } }).sort({ timestamp: -1 });
};

// Static method to get recent detections
trafficSignalSchema.statics.findRecent = function(limit = 10) {
  return this.find().sort({ timestamp: -1 }).limit(limit);
};

const TrafficSignal = mongoose.model('TrafficSignal', trafficSignalSchema);

module.exports = TrafficSignal;
