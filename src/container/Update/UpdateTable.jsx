import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Update.css";

const UpdateTable = () => {
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

  const [table, settable] = useState({
    date: new Date().toISOString().slice(0, 19).replace("T", " "),
    time: "",
    location: "",
    tablesize: 0,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);

  const { id } = useParams();

  const tablesId = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await axios.get("http://localhost:3001/booktable/");
        setBooking(response.data[id - 1]);
        console.log(response.data[id - 1]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMeal();
  }, []);

  useEffect(() => {
    if (booking) {
      settable(booking);
      console.log(booking);
    }
  }, [booking]);

  const handleChange = (e) => {
    settable((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:3001/booktable/" + tablesId, table);
      navigate("/admin");
      console.log(table);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className=" app__specialMenu flex__center section__padding  ">
      {auth && role === "admin" ? (
        <div className="form-update">
          <h2 className="app__specialMenu-menu_heading">Update table</h2>

          <input
            style={{ marginLeft: "0px" }}
            type="date"
            placeholder="date"
            onChange={handleChange}
            name="date"
            value={table.date}
          />
          <input
            type="text"
            placeholder="time"
            onChange={handleChange}
            name="time"
            value={table.time}
          />
          <input
            type="text"
            placeholder="location"
            onChange={handleChange}
            name="location"
            value={table.location}
          />
          <input
            className="input_number"
            type="number"
            placeholder="tablesize"
            onChange={handleChange}
            name="tablesize"
            value={table.tablesize}
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
export default UpdateTable;
