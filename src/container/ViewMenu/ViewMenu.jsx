import React, { useEffect, useState } from 'react'

import "./ViewMenu.css";
import { MenuItem, SubHeading } from '../../components';
import { data, images } from '../../constants';
import { Link } from 'react-router-dom';
import axios from 'axios';


const ViewMenu = () => {

    const [meals,setMeal] = useState([])

    useEffect(()=>{
      const fetchAllMeals = async ()=>{
        try{
          const res = await axios.get("http://localhost:3001/menu");
          setMeal(res.data)
        }catch(err){
          console.log(err);
        }
      }
      fetchAllMeals()
    },[])
  
    const handleDelete = async (id) =>{
      try{
        await axios.delete("http://localhost:3001/menu/" + id)
        window.location.reload();
      }catch(err){
        console.log(err);
      }
    }
  

  return (
    <div className="viewmenu">
    <div className="app__bg__wrapper__section__menu">
        <div className="app__wrapper_info">
      <SubHeading title="Our Menu" />
      <h1 className="headtext__cormorant">Where every flavor </h1>
      <h1 className="headtext__cormorant">tells a story</h1>
      {/* <img src={images.shape5} alt="chef_image" /> */}

        </div>
        
    </div>

    <div className="app__specialMenu flex__center section__padding" id="menu">
   {/* <div className="app__specialMenu-title">
    <h1 className="headtext__cormorant">Today's Special</h1>
   </div> */}

   <div className="app__specialMenu-menu">
   <div className="app__specialMenu-menu_wine flex__center">
    <Link to={"/addMeal"} className="app__specialMenu-menu_heading">Add new meal</Link>
  
  <div className="app__viewMenu_menu_items">

  {meals.map(meal=>(
    <div className="viewmenu"  key={meal.idmenu}>
        <div className='meal-page'>
          <img src={meal.cover} alt='' className='img' />

          <div className='meal'>
            <MenuItem title={meal.title} price={meal.price} tags={meal.desc}/>
          </div>
        </div>
          <div className="btn">
          <p className="delete" onClick={()=>handleDelete(meal.idmenu)}>Delete</p>
          <Link className="update-btn" to={`/update/${meal.idmenu}`}><p className="update" > Update</p></Link>
          </div>
    </div>
    ))}
  </div>
  </div>
  </div>
  </div>
</div>
    
  )
}

export default ViewMenu

