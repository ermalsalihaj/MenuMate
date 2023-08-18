import React from "react";
import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";

import { FooterOverlay, Newsletter } from "../../components";
import { images } from "../../constants";
import "./Footer.css";

const Footer = () => (
  <div className="appfooter sectionpadding" id="login">
    <FooterOverlay />
    <Newsletter />

    <div className="appfooter-links">
      <div className="appfooter-links_contact">
        <h1 className="appfooter-headtext">Contact Us</h1>
        <p className="popensans">9 W 53rd St, New York, NY 10019, USA</p>
        <p className="popensans">+1 212-344-1230</p>
        <p className="popensans">+1 212-555-1230</p>
      </div>

      <div className="appfooter-links_logo">
        <p className="popensans">
          &quot;The best way to find yourself is to lose yourself in the service
          of others.&quot;
        </p>
        <img
          src={images.spoon}
          className="spoonimg"
          style={{ marginTop: 15 }}
          alt=""
        />
        <div className="appfooter-links_icons">
          <FiFacebook />
          <FiTwitter />
          <FiInstagram />
        </div>
      </div>

      <div className="appfooter-links_work">
        <h1 className="appfooter-headtext">Working Hours</h1>
        <p className="popensans">Monday-Friday:</p>
        <p className="popensans">08:00 am - 12:00 am</p>
        <p className="popensans">Saturday-Sunday:</p>
        <p className="popensans">07:00 am - 11:00 pm</p>
      </div>
    </div>

    <div className="footercopyright">
      <p className="popensans">2023 MenuMate. All Rights reserved.</p>
    </div>
  </div>
);

export default Footer;
