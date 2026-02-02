/**
 * Example usage of the TrafficSignal Mongoose schema
 */

const mongoose = require('mongoose');
const TrafficSignal = require('./trafficSignalSchema');

// Connect to MongoDB (adjust connection string as needed)
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/vision-aid', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Example: Save a traffic signal detection result
const saveDetection = async () => {
  try {
    const detection = new TrafficSignal({
      color: 'red',
      confidence: 0.95,
      timestamp: new Date(),
      rgb: {
        r: 255,
        g: 0,
        b: 0
      },
      matchedColorName: 'Red',
      metadata: {
        imagePath: '/images/traffic_signal_001.jpg',
        detectionMethod: 'color_matching',
        location: {
          latitude: 40.7128,
          longitude: -74.0060
        }
      }
    });

    const saved = await detection.save();
    console.log('Detection saved:', saved.getSummary());
    return saved;
  } catch (error) {
    console.error('Error saving detection:', error);
    throw error;
  }
};

// Example: Find detections by color
const findDetectionsByColor = async (color) => {
  try {
    const detections = await TrafficSignal.findByColor(color);
    console.log(`Found ${detections.length} ${color} detections`);
    return detections;
  } catch (error) {
    console.error('Error finding detections:', error);
    throw error;
  }
};

// Example: Find high confidence detections
const findHighConfidenceDetections = async (minConfidence = 0.8) => {
  try {
    const detections = await TrafficSignal.findHighConfidence(minConfidence);
    console.log(`Found ${detections.length} high confidence detections (>= ${minConfidence})`);
    return detections;
  } catch (error) {
    console.error('Error finding high confidence detections:', error);
    throw error;
  }
};

// Example: Get recent detections
const getRecentDetections = async (limit = 10) => {
  try {
    const detections = await TrafficSignal.findRecent(limit);
    console.log(`Found ${detections.length} recent detections`);
    detections.forEach(detection => {
      console.log(`- ${detection.color} (${(detection.confidence * 100).toFixed(2)}%) at ${detection.timestamp}`);
    });
    return detections;
  } catch (error) {
    console.error('Error getting recent detections:', error);
    throw error;
  }
};

// Example: Query with custom filters
const queryDetections = async () => {
  try {
    // Find all red signals detected in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentRedSignals = await TrafficSignal.find({
      color: 'red',
      timestamp: { $gte: oneHourAgo },
      confidence: { $gte: 0.7 }
    }).sort({ timestamp: -1 });

    console.log(`Found ${recentRedSignals.length} recent red signals`);
    return recentRedSignals;
  } catch (error) {
    console.error('Error querying detections:', error);
    throw error;
  }
};

// Main example function
const main = async () => {
  await connectDB();

  try {
    // Save a detection
    console.log('\n=== Saving Detection ===');
    await saveDetection();

    // Find by color
    console.log('\n=== Finding Red Detections ===');
    await findDetectionsByColor('red');

    // Find high confidence
    console.log('\n=== Finding High Confidence Detections ===');
    await findHighConfidenceDetections(0.8);

    // Get recent
    console.log('\n=== Recent Detections ===');
    await getRecentDetections(5);

    // Custom query
    console.log('\n=== Custom Query ===');
    await queryDetections();

  } catch (error) {
    console.error('Error in main:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
};

// Run example if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  saveDetection,
  findDetectionsByColor,
  findHighConfidenceDetections,
  getRecentDetections,
  queryDetections
};
