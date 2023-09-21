const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { DateTime } = require("luxon");

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

/////////////////////  USERS  //////////////////////////////////
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
app.post("/register", (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const role = "user";

  con.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: "An error occurred." });
      } else {
        if (result.length > 0) {
          res.send({ message: "Username already taken." });
        } else {
          con.query(
            "INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, ?)",
            [email, username, password, role],
            (err, result) => {
              if (err) {
                console.log(err);
                res.status(500).send({ message: "An error occurred." });
              } else {
                res.send({ message: "User registered successfully." });
              }
            }
          );
        }
      }
    }
  );
});

app.put("/update/:id", (req, res) => {
  const id = req.params.id;
  const { email, username } = req.body;

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

/////////////////////  MENU  //////////////////////////////////

app.get("/menu", (req, res) => {
  const q = `
    SELECT
      m.idmenu,
      m.title,
      m.price,
      m.cover,
      s.id,
      s.itemname,
      s.unit,
      s.cost,
      s.available,
      s.itemid
    FROM
      menu m
      LEFT JOIN menu_stock ms ON m.idmenu = ms.idmenu
      inner JOIN stock s ON ms.idstock = s.id
    ORDER BY
      m.idmenu
  `;

  con.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ message: "An error occurred." });
    }

    const menuItemsWithIngredients = [];
    let currentMenuId = null;
    let currentItem = null;

    for (const row of data) {
      if (row.idmenu !== currentMenuId) {
        // If new menu item, create a new item object
        currentMenuId = row.idmenu;
        currentItem = {
          idmenu: row.idmenu,
          title: row.title,
          price: row.price,
          cover: row.cover,
          ingredients: [],
        };
        menuItemsWithIngredients.push(currentItem);
      }

      // Add ingredient to the current ingredients array
      if (row.id !== null) {
        const ingredient = {
          id: row.id,
          itemname: row.itemname,
          unit: row.unit,
          cost: row.cost,
          available: row.available,
          itemid: row.itemid,
        };
        currentItem.ingredients.push(ingredient);
      }
    }

    res.json(menuItemsWithIngredients);
  });
});

app.post("/menu", (req, res) => {
  const mealData = {
    title: req.body.title,
    price: req.body.price,
    cover: req.body.cover,
  };

  const ingredientIds = req.body.ingredients;

  const q = "INSERT INTO menu (title, price, cover) VALUES (?, ?, ?)";
  const values = [mealData.title, mealData.price, mealData.cover];

  con.query(q, values, (err, result) => {
    if (err) return res.json(err);

    const mealId = result.insertId;
    const insertIngredientsQuery =
      "INSERT INTO menu_stock (idmenu, idstock) VALUES ?";
    const ingredientRows = ingredientIds.map((idstock) => [mealId, idstock]);

    con.query(insertIngredientsQuery, [ingredientRows], (err) => {
      if (err) return res.json(err);
      return res.json("Meal and ingredients added successfully.");
    });
  });
});

app.delete("/menu/:idmenu", (req, res) => {
  const idmenu = req.params.idmenu;
  const q = "DELETE FROM menu where idmenu = ?";
  const menuStock = "DELETE FROM menu_stock WHERE idmenu = ?";

  con.query(menuStock, [idmenu], (err) => {
    if (err) return res.json(err);

    con.query(q, [idmenu], (err, data) => {
      if (err) return res.json(err);
      return res.json("Meal deleted successfully.");
    });
  });
});

app.put("/viewMenu/:idmenu", (req, res) => {
  const idmenu = req.params.idmenu;
  const q =
    "UPDATE menu SET `title` = ?, `price` = ?, `cover` = ? WHERE idmenu = ? ";

  const values = [req.body.title, req.body.price, req.body.cover];

  values.push(idmenu);
  const newIngredientIds = req.body.ingredients;

  con.query(q, values, async (err, data) => {
    if (err) return res.json(err);

    try {
      // Insert new ingredient associations into menu_stock
      const insertIngredientsQuery =
        "INSERT INTO menu_stock (idmenu, idstock) VALUES ?";
      const newIngredientRows = newIngredientIds.map((idstock) => [
        idmenu,
        idstock,
      ]);

      await con.query(insertIngredientsQuery, [newIngredientRows]);
      console.log(newIngredientRows);
      return res.json("Meal updated successfully with new ingredients.");
    } catch (error) {
      return res.json(error);
    }
  });
});

