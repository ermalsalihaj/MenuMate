import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  AboutUs,
  Chef,
  FindUs,
  Footer,
  Gallery,
  Login,
  Header,
  Laurels,
  SpecialMenu,
  Admin,
  BookTable,
  Confirmation,
} from "./container";
import { Navbar } from "./components";
import "./App.css";
import ViewMenu from "./container/ViewMenu/ViewMenu";
import Update from "./container/Update/Update";
import AddMeal from "./container/AddMeal/AddMeal";
import AddTable from "./container/AddTable/AddTable";
import AddDrink from "./container/AddDrink/AddDrink";
import Inventory from "./container/Inventory/Inventory";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <React.Fragment>
              <Navbar />
              <Header />
              <AboutUs />
              <SpecialMenu />
              <Chef />
              <Laurels />
              <Gallery />
              <FindUs />
              <Footer />
            </React.Fragment>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/booktable" element={<BookTable />} />
        <Route path="/confirmation/:id" element={<Confirmation />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/viewMenu" element={<ViewMenu />} />
        <Route path="/update/:idmenu" element={<Update />} />
        <Route path="/addMeal" element={<AddMeal />} />
        <Route path="/addTable" element={<AddTable />} />
        <Route path="/addDrink" element={<AddDrink />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </Router>
  );
};

export default App;
