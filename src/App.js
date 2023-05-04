import React from 'react';

import { AboutUs, Chef, FindUs, Footer, Gallery,Login, Header, Intro, Laurels, SpecialMenu,Admin, } from './container';
import { Navbar } from './components';
import './App.css';



const App = () => (
<div>
    <Navbar />
    <Header />
    <AboutUs />
    <SpecialMenu />
    <Login />
    <Admin/>
    {/*<Chef />
    <Intro />
    <Laurels />
    <Gallery />
    <FindUs />
    <Footer /> */}
  </div>
);

export default App;
