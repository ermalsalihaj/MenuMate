import React from 'react';

import SubHeading from '../SubHeading/SubHeading';
import './Newsletter.css';

const Newsletter = () => (
  <div className="appnewsletter">
    <div className="appnewsletter-heading">
      <SubHeading title="Newsletter" />
      <h1 className="headtextcormorant">Subscribe To Our Newsletter</h1>
      <p className="popensans">And never miss latest Updates!</p>
    </div>
    <div className="appnewsletter-input flexcenter">
      <input type="email" placeholder="Enter your email address" />
      <button type="button" className="custom__button">Subscribe</button>
    </div>
  </div>
);

export default Newsletter;