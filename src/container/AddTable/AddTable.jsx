import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { images } from "../../constants";
import "./AddTable.css";

const Add = () => {
  const [table, settable] = useState({
    date: "",
    time: "",
    location: "",
    tablesize: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "date") {
      const selectedDate = new Date(e.target.value);
      const today = new Date();

      if (selectedDate < today) {
        alert("Please select a date that is not older than today.");
        return;
      }
    }

    if (e.target.name === "location") {
      const allowedLocations = ["any location", "inside", "outside"];
      const enteredLocation = e.target.value.trim().toLowerCase();

      if (!allowedLocations.includes(enteredLocation)) {
        alert(
          "Please enter a valid location: any location, inside, or outside."
        );
        return;
      }
    }

    if (e.target.name === "tablesize") {
      const enteredTableSize = parseInt(e.target.value, 10);

      if (![1, 2, 3, 4, 5, 6, 7].includes(enteredTableSize)) {
        alert("Please enter a valid table size: 1, 2, 3, 4, 5, 6, or 7.");
        return;
      }
    }

    settable((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    // Check if any of the form inputs are empty
    if (
      table.date === "" ||
      table.time === "" ||
      table.location === "" ||
      table.tablesize === ""
    ) {
      alert("Please fill in all the fields.");
      return; // Prevent form submission
    }

    // Validate the time format
    const timeRegex = /^(9|10|11)AM|(12|1|2|3|4|5)PM$/;
    if (!timeRegex.test(table.time)) {
      alert(
        "Please enter a valid time in the format: 9AM, 10AM, 11AM, 12PM, 1PM, 2PM, 3PM, 4PM, 5PM"
      );
      return; // Prevent form submission
    }

    try {
      await axios.post("http://localhost:3001/booktable", table);
      navigate("/bookTable");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="app__bg  ">
      <div className="navbar">
        <div className="app__navbar-logo">
          <img src={images.menumate} alt="app logo" />
        </div>

        <div className="app__navbar-spoon">
          <img src={images.spoon} alt="about_spoon" className="spoon__img" />
        </div>
      </div>

      <div className="  flex__center section__padding">
        <div className="form-add">
          <h2 className="app__specialMenu-menu_heading">Add new Table</h2>
          <input
            type="date"
            placeholder="date"
            onChange={handleChange}
            name="date"
            value={table.date}
          />
          <input
            type="text"
            placeholder="time (9AM to 5PM)"
            onChange={handleChange}
            name="time"
            value={table.time}
          />
          <input
            type="text"
            placeholder="location (any location, inside, outside)"
            onChange={handleChange}
            name="location"
            value={table.location}
          />
          <input
            type="number"
            placeholder="tablesize (7max)"
            onChange={handleChange}
            name="tablesize"
            value={table.tablesize}
          />

          <button className="formButton" onClick={handleClick}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Add;
