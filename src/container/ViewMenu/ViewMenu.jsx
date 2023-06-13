import React, { useEffect, useState } from "react";

import "./ViewMenu.css";
import { MenuItem, SubHeading } from "../../components";
import { data, images } from "../../constants";
import { Link } from "react-router-dom";
import axios from "axios";

const ViewMenu = () => {
  const [meals, setMeal] = useState([]);
  const [drinks, setDrink] = useState([]);
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

  useEffect(() => {
    const fetchAllMeals = async () => {
      try {
        const res = await axios.get("http://localhost:3001/menu");
        setMeal(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllMeals();
  }, []);

  useEffect(() => {
    const fetchAllDrinks = async () => {
      try {
        const res = await axios.get("http://localhost:3001/drinks");
        setDrink(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllDrinks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete("http://localhost:3001/menu/" + id);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteDrink = async (iddrinks) => {
    try {
      await axios.delete("http://localhost:3001/drinks/" + iddrinks);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="viewmenu">
      <div className="app__bg__wrapper__section__menu">
        <div className="app__wrapper_info">
          <SubHeading title="Our Menu" />
          <h1 className="headtext__cormorant">Where every flavor </h1>
          <h1 className="headtext__cormorant">tells a story</h1>
          {/* <img src={images.drink1} alt="chef_image" /> */}
        </div>
      </div>

      <div className="app__specialMenu flex__center section__padding" id="menu">
        <div className="app__specialMenu-title">
          <h1 className="headtext__cormorant">Our Specialities</h1>
        </div>

        <div className="app__specialMenu-menu">
          <div className="app__specialMenu-menu_wine flex__center">
            {auth && role === "admin" && (
              <Link to={"/addMeal"} className="app__specialMenu-menu_heading">
                Add new meal
              </Link>
            )}

            <div className="app__viewMenu_menu_items">
              {meals.map((meal) => (
                <div className="viewmenu" key={meal.idmenu}>
                  <div className="meal-page">
                    <img src={meal.cover} alt="" className="img" />

                    <div className="meal">
                      <MenuItem
                        title={meal.title}
                        price={meal.price}
                        tags={meal.description}
                      />
                    </div>
                  </div>
                  {auth && role === "admin" && (
                    <div className="btn">
                      <p
                        className="delete"
                        onClick={() => handleDelete(meal.idmenu)}
                      >
                        Delete
                      </p>
                      <Link
                        className="update-btn"
                        to={`/update/${meal.idmenu}`}
                      >
                        <p className="update"> Update</p>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="app__bg__wrapper__section__drinks">
        <div className="app__wrapper_info_drinks">
          <div className="app__bg__wrapper__padding_drinks" id="awards">
            <div className="app__wrapper_info"></div>
          </div>
        </div>
        <div className="app__wrapper_info" id="img_drink"></div>
      </div>

      <div className="app__specialMenu flex__center section__padding" id="menu">
        <div className="app__specialMenu-title">
          <h1 className="headtext__cormorant">Cocktails</h1>
        </div>

        <div className="app__specialMenu-menu">
          <div className="app__specialMenu-menu_wine flex__center">
            {auth && role === "admin" && (
              <Link to={"/addDrink"} className="app__specialMenu-menu_heading">
                Add drink
              </Link>
            )}

            <div className="app__viewMenu_drinks_items">
              {drinks.map((drink) => (
                <div className="viewmenu" key={drink.iddrinks}>
                  <div className="drink-page">
                    <img src={drink.cover} alt="" className="img_drink" />

                    <div className="drink">
                      <MenuItem
                        title={drink.name}
                        price={drink.price}
                        tags={drink.ingredients}
                      />
                    </div>
                  </div>
                  {auth && role === "admin" && (
                    <div className="btn">
                      <p
                        className="delete"
                        onClick={() => handleDeleteDrink(drink.iddrinks)}
                      >
                        Delete
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMenu;
