import React from "react";
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

const App = () => (
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
      <Route path="/confirmation" element={<Confirmation />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/viewMenu" element={<ViewMenu />} />
      <Route path="/update/:idmenu" element={<Update />} />
     
      <Route path="/addMeal" element={<AddMeal />} />
      <Route path="/addTable" element={<AddTable />} />

    </Routes>
  </Router>
);




export default App;





