# Results Page - Backend Data Requirements

> **Document Purpose**: This document specifies all data that the frontend Results page needs from the backend to display real-time, accurate processing results.

---

## Overview

The Results page displays the outcome of policy document processing. It requires data from **two backends**:
1. **NLP Backend** (AI Processing)
2. **Execution Backend** (Task Management)

---

## 1. NLP Backend Requirements

### Base URL
```
https://eighty-clubs-stop.loca.lt
```

### Required Endpoints

#### A. Get Processing Results
```http
GET /api/policy/results/{policy_id}
```

**Purpose**: Retrieve complete processing results for a policy

**Response Format:**
```json
{
  "policy_id": "POL-2026-001",
  "policy_title": "Employee Leave Policy",
  "file_name": "leave_policy.pdf",
  "upload_timestamp": "2026-01-16T00:00:00Z",
  "processing_status": "completed",
  "processing_time_seconds": 153,
  
  "rules": [
    {
      "rule_id": "R1",
      "action": "Approve leave request",
      "responsible_role": "Manager",
      "deadline": "2 business days",
      "conditions": ["Employee has sufficient balance"],
      "ambiguity_flag": false
    }
  ],
  
  "statistics": {
    "total_rules": 174,
    "ambiguous_rules": 23,
    "clarified_rules": 23,
    "confidence_score": 96,
    "accuracy_score": 98,
    "completeness_score": 98,
    "consistency_score": 92,
    "readability_score": 98
  },
  
  "file_metrics": {
    "original_size_bytes": 15925248,
    "processed_size_bytes": 2516582,
    "size_reduction_percent": 84,
    "original_format": "PDF",
    "output_format": "JSON"
  },
  
  "quality_metrics": {
    "rule_extraction_accuracy": 99,
    "ai_confidence_level": 96,
    "data_coverage": 98,
    "format_validation": 92,
    "human_readability": 98,
    "processing_speed_score": 89
  }
}
```

**Frontend Usage:**
- **Transformation Summary**: `policy_title`, `file_name`, `processing_time_seconds`, `total_rules`, `clarified_rules`, `file_metrics`
- **Quality Metrics**: All fields from `quality_metrics`
- **Before/After Comparison**: `file_metrics` (size, format)
- **Victory Banner**: `statistics.confidence_score` or `quality_metrics.ai_confidence_level`

---

#### B. Get Processing Metrics (Real-time)
```http
GET /api/policy/metrics/{policy_id}
```

**Purpose**: Get real-time performance metrics during/after processing

**Response Format:**
```json
{
  "policy_id": "POL-2026-001",
  "processing_fps": 60,
  "current_stage": "completed",
  "progress_percent": 100,
  "estimated_time_remaining_seconds": 0,
  "rules_processed": 174,
  "ambiguities_detected": 23,
  "current_operation": "Finalizing results"
}
```

**Frontend Usage:**
- **Processing Speed Metric**: `processing_fps`
- **Real-time Updates**: `progress_percent`, `current_operation` (if shown during processing)

---

## 2. Execution Backend Requirements

### Base URL
```
https://policy-execution-backend.onrender.com
```

### Required Endpoints

#### A. Get Policy Statistics
```http
GET /policies/stats/{policy_id}
```

**Purpose**: Get execution-related statistics for a specific policy

**Response Format:**
```json
{
  "policy_id": "POL-2026-001",
  "total_tasks": 174,
  "tasks_by_status": {
    "CREATED": 50,
    "ASSIGNED": 30,
    "IN_PROGRESS": 40,
    "COMPLETED": 50,
    "ESCALATED": 4
  },
  "tasks_by_role": {
    "Clerk": 80,
    "Officer": 60,
    "Admin": 34
  },
  "completion_rate_percent": 29,
  "average_completion_time_hours": 24
}
```

**Frontend Usage:**
- **Transformation Summary**: `total_tasks` (as "Rules Extracted")
- **Dashboard Integration**: Task counts and completion rates

---

#### B. Get NLP Results (for PDF Export)
```http
GET /nlp-results/{result_id}
```

**Purpose**: Retrieve saved NLP results for PDF generation

**Response Format:**
```json
{
  "result_id": "uuid-here",
  "policy_id": "POL-2026-001",
  "file_name": "leave_policy.pdf",
  "upload_timestamp": "2026-01-16T00:00:00Z",
  "nlp_data": {
    "policy_title": "Employee Leave Policy",
    "rules": [...],
    "statistics": {...}
  },
  "status": "completed"
}
```

