import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AddDrink = () => {
    const [drink, setDrink] = useState({
        name: "",
        ingredients: "",
        cover: "",
        price: ""
      });
      const [formError, setFormError] = useState(false); 
      const navigate = useNavigate();
    
      const handleChange = (e) => {
        setDrink((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      }
    
      const handleClick = async (e) => {
        e.preventDefault();
    
       
        if (!drink.name.trim() || !drink.ingredients.trim() || !drink.cover.trim() || !drink.price.trim()) {
          setFormError(true);
          return; 
        }
    
        try {
          await axios.post("http://localhost:3001/drinks", drink);
          navigate("/viewMenu");
        } catch (err) {
          console.log(err);
        }
      }
    
      return (
        <div className="app__bg app__specialMenu flex__center section__padding">
          <div className='form-add'>
            <h2 className='app__specialMenu-menu_heading'>Add new drink</h2>
            <input type="text" placeholder='name' onChange={handleChange} name='name' />
            <input type="text" placeholder='ingredients' onChange={handleChange} name='ingredients' />
            <input type="text" placeholder='Price' onChange={handleChange} name='price' />
            <input type="text" placeholder='Cover' onChange={handleChange} name='cover' />
    
            {formError && <p className="error-message">Please fill in all fields.</p>}
    
            <button className='formButton' onClick={handleClick}>Add</button>
          </div>
        </div>
      );
}


export default AddDrink