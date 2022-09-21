const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

const conection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
});

conection.connect((error) => {
  if (error) throw error;

  console.log("The Database Sucessfully Connected.");
});

module.exports = conection;