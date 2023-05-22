import React, { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import axios from "axios";

import "./Navbar.css";
import images from "../../constants/images";

const Navbar = () => {

  const [auth,setAuth] = useState(false);
  const [name,setName] = useState('');
  const [toggleMenu, setToggleMenu] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get("http://localhost:3001/", {
          withCredentials: true, 
        });
        setAuth(true);
        setName(res.data.name);
      } catch (err) {
        setAuth(false);
      }
    };
    verify();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3001/logout", null, {
        withCredentials: true,
      });
      setAuth(false);
      setName('');
    } catch (err) {
      console.log(err.response.data);
    }
  };

  return (
    <nav className="app__navbar">
      <div className="app__navbar-logo">
        <img src={images.menumate} alt="app logo" />
      </div>

      <ul className="app__navbar-links">
        <li className="p__opensans">
          {" "}
          <a href="#home">Home</a>{" "}
        </li>
        <li className="p__opensans">
          {" "}
          <a href="#about">About</a>{" "}
        </li>
        <li className="p__opensans">
          {" "}
          <a href="#menu">Menu</a>{" "}
        </li>
        <li className="p__opensans">
          {" "}
          <a href="#awards">Awards</a>{" "}
        </li>
        <li className="p__opensans">
          {" "}
          <a href="#contact">Contact</a>
        </li>
      </ul>

      <div className="app__navbar-login">
        {
          auth?
        <a href=" " onClick={handleLogout} className='p__opensans'>
           Logout
        </a>
        :
        <li>
          <Link to="/login" className="p__opensans">
            Log In / Register
          </Link>
        </li>
        }

        <div></div>
        <li>
          <Link to="/booktable" className="p__opensans">
            Book Table
          </Link>
        </li>
      </div>

      <div className="app__navbar-smallscreen">
        <GiHamburgerMenu
          color="#fff"
          fontSize={27}
          onClick={() => setToggleMenu(true)}
        />
        {toggleMenu && (
          <div className="app__navbar-smallscreen_overlay flex__center slide-bottom">
            <MdOutlineRestaurantMenu
              fontSize={27}
              className="overlay__close"
              onClick={() => setToggleMenu(false)}
            />
            <ul className="app__navbar-smallscreen_links">
              <li className="p__opensans">
                {" "}
                <a href="#home">Home</a>{" "}
              </li>
              <li className="p__opensans">
                {" "}
                <a href="#about">About</a>{" "}
              </li>
              <li className="p__opensans">
                {" "}
                <a href="#menu">Menu</a>{" "}
              </li>
              <li className="p__opensans">
                {" "}
                <a href="#awards">Awards</a>{" "}
              </li>
              <li className="p__opensans">
                {" "}
                <a href="#contact">Contact</a>{" "}
              </li>
            </ul>
          </div>
        )}
        ;
      </div>
    </nav>
  );
};

export default Navbar;
