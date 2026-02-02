const mongoose = require('mongoose');

const trafficSignalDetectionSchema = new mongoose.Schema({
    // Detection details
    color: {
        type: String,
        required: true,
        enum: ['red', 'yellow', 'green', 'unknown'],
        lowercase: true
    },
    confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },

    // Image information
    imageUrl: {
        type: String
    },
    imagePath: {
        type: String
    },

    // Detection metadata
    detectionMode: {
        type: String,
        enum: ['live', 'upload'],
        default: 'live'
    },

    // Timestamps
    detectedAt: {
        type: Date,
        default: Date.now
    },

    // User information (optional)
    userId: {
        type: String
    },
    sessionId: {
        type: String
    },

    // Location (optional)
    location: {
        latitude: Number,
        longitude: Number
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Indexes for efficient queries
trafficSignalDetectionSchema.index({ detectedAt: -1 });
trafficSignalDetectionSchema.index({ color: 1, detectedAt: -1 });
trafficSignalDetectionSchema.index({ sessionId: 1 });

// Virtual for formatted timestamp
trafficSignalDetectionSchema.virtual('formattedTime').get(function () {
    return this.detectedAt.toLocaleTimeString();
});

// Method to get detection summary
trafficSignalDetectionSchema.methods.getSummary = function () {
    return {
        color: this.color,
        confidence: this.confidence + '%',
        time: this.formattedTime,
        mode: this.detectionMode
    };
};

// Static method to find recent detections
trafficSignalDetectionSchema.statics.findRecent = function (limit = 10) {
    return this.find().sort({ detectedAt: -1 }).limit(limit);
};

// Static method to find by color
trafficSignalDetectionSchema.statics.findByColor = function (color) {
    return this.find({ color: color.toLowerCase() }).sort({ detectedAt: -1 });
};

// Static method to get statistics
trafficSignalDetectionSchema.statics.getStatistics = async function () {
    const total = await this.countDocuments();
    const byColor = await this.aggregate([
        {
            $group: {
                _id: '$color',
                count: { $sum: 1 },
                avgConfidence: { $avg: '$confidence' }
            }
        }
    ]);

    return {
        total,
        byColor
    };
};

module.exports = mongoose.model('TrafficSignalDetection', trafficSignalDetectionSchema);
