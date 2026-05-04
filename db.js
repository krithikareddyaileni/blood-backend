const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "bloodbank"
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB Connection Error:", err);
    return;
  }
  console.log("✅ MySQL Connected");
});

module.exports = db;