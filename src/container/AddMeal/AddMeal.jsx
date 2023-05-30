import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


const Add = () => {
  const [meal,setmeal] = useState({
    title:"",
    desc:"",
    cover:"",
    price:""
  });

  const navigate = useNavigate();

  const handleChange = (e) =>{
    setmeal((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleClick = async e =>{
    e.preventDefault()
    try{
      await axios.post("http://localhost:3001/menu", meal)
      navigate("/viewMenu");
    }catch(err){
      console.log(err);
    }
  }
  
  return (
    <div className=' app__specialMenu flex__center section__padding'>
    <div className='form-add'>
      <h2 className='app__specialMenu-menu_heading'>Add new meal</h2>
      <input type="text" placeholder='title' onChange={handleChange} name='title' />
      <input type="text" placeholder='desc' onChange={handleChange}  name='desc'/>
      <input type="text" placeholder='price' onChange={handleChange}  name='price'/>
      <input type="text" placeholder='cover' onChange={handleChange}  name='cover'/>

      <button className='formButton' onClick={handleClick}>Add</button>
    </div>
    </div>
  )
}

export default Add