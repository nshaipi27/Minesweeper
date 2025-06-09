const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

function connectTestDatabase() {
  const db = new Database(":memory:");
  db.exec("PRAGMA foreign_keys = ON;");

  const sqlFilePath = path.join(__dirname, "sql", "create_tables.sql");
  const sql = fs.readFileSync(sqlFilePath, "utf8");
  db.exec(sql);

 // console.log("In-memory test database initialized.");
  return db;
}

module.exports = { connectTestDatabase };
