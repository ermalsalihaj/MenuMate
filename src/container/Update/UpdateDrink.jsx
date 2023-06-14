import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Update.css";

const UpdateDrink = () => {
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

  const [drink, setdrink] = useState({
    name: "",
    ingredients: "",
    price: "",
    cover: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [meal, setMeal] = useState(null);

  const { iddrinks } = useParams();

  const drinksId = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await axios.get("http://localhost:3001/drinks/");
        setMeal(response.data[iddrinks - 1]);
        console.log(response.data[iddrinks - 1]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMeal();
  }, []);

  useEffect(() => {
    if (meal) {
      setdrink(meal);
      console.log(meal);
    }
  }, [meal]);

  const handleChange = (e) => {
    setdrink((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:3001/drinks/" + drinksId, drink);
      navigate("/viewMenu");
      console.log(drink);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className=" app__specialMenu flex__center section__padding  ">
      {auth && role === "admin" ? (
        <div className="form-update">
          <h2 className="app__specialMenu-menu_heading">Update Drink</h2>

          <input
            type="text"
            placeholder="name"
            onChange={handleChange}
            name="name"
            value={drink.name}
          />
          <input
            type="text"
            placeholder="ingredients"
            onChange={handleChange}
            name="ingredients"
            value={drink.ingredients}
          />
          <input
            type="text"
            placeholder="price"
            onChange={handleChange}
            name="price"
            value={drink.price}
          />
          <input
            type="text"
            placeholder="cover"
            onChange={handleChange}
            name="cover"
            value={drink.cover}
          />

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
export default UpdateDrink;
