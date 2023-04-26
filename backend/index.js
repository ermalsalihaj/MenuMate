const express = require("express");
const app = express();
const mysql = require("mysql");

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "admin",
    database: "menumate",
  });
  app.get("/", (req, res) => {
    res.send("MenuMate Backend is working!");
  });

  app.listen(3001, () => {
    console.log('Success');
    console.log("Serveri eshte duke funksionuar ne portin 3001");
    
  });