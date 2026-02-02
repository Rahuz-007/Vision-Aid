const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

class YOLOService {
  constructor() {
    this.baseURL = process.env.YOLO_SERVICE_URL || 'http://localhost:8000';
    this.timeout = parseInt(process.env.YOLO_SERVICE_TIMEOUT) || 30000; // 30 seconds default
  }

  async detectObjects(imagePath) {
    try {
      // Check if file exists
      if (!fs.existsSync(imagePath)) {
        throw new Error(`Image file not found: ${imagePath}`);
      }

      // Create form data
      const formData = new FormData();
      formData.append('image', fs.createReadStream(imagePath));

      // Make request to Python YOLO service
      const response = await axios.post(
        `${this.baseURL}/detect`,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: this.timeout,
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );

      // Transform response to match our schema
      const detections = this.transformDetections(response.data);

      return {
        detections: detections,
        processingTime: response.data.processing_time || 0,
        modelVersion: response.data.model_version || 'unknown'
      };
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error(`Cannot connect to YOLO service at ${this.baseURL}. Make sure the Python service is running.`);
      }
      if (error.code === 'ETIMEDOUT') {
        throw new Error('YOLO service request timed out. The image might be too large or the service is overloaded.');
      }
      if (error.response) {
        throw new Error(`YOLO service error: ${error.response.data?.error || error.response.statusText}`);
      }
      throw new Error(`Failed to communicate with YOLO service: ${error.message}`);
    }
  }

  transformDetections(data) {
    // Handle different response formats from Python service
    if (Array.isArray(data.detections)) {
      return data.detections.map(detection => ({
        class: detection.class || detection.class_name || detection.label,
        confidence: detection.confidence || detection.conf || 0,
        color: detection.color || 'unknown',
        bbox: {
          x1: detection.box?.x1 || detection.xmin || 0,
          y1: detection.box?.y1 || detection.ymin || 0,
          x2: detection.box?.x2 || detection.xmax || 0,
          y2: detection.box?.y2 || detection.ymax || 0,
          x: detection.bbox?.x || detection.box?.x1 || 0,
          y: detection.bbox?.y || detection.box?.y1 || 0,
          width: detection.bbox?.width || (detection.box?.x2 - detection.box?.x1) || 0,
          height: detection.bbox?.height || (detection.box?.y2 - detection.box?.y1) || 0
        }
      }));
    }

    if (data.results && Array.isArray(data.results)) {
      return data.results.map(result => ({
        class: result.class || result.class_name || result.label,
        confidence: result.confidence || result.conf || 0,
        color: result.color || 'unknown',
        bbox: {
          x1: result.box?.x1 || result.xmin || 0,
          y1: result.box?.y1 || result.ymin || 0,
          x2: result.box?.x2 || result.xmax || 0,
          y2: result.box?.y2 || result.ymax || 0,
          x: result.bbox?.x || result.box?.x1 || 0,
          y: result.bbox?.y || result.box?.y1 || 0,
          width: result.bbox?.width || (result.box?.x2 - result.box?.x1) || 0,
          height: result.bbox?.height || (result.box?.y2 - result.box?.y1) || 0
        }
      }));
    }

    // Return empty array if no detections found
    return [];
  }

  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseURL}/health`, {
        timeout: 5000
      });
      return { status: 'ok', data: response.data };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}

module.exports = new YOLOService();
