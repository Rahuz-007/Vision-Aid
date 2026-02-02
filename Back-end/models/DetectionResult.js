const mongoose = require('mongoose');

const DetectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    index: true,
  },
  imagePath: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  originalFilename: {
    type: String,
    required: true
  },
  detections: [{
    class: {
      type: String,
      required: true
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    },
    color: {
      type: String,
      enum: ['red', 'yellow', 'green', 'unknown'],
      default: 'unknown'
    },
    rgb: {
      r: Number,
      g: Number,
      b: Number
    },
    matchedColorName: String,
    bbox: {
      x1: { type: Number },
      y1: { type: Number },
      x2: { type: Number },
      y2: { type: Number },
      x: { type: Number },
      y: { type: Number },
      width: { type: Number },
      height: { type: Number }
    }
  }],
  metadata: {
    processingTime: {
      type: Number,
      default: 0
    },
    modelVersion: {
      type: String,
      default: 'unknown'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});


DetectionSchema.index({ 'metadata.timestamp': -1 });
DetectionSchema.index({ 'detections.class': 1 });

module.exports = mongoose.model('DetectionResult', DetectionSchema);
