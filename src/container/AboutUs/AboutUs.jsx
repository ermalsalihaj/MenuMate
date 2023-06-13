import React from "react";

import { images } from "../../constants";
import "./AboutUs.css";

const AboutUs = () => (
  <div
    className="app__aboutus app__bg flex__center section__padding"
    id="about"
  >
    <div className="app__aboutus-overlay flex__center"></div>

    <div className="app__aboutus-content flex__center">
      <div className="app__aboutus-content__about">
        <h1 className="headtext__cormorant">About Us</h1>
        <img src={images.spoon} alt="about_spoon" className="spoon__img" />
        <p className="p__opensans">
          {" "}
          Introducing MenuMate, your ultimate dining companion. Explore our
          diverse menu, curated by talented chefs using only the freshest
          ingredients. Join us for an unforgettable dining experience with
          exceptional flavors and impeccable service.
        </p>
      </div>

      <div className="app__aboutus-content_knife flex__center">
        <img src={images.knife} alt="about_knife" style={{ height: "650px" }} />
      </div>

      <div className="app__aboutus-content__history">
        <h1 className="headtext__cormorant">Our History</h1>
        <img src={images.spoon} alt="about_spoon" className="spoon__img" />
        <p className="p__opensans">
          MenuMate, born from a passion for exceptional dining, has a rich
          history of delighting food enthusiasts. From humble beginnings, we
          have grown into a beloved destination, focusing on quality
          ingredients, skilled chefs, and a diverse menu.{" "}
        </p>
      </div>
    </div>
  </div>
);

export default AboutUs;
