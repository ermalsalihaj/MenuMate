import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Add = () => { 
  const role = localStorage.getItem("role");
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        await axios.get("http://localhost:3001/", {
          withCredentials: true,
        });
        setAuth(true);
      } catch (err) {
        setAuth(false);
      }
    };
    verify();
  }, []);

  const [meal, setMeal] = useState({
    title: "",
    description: "",
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
      !meal.description.trim() ||
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
      { auth && role === "admin" ? (
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
            placeholder="description"
            onChange={handleChange}
            name="description"
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
      ) : (
        <div>
          <h1>You Do Not Have Access To This Page</h1>
        </div>
      )}
    </div>
  );
};

export default Add;
