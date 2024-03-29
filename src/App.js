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
import AddPizza from "./container/AddMeal/AddPizza";
import Inventory from "./container/Inventory/Inventory";
import UpdateDrink from "./container/Update/UpdateDrink";
import UpdateTable from "./container/Update/UpdateTable";
import UpdatePizza from "./container/Update/UpdatePizza";

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
        <Route path="/updateDrink/:iddrinks" element={<UpdateDrink />} />
        <Route path="/updatePizza/:idpizza" element={<UpdatePizza />} />
        <Route path="/update/:idmenu" element={<Update />} />
        <Route path="/updateTable/:id" element={<UpdateTable />} />
        <Route path="/addMeal" element={<AddMeal />} />
        <Route path="/addTable" element={<AddTable />} />
        <Route path="/addDrink" element={<AddDrink />} />
        <Route path="/addPizza" element={<AddPizza />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </Router>
  );
};

export default App;
