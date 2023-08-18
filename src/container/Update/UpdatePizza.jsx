import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Update.css";

const UpdatePizza = () => {
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

  const [pizza, setpizza] = useState({
    name: "",
    ingredients: "",
    price: "",
    cover: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [meal, setMeal] = useState(null);

  const { idpizza } = useParams();

  const pizzaId = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await axios.get("http://localhost:3001/pizza/");
        setMeal(response.data[idpizza - 1]);
        console.log(response.data[idpizza - 1]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMeal();
  }, []);

  useEffect(() => {
    if (meal) {
      setpizza(meal);
      console.log(meal);
    }
  }, [meal]);

  const handleChange = (e) => {
    setpizza((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:3001/pizza/" + pizzaId, pizza);
      navigate("/viewMenu");
      console.log(pizza);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className=" app__specialMenu flex__center section__padding  ">
      {auth && role === "admin" ? (
        <div className="form-update">
          <h2 className="app__specialMenu-menu_heading">Update pizza</h2>

          <input
            type="text"
            placeholder="name"
            onChange={handleChange}
            name="name"
            value={pizza.name}
          />
          <input
            type="text"
            placeholder="ingredients"
            onChange={handleChange}
            name="ingredients"
            value={pizza.ingredients}
          />
          <input
            type="text"
            placeholder="price"
            onChange={handleChange}
            name="price"
            value={pizza.price}
          />
          <input
            type="text"
            placeholder="cover"
            onChange={handleChange}
            name="cover"
            value={pizza.cover}
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
export default UpdatePizza;
