# Traffic Signal Detection Schema

Mongoose schema for storing traffic signal detection results with color, confidence, and timestamp.

## Installation

```bash
npm install mongoose
```

For TypeScript support:
```bash
npm install mongoose @types/mongoose typescript
```

## Schema Fields

### Required Fields
- **color**: String - Traffic signal color (`'red'`, `'yellow'`, `'green'`, or `'unknown'`)
- **confidence**: Number - Detection confidence score (0 to 1)
- **timestamp**: Date - When the detection occurred (defaults to current time)

### Optional Fields
- **rgb**: Object - RGB values of detected color
  - `r`: Red component (0-255)
  - `g`: Green component (0-255)
  - `b`: Blue component (0-255)
- **matchedColorName**: String - Name of matched color from color database
- **metadata**: Object - Additional detection metadata
  - `imagePath`: String - Path to source image
  - `detectionMethod`: String - Method used for detection
  - `location`: Object - GPS coordinates
    - `latitude`: Number
    - `longitude`: Number

### Auto-generated Fields
- **createdAt**: Date - Document creation timestamp
- **updatedAt**: Date - Document last update timestamp

## Usage

### JavaScript Example

```javascript
const mongoose = require('mongoose');
const TrafficSignal = require('./trafficSignalSchema');

// Connect to MongoDB
await mongoose.connect('mongodb://localhost:27017/vision-aid');

// Create and save a detection
const detection = new TrafficSignal({
  color: 'red',
  confidence: 0.95,
  timestamp: new Date(),
  rgb: { r: 255, g: 0, b: 0 },
  matchedColorName: 'Red'
});

const saved = await detection.save();
console.log(saved.getSummary());
```

### TypeScript Example

```typescript
import TrafficSignal from './trafficSignalSchema';

const detection = new TrafficSignal({
  color: 'green',
  confidence: 0.87,
  timestamp: new Date(),
  rgb: { r: 0, g: 255, b: 0 }
});

await detection.save();
```

## Available Methods

### Instance Methods

- **getSummary()**: Returns a formatted summary of the detection

### Static Methods

- **findByColor(color)**: Find all detections of a specific color
- **findHighConfidence(minConfidence)**: Find detections with confidence >= threshold (default: 0.8)
- **findRecent(limit)**: Get recent detections (default: 10)

## Example Queries

```javascript
// Find all red signals
const redSignals = await TrafficSignal.findByColor('red');

// Find high confidence detections
const highConfidence = await TrafficSignal.findHighConfidence(0.9);

// Get recent detections
const recent = await TrafficSignal.findRecent(20);

// Custom query: Find red signals in last hour with high confidence
const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
const recentRed = await TrafficSignal.find({
  color: 'red',
  timestamp: { $gte: oneHourAgo },
  confidence: { $gte: 0.8 }
}).sort({ timestamp: -1 });
```

## Indexes

The schema includes the following indexes for efficient queries:
- `timestamp` (descending) - For recent-first queries
- `color` + `timestamp` (compound) - For color-based queries
- `confidence` (descending) - For confidence-based sorting

## Collection Name

The schema uses the collection name `traffic_signals` by default.
