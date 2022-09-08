const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const { connect } = require("../src/db/connection.js");
const port = process.env.PORT || 2022;
require("dotenv").config();
const connection = require("../src/db/connection.js");
const { registerPartials } = require("hbs");
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
  let sql = "SELECT * FROM employeedetails";
  let querry = connection.query(sql, (err, rows) => {
    if (err) throw err;

    res.render("index", {
      employeedetails: rows,
    });
  });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const name = req.body.empname;
  const email = req.body.empemail;
  const phonenumber = req.body.empphonenumber;
  try {
    connection.query(
      "INSERT into employeedetails (empname,empemail,empphonenumber) values(?,?,?)",
      [name, email, phonenumber],
      (err, rows) => {
        if (err) throw err;

        res.redirect("/");
      }
    );
  } catch (error) {
    res.send(error);
  }
});

app.get("/edit", (req, res) => {
  const emp_id = req.query.id;

  try {
    connection.query(
      `SELECT * FROM employeedetails WHERE id=${emp_id}`,
      (err, eachRow) => {
        if (err) {
          throw err;
        } else {
          result = JSON.parse(JSON.stringify(eachRow[0]));
          res.render("edit", { result });
        }
      }
    );
  } catch (err) {
    res.send(err);
  }
});

app.post("/update", (req, res) => {
  const id = req.body.id;
  
  console.log("ID = ", id);
  const updateQuery =
    "update employeedetails SET empname='" +
    req.body.empname +
    "',  empemail='" +
    req.body.empemail +
    "',  empphonenumber='" +
    req.body.empphonenumber +
    "' where id =" +
    id;
  console.log(updateQuery);
  try {
    connection.query(updateQuery, (err, rows) => {
      if (err) throw err;

      res.redirect("/");
    });
  } catch (error) {
    res.send(error);
  }
});

app.get("/delete", (req, res) => {
  const emp_id = req.query.id;
  connection.query(
    `DELETE FROM employeedetails WHERE id=${emp_id}`,
    (err, rows) => {
      if (err) {
        // throw err;
        console.log(err);
      } else {
        res.redirect("/");
      }
    }
  );
});

app.get("/", (req, res) => {
  res.send("CRUD Operation With MYSQL Project");
});

app.listen(port, () => {
  console.log(`Server Listing at ${port}`);
});
