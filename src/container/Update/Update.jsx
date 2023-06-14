import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Update.css";

const Update = () => {
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

  const [menu, setmenu] = useState({
    title: "",
    description: "",
    price: "",
    cover: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [meal, setMeal] = useState(null);

  const { idmenu } = useParams();

  const menuId = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await axios.get("http://localhost:3001/menu/");
        setMeal(response.data[idmenu - 1]);
        console.log(response.data[idmenu - 1]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMeal();
  }, []);

  useEffect(() => {
    if (meal) {
      setmenu(meal);
      console.log(meal);
    }
  }, [meal]);

  const handleChange = (e) => {
    setmenu((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:3001/viewMenu/" + menuId, menu);
      navigate("/viewMenu");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className=" app__specialMenu flex__center section__padding  ">
      <div>
        {auth && role === "admin" ? (
          <div className="form-update">
            <h2 className="app__specialMenu-menu_heading">Update Menu</h2>

            <input
              type="text"
              placeholder="title"
              onChange={handleChange}
              name="title"
              value={menu.title}
            />
            <input
              type="text"
              placeholder="description"
              onChange={handleChange}
              name="description"
              value={menu.description}
            />
            <input
              type="text"
              placeholder="price"
              onChange={handleChange}
              name="price"
              value={menu.price}
            />
            <input
              type="text"
              placeholder="cover"
              onChange={handleChange}
              name="cover"
              value={menu.cover}
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
    </div>
  );
};
export default Update;
