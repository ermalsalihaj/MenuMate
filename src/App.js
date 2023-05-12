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
  Intro,
  Laurels,
  SpecialMenu,
  Admin,
} from "./container";
import { Navbar } from "./components";
import "./App.css";

const App = () => (
  <Router>
    <Routes>
    <Route path="/" element={
  <React.Fragment>
    <Navbar />
    <Header />
    <AboutUs />
    <SpecialMenu />
    <Chef />
    {/* <Intro /> */}
    <Laurels />
    {/* <Gallery /> */}
    {/* <FindUs /> */}
    {/* <Footer />  */}
    
  </React.Fragment>
} />
  <Route path="/login" element={<Login />}/>
  


    </Routes>
  </Router>
);

export default App;