app.get("/drinks", (req, res) => {
  const q = "SELECT * FROM drinks";
  con.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/drinks", (req, res) => {
  const q =
    "Insert into drinks (`name`,`ingredients`,`price`,`cover`) VALUES(?)";
  const VALUES = [
    req.body.name,
    req.body.ingredients,
    req.body.price,
    req.body.cover,
  ];

  con.query(q, [VALUES], (err, data) => {
    if (err) return res.json(err);
    return res.json("Drink created successfully.");
  });
});

app.delete("/drinks/:iddrinks", (req, res) => {
  const iddrinks = req.params.iddrinks;
  const q = "DELETE FROM drinks where iddrinks = ?";

  con.query(q, [iddrinks], (err, data) => {
    if (err) return res.json(err);
    return res.json("Drink deleted successfully.");
  });
});

app.put("/drinks/:iddrinks", (req, res) => {
  const iddrinks = req.params.iddrinks;
  const q =
    "UPDATE drinks SET `name` = ?, `ingredients` = ?, `price` = ?, `cover` = ? WHERE iddrinks = ? ";

  const values = [
    req.body.name,
    req.body.ingredients,
    req.body.price,
    req.body.cover,
    iddrinks,
  ];

  con.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json("Drink updated successfully.");
  });
});

///////////////////// /////////////////
app.get("/pizza", (req, res) => {
  const q = "SELECT * FROM pizza";
  con.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/pizza", (req, res) => {
  const q =
    "Insert into pizza (`name`,`ingredients`,`price`,`cover`) VALUES(?)";
  const VALUES = [
    req.body.name,
    req.body.ingredients,
    req.body.price,
    req.body.cover,
  ];

  con.query(q, [VALUES], (err, data) => {
    if (err) return res.json(err);
    return res.json("Pizza created successfully.");
  });
});

app.delete("/pizza/:idpizza", (req, res) => {
  const idpizza = req.params.idpizza;
  const q = "DELETE FROM pizza where idpizza = ?";

  con.query(q, [idpizza], (err, data) => {
    if (err) return res.json(err);
    return res.json("Pizza deleted successfully.");
  });
});

app.put("/pizza/:idpizza", (req, res) => {
  const idpizza = req.params.idpizza;
  const q =
    "UPDATE pizza SET `name` = ?, `ingredients` = ?, `price` = ?, `cover` = ? WHERE idpizza = ? ";

  const values = [
    req.body.name,
    req.body.ingredients,
    req.body.price,
    req.body.cover,
    idpizza,
  ];

  con.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json("Pizza updated successfully.");
  });
});

/////////////////////  INVENTORY  //////////////////////////////////

app.get("/stock", (req, res) => {
  const q = "SELECT * FROM stock";
  con.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/ingredients", (req, res) => {
  const q = "SELECT * FROM stock";
  con.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.delete("/stock/:id", (req, res) => {
  const stockId = req.params.id;
  const q = "DELETE FROM stock WHERE id = ?";
  con.query(q, stockId, (err, result) => {
    if (err) return res.json(err);
    if (result.affectedRows === 0) {
      return res.json({ message: "Stock item not found." });
    }
    return res.json({ message: "Stock item deleted successfully." });
  });
});

app.post("/menu/:idmenu/stock/:idstock", (req, res) => {
  const idmenu = req.params.idmenu;
  const idstock = req.params.idstock;

  const q = "INSERT INTO menu_stock (idmenu, idstock) VALUES (?, ?)";

  con.query(q, [idmenu, idstock], (err, data) => {
    if (err) return res.json(err);
    return res.json("Ingredient added to menu successfully.");
  });
});

app.get("/register", (req, res) => {
  const q = "SELECT * FROM stock s inner join wastage w on s.id=w.idstock ";
  con.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

/////////////////////  RESERVATIONS  //////////////////////////////////

app.get("/reservations", (req, res) => {
  con.query(
    "SELECT * FROM reservations r inner join users u on u.id=r.userid",
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: "An error occurred." });
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/reservations", (req, res) => {
  const { name, phoneNumber, email, idtable, userid } = req.body;

  con.query(
    "INSERT INTO reservations (name, phoneNumber, email, idtable, userid) VALUES (?, ?, ?, ?, ?)",
    [name, phoneNumber, email, idtable, userid],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: "An error occurred." });
      }

      const updateTableQuery =
        "UPDATE booktable SET isReserved = true WHERE id = ?";
      con.query(updateTableQuery, [idtable], (err, updateResult) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ message: "An error occurred." });
        }

        if (updateResult.affectedRows > 0) {
          return res.send({ message: "Reservation created successfully." });
        } else {
          return res.send({ message: "Table not found." });
        }
      });
    }
  );
});

