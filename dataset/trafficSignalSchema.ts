/**
 * Mongoose schema for storing traffic signal detection results (TypeScript version)
 */

import mongoose, { Document, Model, Schema } from 'mongoose';

// Interface for traffic signal detection result
export interface ITrafficSignal extends Document {
  color: 'red' | 'yellow' | 'green' | 'unknown';
  confidence: number;
  timestamp: Date;
  rgb?: {
    r: number;
    g: number;
    b: number;
  };
  matchedColorName?: string;
  metadata?: {
    imagePath?: string;
    detectionMethod?: string;
    location?: {
      latitude?: number;
      longitude?: number;
    };
  };
  createdAt?: Date;
  updatedAt?: Date;
  getSummary(): {
    color: string;
    confidence: string;
    timestamp: Date;
    rgb: { r: number; g: number; b: number } | null;
  };
}

// Interface for static methods
export interface ITrafficSignalModel extends Model<ITrafficSignal> {
  findByColor(color: string): Promise<ITrafficSignal[]>;
  findHighConfidence(minConfidence?: number): Promise<ITrafficSignal[]>;
  findRecent(limit?: number): Promise<ITrafficSignal[]>;
}

const trafficSignalSchema = new Schema<ITrafficSignal>({
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
      validator: function(value: number) {
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
  matchedColorName: {
    type: String,
    trim: true
  },
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

// Indexes for efficient queries
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
trafficSignalSchema.statics.findByColor = function(color: string) {
  return this.find({ color: color.toLowerCase() }).sort({ timestamp: -1 });
};

// Static method to find high confidence detections
trafficSignalSchema.statics.findHighConfidence = function(minConfidence: number = 0.8) {
  return this.find({ confidence: { $gte: minConfidence } }).sort({ timestamp: -1 });
};

// Static method to get recent detections
trafficSignalSchema.statics.findRecent = function(limit: number = 10) {
  return this.find().sort({ timestamp: -1 }).limit(limit);
};

const TrafficSignal: ITrafficSignalModel = mongoose.model<ITrafficSignal, ITrafficSignalModel>(
  'TrafficSignal',
  trafficSignalSchema
);

export default TrafficSignal;
