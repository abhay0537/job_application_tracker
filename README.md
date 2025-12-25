# job_application_tracker

## Overview

This project implements a **logic-first backend service** that models a **job_application_tracker**.  
The focus is on backend business logic such as **eligibility validation, ATS scoring, strict state transitions, and immutable audit logs**.

No frontend and no authentication are implemented, as required.

---

## Tech Stack

- Node.js
- Express.js
- SQLite
- No frontend
- No authentication

---

## Application State Model

Applications follow a strict state machine:
CREATED → ELIGIBLE → APPLIED
CREATED → REJECTED


### Rules
- State transitions are validated
- Illegal transitions are rejected
- Every state change is recorded in an append-only audit log

---

## Why APIs Are Designed This Way

This system is **not a CRUD demo**.

Each API represents a **business action**:
- Applications are created only through job application
- Eligibility checks and ATS scoring are enforced automatically
- State transitions are controlled via a state machine

This ensures correctness, traceability, and production-style backend behavior.

---

## Eligibility Rules Enforcement

Eligibility is checked when a candidate applies to a job.

### Rules
- Minimum CGPA threshold
- Allowed branches defined per job

### Behavior
- Eligible → application moves to `ELIGIBLE` and ATS score is generated
- Not eligible → application moves to `REJECTED` with a reason

---

## ATS Score (Stubbed)

A simple rule-based ATS scoring mechanism is implemented:
- Keyword matching in resume text
- Fixed scoring logic

The goal is **structure and flow**, not ML accuracy.

---

## Immutable Audit Log

Every state change is recorded in an **append-only audit log** containing:
- From state
- To state
- Timestamp
- Reason (if applicable)

Audit logs are never updated or deleted.

---

## Async Workers (Future Scope)

In a production system:
- ATS scoring could be handled by background workers
- Notifications could be triggered on state changes
- Queues could be used for scalability

These are intentionally synchronous here for clarity.

---

## Data Models

### Jobs
- Eligibility rules (minimum CGPA, allowed branches)

### Applications
- Candidate details
- Current state
- ATS score
- Eligibility decision

### Application Logs
- Append-only transition history

---

## Running the Project

```bash
npm install
node index.js

## Sample API Calls (Postman Examples)

These examples demonstrate how the required APIs are expected to be used.
Local URLs (http://localhost:3000) are intentional.

1️- Apply to Job

POST /jobs/:job_id/apply

URL

http://localhost:3000/jobs/1/apply


Headers

Content-Type: application/json


Body (raw → JSON)

{
  "user_id": "user_123",
  "cgpa": 8.1,
  "branch": "CSE",
  "resume_text": "node backend sql experience"
}


Example Response

{
  "application_id": 1,
  "state": "ELIGIBLE",
  "ats_score": 60
}

2️- Fetch Application

GET /applications/:application_id

URL

http://localhost:3000/applications/1


Example Response

{
  "current_state": "APPLIED",
  "ats_score": 60,
  "eligibility_decision": "ELIGIBLE",
  "audit_log": [
    {
      "from_state": "CREATED",
      "to_state": "ELIGIBLE",
      "timestamp": "2025-01-24 14:30:01"
    },
    {
      "from_state": "ELIGIBLE",
      "to_state": "APPLIED",
      "timestamp": "2025-01-24 14:35:10"
    }
  ]
}

3️- Transition Application State

POST /applications/:application_id/transition

URL

http://localhost:3000/applications/1/transition


Headers

Content-Type: application/json


Body

{
  "to_state": "APPLIED"
}


Success Response

{
  "message": "State transitioned successfully"
}


Invalid Transition Response

{
  "error": "Invalid transition"
}
