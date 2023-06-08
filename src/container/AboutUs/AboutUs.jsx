import React from 'react';

import { images } from '../../constants';
import './AboutUs.css';

const AboutUs = () => (
  <div className="app__aboutus app__bg flex__center section__padding" id="about">
   <div className="app__aboutus-overlay flex__center">
   </div>

   <div className="app__aboutus-content flex__center">
    <div className="app__aboutus-content__about">
      <h1 className="headtext__cormorant">About Us</h1>
      <img src={images.spoon} alt="about_spoon" className="spoon__img"/>
      <p className="p__opensans">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ac nulla sit amet nibh interdum eleifend. Fusce ut elit commodo, gravida lorem et, iaculis ante.</p>
      <button type="button" className="custom__button">Know More</button>
    </div>

    <div className="app__aboutus-content_knife flex__center">
    <img src={images.knife} alt="about_knife" style= {{height: "650px"}}/>
    </div>

    <div className="app__aboutus-content__history">
      <h1 className="headtext__cormorant">Our History</h1>
      <img src={images.spoon} alt="about_spoon" className="spoon__img"/>
      <p className="p__opensans">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ac nulla sit amet nibh interdum eleifend. Fusce ut elit commodo, gravida lorem et, iaculis ante.</p>
      <button type="button" className="custom__button">Know More</button>
    </div>

   </div>
  </div>
);

export default AboutUs;
