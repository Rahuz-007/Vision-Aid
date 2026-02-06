# 🔍 Vision Aid - Monitoring & Observability Guide

## Overview

This guide covers the monitoring infrastructure for Vision Aid, including health checks, metrics, logging, and alerting.

---

## 📊 Health Checks

### Endpoints

#### 1. Detailed Health Check
```bash
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-06T11:30:00.000Z",
  "version": "1.0.0",
  "environment": "production",
  "uptime": 3600.5,
  "services": {
    "firestore": {
      "status": "connected",
      "latency": "45ms",
      "healthy": true
    },
    "yolo": {
      "status": "connected",
      "url": "http://localhost:5000",
      "latency": "120ms",
      "httpStatus": 200,
      "healthy": true
    }
  },
  "system": {
    "platform": "win32",
    "arch": "x64",
    "nodeVersion": "v20.x.x",
    "memory": {
      "total": "16.00 GB",
      "free": "8.50 GB",
      "used": "7.50 GB",
      "percentUsed": "46.88%"
    },
    "cpu": {
      "model": "Intel Core i7",
      "cores": 8,
      "loadAverage": ["0.50", "0.45", "0.40"]
    },
    "uptime": {
      "system": "24.50 hours",
      "process": "1.00 hours"
    }
  }
}
```

#### 2. Liveness Probe (Kubernetes)
```bash
GET /health/live
```
Returns 200 if server is running. Used by orchestrators to restart dead containers.

#### 3. Readiness Probe (Kubernetes)
```bash
GET /health/ready
```
Returns 200 only if critical dependencies (database) are accessible. Used by load balancers.

#### 4. Metrics Endpoint
```bash
GET /health/metrics
```
Returns detailed system and process metrics.

---

## 📈 Prometheus Metrics

### Metrics Endpoint
```bash
GET /metrics
```

### Available Metrics

#### HTTP Metrics

**`vision_aid_http_request_duration_seconds`**
- Type: Histogram
- Description: Duration of HTTP requests in seconds
- Labels: `method`, `route`, `status_code`
- Buckets: 0.005s to 10s

**`vision_aid_http_requests_total`**
- Type: Counter
- Description: Total number of HTTP requests
- Labels: `method`, `route`, `status_code`

**`vision_aid_http_request_errors_total`**
- Type: Counter
- Description: Total HTTP errors (4xx, 5xx)
- Labels: `method`, `route`, `status_code`

**`vision_aid_active_connections`**
- Type: Gauge
- Description: Number of active connections

#### Database Metrics

**`vision_aid_db_query_duration_seconds`**
- Type: Histogram
- Description: Database query duration
- Labels: `operation`, `collection`

**`vision_aid_db_queries_total`**
- Type: Counter
- Description: Total database queries
- Labels: `operation`, `collection`, `status`

#### Application Metrics

**`vision_aid_auth_events_total`**
- Type: Counter
- Description: Authentication events
- Labels: `event_type`, `status`

**`vision_aid_color_detection_events_total`**
- Type: Counter
- Description: Color detection events
- Labels: `method`, `status`

**`vision_aid_traffic_signal_detection_events_total`**
- Type: Counter
- Description: Traffic signal detections
- Labels: `color`, `confidence_level`

#### System Metrics (Default)

- `vision_aid_process_cpu_user_seconds_total` - CPU usage
- `vision_aid_process_resident_memory_bytes` - Memory usage
- `vision_aid_nodejs_eventloop_lag_seconds` - Event loop lag
- `vision_aid_nodejs_gc_duration_seconds` - Garbage collection

---

## 📝 Logging

### Log Levels

- **error** - Critical errors that need immediate attention
- **warn** - Warning conditions (degraded performance, auth failures)
- **info** - Normal operational messages
- **http** - HTTP request/response logs
- **debug** - Detailed debugging information

### Log Files

**Location:** `Back-end/logs/`

**Files:**
- `combined-YYYY-MM-DD.log` - All logs
- `error-YYYY-MM-DD.log` - Error logs only

**Rotation:**
- Daily rotation
- 14-day retention
- Automatic compression

### Log Format

**Production (JSON):**
```json
{
  "timestamp": "2026-02-06 11:30:45",
  "level": "info",
  "message": "Request completed",
  "method": "GET",
  "url": "/api/health",
  "status": 200,
  "duration": "15ms",
  "ip": "127.0.0.1"
}
```

**Development (Colored):**
```
11:30:45 [info]: Request completed { method: 'GET', url: '/api/health', status: 200 }
```

---

## 🚨 Recommended Monitoring Setup

### 1. Uptime Monitoring

**Tool:** UptimeRobot (Free)

**Monitors:**
```yaml
Monitors:
  - name: "Vision Aid API"
    url: "https://api.visionaid.com/health"
    interval: 5 minutes
    alert_threshold: 2 failures
    
  - name: "Vision Aid Frontend"
    url: "https://visionaid.com"
    interval: 5 minutes
    alert_threshold: 2 failures
```

**Setup:**
1. Sign up at https://uptimerobot.com
2. Add monitors for both frontend and backend
3. Configure email/SMS alerts
4. Set up status page (optional)

---

### 2. Prometheus + Grafana

**docker-compose.monitoring.yml:**
```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    ports:
      - "9090:9090"
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.retention.time=30d'
  
  grafana:
    image: grafana/grafana:latest
    volumes:
      - grafana-data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
      - GF_INSTALL_PLUGINS=grafana-piechart-panel
    depends_on:
      - prometheus

volumes:
  prometheus-data:
  grafana-data:
```

