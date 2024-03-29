import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdArrowCircleLeft } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const Add = () => {
  const role = localStorage.getItem("role");
  const [auth, setAuth] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

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

  const handleIngredientChange = (event) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => {
        console.log(option.value);
        return option.value;
      }
    );
    setSelectedIngredients(selectedOptions);
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!meal.title.trim() || !meal.cover.trim() || !meal.price.trim()) {
      setFormError(true);
      return;
    }

    try {
      const newMeal = {
        ...meal,
        ingredients: selectedIngredients, // Include the selected ingredients
      };

      await axios.post("http://localhost:3001/menu", newMeal);
      navigate("/viewMenu");
    } catch (err) {
      console.log(err);
    }
  };
  console.log(selectedIngredients);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get("http://localhost:3001/ingredients");
        setIngredients(response.data);
        console.log(response.data);
        // Set the fetched ingredients in state
      } catch (error) {
        console.log(error);
      }
    };
    fetchIngredients();
  }, []);

  return (
    <div>
      <div
        id="add_padding"
        style={{
          marginBottom: "-45px",
          paddingTop: "50px",
          backgroundImage:
            'url("http://localhost:3000/static/media/bg.3d421b1b5682e1b67deb.png")',
          backgroundSize: "cover",
        }}
      >
        <Link to={"/viewMenu"}>
          <MdArrowCircleLeft
            fontSize={40}
            cursor=" pointer"
            className="overlay__close"
            id="arrow-left_booktable"
            color="var(--color-golden)"
          />
        </Link>
      </div>
      <div className="app__bg app__specialMenu flex__center section__padding">
        {auth && role === "admin" ? (
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
            <label htmlFor="ingredients">Select Ingredients:</label>
            <select
              id="ingredients"
              name="ingredients"
              multiple
              onChange={handleIngredientChange}
              value={selectedIngredients}
            >
              {ingredients.map((ingredient) => (
                <option key={ingredient.id} value={ingredient.id}>
                  {ingredient.itemname}
                </option>
              ))}
            </select>

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
    </div>
  );
};

export default Add;
