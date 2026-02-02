# Vision Aid Backend

Express server that accepts images, sends them to a Python YOLO service for object detection, and stores the results in MongoDB.

## Features

- Image upload endpoint with file validation
- Integration with Python YOLO service
- MongoDB storage for detection results
- RESTful API for retrieving detection history
- Error handling and validation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- Python YOLO service (see example below)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/vision-aid
YOLO_SERVICE_URL=http://localhost:8000
YOLO_SERVICE_TIMEOUT=30000
```

## Running the Server

```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## API Endpoints

### POST `/api/detect`
Upload an image for object detection.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `image` (file)

**Response:**
```json
{
  "success": true,
  "message": "Detection completed successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "imageUrl": "/uploads/image-1234567890.jpg",
    "detections": [
      {
        "class": "person",
        "confidence": 0.95,
        "bbox": {
          "x": 100,
          "y": 150,
          "width": 200,
          "height": 300
        }
      }
    ],
    "metadata": {
      "processingTime": 0.5,
      "modelVersion": "yolov8",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### GET `/api/detections`
Get all detection results with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

### GET `/api/detections/:id`
Get a specific detection result by ID.

### GET `/health`
Health check endpoint.

## Python YOLO Service

The Python service should accept POST requests at `/detect` with an image file and return detection results in the following format:

**Expected Response Format:**
```json
{
  "detections": [
    {
      "class": "person",
      "confidence": 0.95,
      "bbox": {
        "x": 100,
        "y": 150,
        "width": 200,
        "height": 300
      }
    }
  ],
  "processing_time": 0.5,
  "model_version": "yolov8"
}
```

See `yolo_service_example.py` for a reference implementation.

## Project Structure

```
.
├── server.js                 # Main Express server
├── models/
│   └── DetectionResult.js    # MongoDB model
├── services/
│   └── yoloService.js        # YOLO service client
├── uploads/                  # Uploaded images (created automatically)
├── .env                      # Environment variables
└── package.json
```

## Error Handling

The server includes comprehensive error handling for:
- Invalid file types
- File size limits (10MB)
- YOLO service connection errors
- MongoDB connection issues
- Missing required fields