**Prometheus Configuration (`monitoring/prometheus.yml`):**
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'vision-aid-backend'
    static_configs:
      - targets: ['backend:3001']
    metrics_path: '/metrics'
    
  - job_name: 'vision-aid-health'
    static_configs:
      - targets: ['backend:3001']
    metrics_path: '/health/metrics'
```

---

### 3. Error Tracking - Sentry

**Installation:**
```bash
npm install @sentry/node @sentry/tracing
```

**Backend Setup (`server.js`):**
```javascript
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    integrations: [
      new Tracing.Integrations.Express({ app })
    ]
  });
  
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
  
  // Error handler (must be after routes)
  app.use(Sentry.Handlers.errorHandler());
}
```

**Environment Variables:**
```bash
SENTRY_DSN=https://your-key@sentry.io/your-project-id
```

---

### 4. Log Aggregation - BetterStack

**Setup:**
1. Sign up at https://betterstack.com
2. Create log source
3. Configure Winston to send logs:

```javascript
const winston = require('winston');
const BetterStack = require('winston-better-stack');

logger.add(new BetterStack({
  sourceToken: process.env.BETTERSTACK_TOKEN
}));
```

---

## 📊 Grafana Dashboards

### Recommended Panels

**1. System Health Dashboard**
- HTTP Request Rate (requests/sec)
- Request Duration (p50, p95, p99)
- Error Rate (% of failed requests)
- Active Connections
- CPU Usage
- Memory Usage
- Event Loop Lag

**2. Application Metrics Dashboard**
- Authentication Events
- Color Detection Events
- Traffic Signal Detections
- Database Query Performance
- Service Health Status

**3. Error Dashboard**
- Error Rate by Endpoint
- 5xx Errors Over Time
- Failed Authentications
- Failed DB Queries
- Top Error Messages

---

## 🚨 Alerting Rules

### Critical Alerts (PagerDuty/Email)

```yaml
alerts:
  - name: "High Error Rate"
    condition: "error_rate > 5%"
    duration: "5 minutes"
    severity: "critical"
    
  - name: "Service Down"
    condition: "up == 0"
    duration: "1 minute"
    severity: "critical"
    
  - name: "High Response Time"
    condition: "p95_latency > 2s"
    duration: "5 minutes"
    severity: "critical"
    
  - name: "Database Connection Lost"
    condition: "firestore_status != 'connected'"
    duration: "2 minutes"
    severity: "critical"
```

### Warning Alerts (Slack/Email)

```yaml
alerts:
  - name: "Elevated Error Rate"
    condition: "error_rate > 2%"
    duration: "10 minutes"
    severity: "warning"
    
  - name: "High Memory Usage"
    condition: "memory_percent > 85%"
    duration: "15 minutes"
    severity: "warning"
    
  - name: "Slow Queries"
    condition: "db_query_p95 > 500ms"
    duration: "10 minutes"
    severity: "warning"
```

---

## 🔧 Monitoring Best Practices

### 1. Health Check Strategy

✅ **DO:**
- Check critical dependencies (database, external services)
- Return different status codes (200, 503)
- Include latency information
- Use liveness/readiness probes

❌ **DON'T:**
- Make health checks expensive
- Include authentication
- Return sensitive information

### 2. Metrics Strategy

✅ **DO:**
- Use labels wisely (don't create high cardinality)
- Track business metrics (signups, detections)
- Monitor SLIs (latency, error rate, throughput)
- Set up retention policies

❌ **DON'T:**
- Track user IDs as labels
- Create too many custom metrics
- Ignore memory impact

### 3. Logging Strategy

✅ **DO:**
- Use structured logging (JSON)
- Include request IDs for tracing
- Log errors with stack traces
- Rotate logs automatically

❌ **DON'T:**
- Log sensitive data (passwords, tokens)
- Log at debug level in production
- Keep logs forever

---

## 📞 Incident Response

### When to Check Metrics

1. **Regular monitoring:** Check dashboards daily
2. **After deployment:** Monitor for 1 hour
3. **User reports:** Correlate with metrics
4. **Alerts triggered:** Immediate investigation

### Investigation Checklist

```bash
# 1. Check overall health
curl https://api.visionaid.com/health

# 2. Check recent logs
tail -f Back-end/logs/error-$(date +%Y-%m-%d).log

# 3. Check metrics
curl https://api.visionaid.com/metrics | grep error

# 4. Check service status
docker-compose ps

# 5. Check system resources
top
df -h
```

---

## 🎯 SLOs (Service Level Objectives)

**Availability:** 99.9% uptime (43 minutes downtime/month)

**Performance:**
- p50 latency < 100ms
- p95 latency < 500ms
- p99 latency < 1s

**Reliability:**
- Error rate < 1%
- Database success rate > 99%

---

## 📚 Additional Resources

- [Prometheus Docs](https://prometheus.io/docs/)
- [Grafana Tutorials](https://grafana.com/tutorials/)
- [Winston Best Practices](https://github.com/winstonjs/winston#readme)
- [Sentry Integration](https://docs.sentry.io/platforms/node/)

---

**Last Updated:** 2026-02-06  
**Version:** 1.0  
**Maintained by:** Vision Aid Team
