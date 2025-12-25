const express = require("express");
const router = express.Router();
const db = require("../db");

const { checkEligibility } = require("../logic/eligibility");
const { calculateATS } = require("../logic/ats");
const { isValidTransition } = require("../logic/stateMachine");

/* Apply to Job */
router.post("/jobs/:job_id/apply", (req, res) => {
  const { user_id, cgpa, branch, resume_text } = req.body;
  const jobId = req.params.job_id;

  db.get(`SELECT * FROM jobs WHERE id = ?`, [jobId], (err, job) => {
    if (!job) return res.status(404).json({ error: "Job not found" });

    db.run(
      `INSERT INTO applications (job_id, user_id, cgpa, branch, resume_text, state)
       VALUES (?, ?, ?, ?, ?, 'CREATED')`,
      [jobId, user_id, cgpa, branch, resume_text],
      function () {
        const appId = this.lastID;

        const eligibility = checkEligibility(job, { cgpa, branch });
        const toState = eligibility.eligible ? "ELIGIBLE" : "REJECTED";
        const ats = eligibility.eligible ? calculateATS(resume_text) : null;

        db.run(
          `UPDATE applications SET state = ?, ats_score = ?, eligibility_reason = ?
           WHERE id = ?`,
          [toState, ats, eligibility.reason || null, appId]
        );

        db.run(
          `INSERT INTO application_logs
           (application_id, from_state, to_state, reason, timestamp)
           VALUES (?, 'CREATED', ?, ?, DATETIME('now'))`,
          [appId, toState, eligibility.reason || "Eligible"]
        );

        res.json({
          application_id: appId,
          state: toState,
          ats_score: ats
        });
      }
    );
  });
});

/* Transition State */
router.post("/applications/:id/transition", (req, res) => {
  const { to_state } = req.body;
  const id = req.params.id;

  db.get(`SELECT state FROM applications WHERE id = ?`, [id], (err, app) => {
    if (!app) return res.status(404).json({ error: "Application not found" });

    if (!isValidTransition(app.state, to_state)) {
      return res.status(400).json({ error: "Invalid transition" });
    }

    db.run(`UPDATE applications SET state = ? WHERE id = ?`, [to_state, id]);
    db.run(
      `INSERT INTO application_logs
       (application_id, from_state, to_state, timestamp)
       VALUES (?, ?, ?, DATETIME('now'))`,
      [id, app.state, to_state]
    );

    res.json({ message: "State transitioned" });
  });
});

/* Fetch Application */
router.get("/applications/:id", (req, res) => {
  const id = req.params.id;

  db.get(`SELECT * FROM applications WHERE id = ?`, [id], (err, app) => {
    if (!app) return res.status(404).json({ error: "Not found" });

    db.all(
      `SELECT * FROM application_logs WHERE application_id = ?`,
      [id],
      (err, logs) => {
        res.json({
          application: app,
          audit_log: logs
        });
      }
    );
  });
});

module.exports = router;

