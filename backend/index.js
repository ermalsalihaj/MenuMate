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

// Get database
app.get("/menu", (req, res) => {
  const q = "SELECT * FROM menu";
  con.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Insert database
app.post("/menu", (req, res) => {
  const q = "Insert into menu (`title`,`desc`,`price`,`cover`) VALUES(?)";
  const VALUES = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  con.query(q, [VALUES], (err, data) => {
    if (err) return res.json(err);
    return res.json("Meal created successfully.");
  });
});

// Delete database
app.delete("/menu/:idmenu", (req, res) => {
  const idmenu = req.params.idmenu;
  const q = "DELETE FROM menu where idmenu = ?";

  con.query(q, [idmenu], (err, data) => {
    if (err) return res.json(err);
    return res.json("Meal deleted successfully.");
  });
});

// Update database
app.put("/viewMenu/:idmenu", (req, res) => {
  const idmenu = req.params.idmenu;
  const q =
    "UPDATE menu SET `title` = ?, `desc` = ?, `price` = ?, `cover` = ? WHERE idmenu = ? ";

  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  values.push(idmenu);

  con.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json("Meal updated successfully.");
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
          const token = jwt.sign(
            { idusers: result[0].idusers, role: result[0].role },
            "jwtkey"
          );
          const { password, ...others } = result[0];

          res
            .cookie("accessToken", token, {
              httpOnly: true,
            })
            .status(200)
            .json(others);
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
      } else {
        req.username = decoded.username;
        req.role = decoded.role;
        next();
      }
    });
  }
};
app.get("/admin", verifyUser, (req, res) => {
  if (req.role === "admin") {
    res.redirect("/admin");
  } else {
    res.status(403).json({ message: "Access denied. Admin role required." });
  }
});
app.get("/", verifyUser, (req, res) => {
  return res.json({ username: req.username });
});
app.listen(3001, () => {
  console.log("Running on port 3001...");
});
