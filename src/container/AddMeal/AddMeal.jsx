import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [meal, setMeal] = useState({
    title: "",
    desc: "",
    cover: "",
    price: "",
  });
  const [formError, setFormError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setMeal((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (
      !meal.title.trim() ||
      !meal.desc.trim() ||
      !meal.cover.trim() ||
      !meal.price.trim()
    ) {
      setFormError(true);
      return;
    }

    try {
      await axios.post("http://localhost:3001/menu", meal);
      navigate("/viewMenu");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="app__bg app__specialMenu flex__center section__padding">
      <div className="form-add">
        <h2 className="app__specialMenu-menu_heading">Add new meal</h2>
        <input
          type="text"
          placeholder="Title"
          onChange={handleChange}
          name="title"
        />
        <input
          type="text"
          placeholder="Desc"
          onChange={handleChange}
          name="desc"
        />
        <input
          type="text"
          placeholder="Price"
          onChange={handleChange}
          name="price"
        />
        <input
          type="text"
          placeholder="Cover"
          onChange={handleChange}
          name="cover"
        />

        {formError && (
          <p className="error-message">Please fill in all fields.</p>
        )}

        <button className="formButton" onClick={handleClick}>
          Add
        </button>
      </div>
    </div>
  );
};

export default Add;