**Frontend Usage:**
- **PDF Export**: Entire `nlp_data` object for report generation

---

## 3. Data Flow Diagram

```
┌─────────────┐
│   Upload    │
│    Page     │
└──────┬──────┘
       │ POST /api/policy/process
       ↓
┌─────────────┐
│ Processing  │
│    Page     │ ← GET /api/policy/metrics/{id} (real-time)
└──────┬──────┘
       │ Processing Complete
       ↓
┌─────────────┐
│   Review    │
│    Page     │
└──────┬──────┘
       │ Submit Clarifications
       ↓
┌─────────────┐
│   Results   │ ← GET /api/policy/results/{id}
│    Page     │ ← GET /policies/stats/{id}
└─────────────┘
       │
       ↓ Export PDF
  GET /nlp-results/{id}/download-pdf
```

---

## 4. localStorage Keys (Frontend Session Management)

The frontend uses these localStorage keys to track the current session:

| Key | Purpose | Example Value |
|-----|---------|---------------|
| `processingFile` | Current file name | `"leave_policy.pdf"` |
| `policyId` | Current policy ID | `"POL-2026-001"` |
| `nlpResultId` | Result ID for PDF export | `"uuid-here"` |
| `processingResults` | Cached NLP results | `{...}` (JSON) |
| `sessionTimestamp` | Session start time | `1737000000000` |

**Session Validation Logic:**
- If `sessionTimestamp` is older than 24 hours → Clear all data
- If `policyId` exists but `processingResults` is missing → Fetch from backend
- If no `policyId` → Show empty state

---

## 5. Empty State Requirements

When no data is available, the Results page should display:

**Message:**
> "No results available. Please upload and process a policy document first."

**CTA Button:**
- Text: "Upload Policy Document"
- Action: Navigate to `/upload`

**Conditions for Empty State:**
- No `policyId` in localStorage
- No `processingResults` in localStorage
- `sessionTimestamp` is stale (>24 hours)
- Backend returns 404 for `GET /api/policy/results/{id}`

---

## 6. Error Handling

### Backend Unreachable
**Display:**
```
⚠️ Unable to load results
The backend service is currently unavailable. Please try again later.
[Retry] [Go to Upload]
```

### Invalid Policy ID
**Display:**
```
⚠️ Results not found
The requested policy results could not be found. It may have been deleted or expired.
[Upload New Policy]
```

### Partial Data
**Display:**
- Show available data
- Display warning: "Some metrics are unavailable"
- Use fallback values (e.g., "N/A" or "Calculating...")

---

## 7. Real-Time Updates (Future Enhancement)

For live processing updates, consider:
- **WebSocket Connection**: `wss://backend.com/ws/policy/{id}`
- **Server-Sent Events**: `GET /api/policy/stream/{id}`
- **Polling**: `GET /api/policy/status/{id}` every 2 seconds

**Event Types:**
```json
{
  "event": "progress_update",
  "policy_id": "POL-2026-001",
  "progress_percent": 45,
  "current_stage": "Extracting rules",
  "rules_processed": 78
}
```

---

## 8. Summary of Required Backend Changes

### NLP Backend (AI Service)
- [ ] **NEW**: `GET /api/policy/results/{policy_id}` - Return complete results
- [ ] **NEW**: `GET /api/policy/metrics/{policy_id}` - Return performance metrics
- [ ] **ENHANCE**: Include `statistics` and `quality_metrics` in responses

### Execution Backend (Task Management)
- [ ] **NEW**: `GET /policies/stats/{policy_id}` - Return policy-specific stats
- [ ] **EXISTING**: `GET /nlp-results/{result_id}` - Already implemented
- [ ] **EXISTING**: `GET /nlp-results/{result_id}/download-pdf` - Already implemented

---

## 9. Testing Checklist

- [ ] Upload a policy document
- [ ] Verify `processingResults` is saved to localStorage
- [ ] Navigate to Results page
- [ ] Verify all metrics display correctly
- [ ] Clear localStorage
- [ ] Refresh Results page → Should show empty state
- [ ] Upload and process again → Results should update
- [ ] Test PDF export with valid `resultId`
- [ ] Test error states (backend down, invalid ID)

---

**Last Updated**: 2026-01-16  
**Frontend Version**: PolicyVision3.0  
**Backend Compatibility**: NLP v1.0, Execution v1.0
