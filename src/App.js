import React, { createContext, useState, useContext, useEffect } from "react";
import axios from 'axios';
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

const USER_TYPES = {
  USER: "User",
  ADMIN: "Admin",
};

const currentUserType = USER_TYPES.ADMIN;

const App = () => {
  // const [currentUserType, setCurrentUserType] = useState(USER_TYPES.USER);

  // const login = async (username, password) => {
  //   try {
  //     const response = await axios.post('http://localhost:3001/login', {
  //       username: username,
  //       password: password
  //     });
  
  //     const { role } = response.data;
  //     if (role === "admin") {
  //       setCurrentUserType(USER_TYPES.ADMIN);
  //       console.log("Logged in as Admin.");
  //     } else if (role === "user") {
  //       setCurrentUserType(USER_TYPES.USER);
  //       console.log("Logged in as User.");
  //     }
  //   } catch (error) {
  //     console.error('Login failed:', error);
  //   }
  // };
  return (
    // <UserContext.Provider value={currentUserType}>
      
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <PublicElement>
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
              </PublicElement>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/booktable" element={<BookTable />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route
            path="/admin"
            element={
              <AdminElement>
                <Admin />
              </AdminElement>
            }
          />
          <Route path="/viewMenu" element={<ViewMenu />} />
          <Route path="/update/:idmenu" element={<Update />} />
          <Route
            path="/addMeal"
            element={
              <AdminElement>
                <AddMeal />
              </AdminElement>
            }
          />
          <Route
            path="/addTable"
            element={
              <AdminElement>
                <AddTable />
              </AdminElement>
            }
          />
        </Routes>
      </Router>
    // </UserContext.Provider>
  );
};

function PublicElement({ children }) {
  return <>{children}</>;
}

function AdminElement({ children }) {
  // const currentUserType = useContext(UserContext);

  if (currentUserType === USER_TYPES.ADMIN) {
    return <>{children}</>;
  } else {
    return <div>You don't have access here</div>;
  }
}

export default App;
