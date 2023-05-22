const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// to send any json object
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
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
app.get("/users", (req, res) => {
  con.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "An error occurred." });
    } else {
      res.send(result);
    }
  });
});

app.put("/update", (req, res) => {
  const id = req.query.id;
  const email = req.body.email;
  const username = req.body.username;

  con.query(
    "UPDATE users SET email = ?, username = ? WHERE id = ?",
    [email, username, id],
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

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

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
          const token = jwt.sign({ idusers: result[0].idusers }, "jwtkey");
          const { password, ...others } = result[0];

          res
            .cookie("accessToken", token, {
              httpOnly: true,
            })
            .status(200)
            .json(others);
          // res.send(result);
        } else {
          res.send({ message: "Wrong username or password." });
        }
      }
    }
  );
});

app.post("/logout", (req, res) => {
  res.clearCookie("accessToken").status(200).json("User has been logged out");
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json("Token not found!");
  } else {
    jwt.verify(token, "jwtkey", (err, decoded) => {
      if (err) {
        return res.status(401).json("Authentication Error");
        // return res.json({Message: "Authentication Error"})
      } else {
        req.username = decoded.username;
        next();
      }
    });
  }
};

app.get("/", verifyUser, (req, res) => {
  return res.json({ username: req.username });
});

app.listen(3001, () => {
  console.log("Running on port 3001...");
});
