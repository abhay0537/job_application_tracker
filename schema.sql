CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  min_cgpa REAL,
  allowed_branches TEXT
);

CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER,
  user_id TEXT,
  cgpa REAL,
  branch TEXT,
  resume_text TEXT,
  state TEXT,
  ats_score INTEGER,
  eligibility_reason TEXT
);

CREATE TABLE IF NOT EXISTS application_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER,
  from_state TEXT,
  to_state TEXT,
  reason TEXT,
  timestamp TEXT
);
