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
    </Routes>
  </Router>
);




export default App;





