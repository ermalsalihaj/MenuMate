import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { images } from "../../constants";
import { DateTime } from "luxon";
import "./AddTable.css";
import { MdArrowCircleLeft } from "react-icons/md";

const AddTable = () => {
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

  const [table, setTable] = useState({
    date: "",
    time: "",
    location: "",
    tablesize: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "date") {
      const selectedDate = DateTime.fromFormat(e.target.value, "yyyy-MM-dd", {
        zone: "Europe/Belgrade",
      }).toISODate();
      const today = DateTime.now().toISODate();

      if (selectedDate < today) {
        alert("Please select a date that is not older than today.");
        return;
      }
    }

    setTable((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (
      table.date === "" ||
      table.time === "" ||
      table.location === "" ||
      table.tablesize === ""
    ) {
      alert("Please fill in all the fields.");
      return;
    }

    const timeRegex = /^(9|10|11)AM|(12|1|2|3|4|5)PM$/;
    if (!timeRegex.test(table.time)) {
      alert(
        "Please enter a valid time in the format: 9AM, 10AM, 11AM, 12PM, 1PM, 2PM, 3PM, 4PM, 5PM"
      );
      return;
    }

    try {
      await axios.post("http://localhost:3001/booktable", table);
      navigate("/bookTable");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="app__bg">
      {auth && role === "admin" ? (
        <div className="app__bg">
          <div className="navbar" id="navbar_booktable">
        <div>
          <Link to={"/"}>
          <MdArrowCircleLeft
            fontSize={40}
            cursor=" pointer"
            className="overlay__close"
            id="arrow-left_booktable"
            color="var(--color-golden)"
          />
        </Link>
        </div>
      
      <div>
        <div className="app__navbar-logo">
          <img src={images.menumate} alt="app logo" />
        </div>

        <div className="app__navbar-spoon">
          <img src={images.spoon} alt="about_spoon" className="spoon__img" />
        </div>
      </div>
      </div>

          <div className="flex__center section__padding">
            <div className="table-container">
              <h2 className="app__specialMenu-menu_heading">Add new Table</h2>
              <input
                style={{ marginLeft: "-1px" }}
                type="date"
                placeholder="Date"
                onChange={handleChange}
                name="date"
                value={table.date}
              />
              <input
                type="text"
                placeholder="Time (9AM to 5PM)"
                onChange={handleChange}
                name="time"
                value={table.time}
              />
              <select
                style={{ marginLeft: "-1px" }}
                className="input-one"
                value={table.location}
                onChange={handleChange}
                name="location"
              >
                <option value="">Choose a Location</option>
                <option value="Any Location">Any Location</option>
                <option value="Inside">Inside</option>
                <option value="Outside">Outside</option>
              </select>
              <input
                type="number"
                placeholder="Table Size (7 max)"
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
      ) : (
        <div>
          <h1>You Do Not Have Access To This Page</h1>
        </div>
      )}
    </div>
  );
};

export default AddTable;
