# Dashboard - Backend Data Requirements

> **Document Purpose**: This document specifies the API endpoints and data structures required from the backend to populate the "Mission Control Dashboard" with real-time analytics.

---

## Overview

The Dashboard requires real-time data for four key sections:
1.  **Performance Chart** (Weekly processing trends)
2.  **Storage Utilization** (Disk usage breakdown)
3.  **API Usage Statistics** (Endpoint health and metrics)
4.  **System Health** (Component status)

---

## Required Endpoints

### 1. Performance Analytics (Chart)
**Endpoint:** `GET /analytics/performance`
**Query Params:** `range` (e.g., `7d`, `30d`) - Default: `7d`

**Purpose:** Populates the "Processing Performance" bar chart.

**Response Format:**
```json
{
  "range": "7d",
  "data": [
    { "name": "Mon", "uploads": 45, "processed": 42, "exported": 38 },
    { "name": "Tue", "uploads": 52, "processed": 48, "exported": 45 },
    { "name": "Wed", "uploads": 61, "processed": 58, "exported": 54 },
    { "name": "Thu", "uploads": 48, "processed": 45, "exported": 42 },
    { "name": "Fri", "uploads": 73, "processed": 70, "exported": 67 },
    { "name": "Sat", "uploads": 38, "processed": 35, "exported": 32 },
    { "name": "Sun", "uploads": 29, "processed": 27, "exported": 24 }
  ]
}
```

### 2. Storage Utilization
**Endpoint:** `GET /system/storage`

**Purpose:** Populates the "Storage Utilization" pie chart and stats.

**Response Format:**
```json
{
  "total_storage_gb": 100,
  "used_storage_gb": 97.6,
  "available_gb": 2.4,
  "breakdown": [
    { "name": "Documents", "value": 45.2, "color": "#00FFFF" },
    { "name": "Processed Data", "value": 28.7, "color": "#8A2BE2" },
    { "name": "Exports", "value": 15.3, "color": "#00FF88" },
    { "name": "Cache", "value": 8.4, "color": "#FF6B00" },
    { "name": "Available", "value": 2.4, "color": "#2A2A2A" }
  ]
}
```

### 3. API Usage Statistics
**Endpoint:** `GET /system/api-usage`

**Purpose:** Populates the "API Usage Statistics" table.

**Response Format:**
```json
{
  "endpoints": [
    {
      "name": "/api/upload",
      "calls": 1247,
      "avg_response_time": "145ms",
      "success_rate": "99.2%",
      "status": "healthy"
    },
    {
      "name": "/api/process",
      "calls": 1189,
      "avg_response_time": "2.4s",
      "success_rate": "98.7%",
      "status": "healthy"
    },
    {
      "name": "/api/extract-rules",
      "calls": 1189,
      "avg_response_time": "1.8s",
      "success_rate": "97.3%",
      "status": "warning"
    },
    {
      "name": "/api/export",
      "calls": 1124,
      "avg_response_time": "320ms",
      "success_rate": "99.8%",
      "status": "healthy"
    }
  ]
}
```

### 4. System Health Monitor
**Endpoint:** `GET /system/health`

**Purpose:** Populates the "System Health" cards.

**Response Format:**
```json
{
  "metrics": [
    {
      "name": "API Response Time",
      "status": "healthy",
      "value": "124ms avg",
      "icon": "ClockIcon"
    },
    {
      "name": "Database Performance",
      "status": "healthy",
      "value": "99.9% uptime",
      "icon": "CircleStackIcon"
    },
    {
      "name": "WebGL Rendering",
      "status": "healthy",
      "value": "60 FPS",
      "icon": "CpuChipIcon"
    },
    {
      "name": "Memory Usage",
      "status": "warning",
      "value": "78% utilized",
      "icon": "ServerIcon"
    }
  ]
}
```

---

## Implementation Notes

*   **Real-time Updates:** The frontend will poll these endpoints every 30-60 seconds to keep the dashboard fresh.
*   **Error Handling:** If an endpoint returns 500 or is unreachable, the frontend will display a "Data Unavailable" state for that specific widget.
*   **Mock Data:** Until these endpoints are implemented, the frontend may show empty states or loading indicators.