app.get("/reservations/:id", (req, res) => {
  const id = req.params.id;

  con.query(
    "SELECT * FROM reservations WHERE idreservations = ?",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: "An error occurred." });
      } else {
        if (result.length > 0) {
          res.send(result[0]);
        } else {
          res.send({ message: "Reservation not found." });
        }
      }
    }
  );
});

app.put("/reservations/:id", (req, res) => {
  const id = req.params.id;
  const { name, phoneNumber, email } = req.body;

  con.query(
    "UPDATE reservations SET name = ?, phoneNumber = ?, email = ? WHERE idreservations = ?",
    [name, phoneNumber, email, id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: "An error occurred." });
      } else {
        if (result.affectedRows > 0) {
          res.send({ message: "Reservation updated successfully." });
        } else {
          res.send({ message: "Reservation not found." });
        }
      }
    }
  );
});

app.delete("/reservations/:id", (req, res) => {
  const id = req.params.id;

  con.query(
    "DELETE FROM reservations WHERE idreservations = ?",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: "An error occurred." });
      } else {
        if (result.affectedRows > 0) {
          res.send({ message: "Reservation deleted successfully." });
        } else {
          res.send({ message: "Reservation not found." });
        }
      }
    }
  );
});

/////////////////////  TABLE BOOKING  //////////////////////////////////

app.get("/booktable", (req, res) => {
  const q = "SELECT * FROM booktable";
  con.query(q, (err, data) => {
    if (err) return res.json(err);

    const tablesWithStatus = data.map((table) => ({
      ...table,
      isReserved: table.isReserved === 1, // Convert 0/1 to true/false
    }));

    return res.json(tablesWithStatus);
  });
});

app.post("/booktable", (req, res) => {
  const q =
    "Insert into booktable (`date`,`time`,`location`,`tablesize`) VALUES(?)";
  const VALUES = [
    DateTime.fromISO(req.body.date, { zone: "Europe/Belgrade" })
      .plus({ days: 1 })
      .toISODate(),
    req.body.time,
    req.body.location,
    req.body.tablesize,
  ];

  con.query(q, [VALUES], (err, data) => {
    if (err) return res.json(err);
    return res.json("Table created successfully.");
  });
});

app.delete("/booktable/:id", (req, res) => {
  const id = req.params.id;
  const q = "DELETE FROM booktable where id = ?";

  con.query(q, [id], (err, data) => {
    if (err) return res.json(err);
    return res.json("Table deleted successfully.");
  });
});

app.put("/booktable/:id", (req, res) => {
  const id = req.params.id;
  const q =
    "UPDATE booktable SET `date` = ?, `time` = ?, `location` = ?, `tablesize` = ? WHERE id = ? ";

  const values = [
    DateTime.fromISO(req.body.date, { zone: "Europe/Belgrade" })
      .plus({ days: 1 })
      .toISODate(),
    req.body.time,
    req.body.location,
    req.body.tablesize,
  ];

  values.push(id);

  con.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json("Table updated successfully.");
  });
});

/////////////////////  AUTHENTICATION LOG IN/LOG OUT  //////////////////////////////////

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
            { idusers: result[0].id, role: result[0].role },
            "jwtkey"
          );
          const { password, ...others } = result[0];
          const role = result[0].role;

          if (result[0].role === "admin") {
            console.log("Admin logged in:", result[0].username);
          }

          if (result[0].role === "user") {
            console.log("User logged in:", result[0].username);
          }

          res
            .cookie("accessToken", token, {
              httpOnly: true,
            })
            .status(200)
            .json({ ...others, role });
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
    res.status(200).json({ message: "Access granted. Logged in as Admin." });
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

//////////////////////////// BOOKTABLE TIME /////////////////////////////////////
app.get("/booktable/time", (req, res) => {
  con.query("SELECT * FROM booktime", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "An error occurred." });
    } else {
      const timeOptions = result.map((row) => row.time);
      res.json(timeOptions);
    }
  });
});
/////////////////////////// BOOKTABLE LOCATION /////////////////////////////////
app.get("/booktable/location", (req, res) => {
  con.query("SELECT * FROM booklocation", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "An error occurred." });
    } else {
      const locationOptions = result.map((row) => row.location);
      res.json(locationOptions);
    }
  });
});
////////////////////////////// BOOKTABLE TABLESIZE //////////////////////////
app.get("/booktable/size", (req, res) => {
  con.query("SELECT * FROM booksize", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "An error occurred." });
    } else {
      const sizeOptions = result.map((row) => row.size);
      res.json(sizeOptions);
    }
  });
});
