const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("database.db");

db.exec(require("fs").readFileSync("schema.sql").toString());

module.exports = db;

