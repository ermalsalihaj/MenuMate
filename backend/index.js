const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const con = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "admin",
  database: "register",
});

con.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Lidhja me databaz funksionoj!");
});

con.on("error", (err) => {
  console.error("Database error:", err);
});

// Endpoint for updating a user
app.put("/update", (req, res) => {
  const id = req.body.id;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  con.query(
    "UPDATE users SET email = ?, username = ?, password = ? WHERE id = ?",
    [email, username, password, id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: "An error occurred." });
      } else {
        if (result.affectedRows > 0) {
          res.send({ message: "User updated successfully." });
        } else {
          res.send({ message: "User not found." });
        }
      }
    }
  );
});

// Endpoint for deleting a user
app.delete("/delete", (req, res) => {
  const id = req.body.id;

  con.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "An error occurred." });
    } else {
      if (result.affectedRows > 0) {
        res.send({ message: "User deleted successfully." });
      } else {
        res.send({ message: "User not found." });
      }
    }
  });
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  con.query(
    "INSERT INTO users (email,username,password) VALUES (?,?,?)",
    [email, username, password],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: "An error occurred." });
      } else {
        res.send({ message: "User registered successfully." });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  con.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: "An error occurred." });
      } else {
        if (result.length > 0) {
          res.send(result);
        } else {
          res.send({ message: "Wrong username or password." });
        }
      }
    }
  );
});

app.listen(3001, () => {
  console.log("Running on port 3001...");
});