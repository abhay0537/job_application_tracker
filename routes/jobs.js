const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: "Request body missing" });
  }

  const { title, min_cgpa, allowed_branches } = req.body;

  if (!title || !min_cgpa || !allowed_branches) {
    return res.status(400).json({
      error: "title, min_cgpa, allowed_branches are required",
    });
  }

  db.run(
    `INSERT INTO jobs (title, min_cgpa, allowed_branches)
     VALUES (?, ?, ?)`,
    [title, min_cgpa, allowed_branches.join(",")],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ job_id: this.lastID });
    }
  );
});

module.exports = router;
