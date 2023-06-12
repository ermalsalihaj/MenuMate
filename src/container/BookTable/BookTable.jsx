import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import "./BookTable.css";
import { TableItem, SubHeading } from "../../components";
import { data, images } from "../../constants";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const BookTable = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [tables, setTable] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedTableSize, setSelectedTableSize] = useState("");
  const [isFormValid, setIsFormValid] = useState(true);

  useEffect(() => {
    const fetchAllTables = async () => {
      try {
        const res = await axios.get("http://localhost:3001/booktable");
        setTable(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllTables();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete("http://localhost:3001/booktable/" + id);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleFormSubmit = (id) => {
    // Check if any of the fields are empty
    if (
      selectedDate === "" ||
      selectedTime === "" ||
      selectedLocation === "" ||
      selectedTableSize === ""
    ) {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
      const belgradeDate = DateTime.fromISO(selectedDate, { zone: 'Europe/Belgrade' }).toISODate();
      if (filteredTables.length > 0) {
        navigate(`/confirmation/${id}`);
      }
    }
  };

  const filteredTables = tables.filter((table) => {
    if (
      (selectedDate !== "" && !table.date.includes(selectedDate)) ||
      (selectedTime !== "" && table.time !== selectedTime) ||
      (selectedLocation !== "" && table.location !== selectedLocation) ||
      (selectedTableSize !== "" && table.tablesize !== parseInt(selectedTableSize))
    ) {
      return false; // Exclude the table if it doesn't match any of the selected filters
    }
    return true;
  });

  return (
    <div className="app__bg">
      <div className="navbar">
        <div className="app__navbar-logo">
          <img src={images.menumate} alt="app logo" />
        </div>

        <div className="app__navbar-spoon">
          <img src={images.spoon} alt="about_spoon" className="spoon__img" />
        </div>
      </div>

      <div>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <select
          className={`input-one`}
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          <option value="">Choose a Time</option>
          <option value="9AM">9AM</option>
          <option value="10AM">10AM</option>
          <option value="11AM">11AM</option>
          <option value="12PM">12PM</option>
          <option value="1PM">1PM</option>
          <option value="2PM">2PM</option>
          <option value="3PM">3PM</option>
          <option value="4PM">4PM</option>
          <option value="5PM">5PM</option>
        </select>

        <select
          className={`input-one`}
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="">Choose a Location</option>
          <option value="any location">Any Location</option>
          <option value="inside">Inside</option>
          <option value="outside">Outside</option>
        </select>

        <select
          className={`input-one`}
          value={selectedTableSize}
          onChange={(e) => setSelectedTableSize(e.target.value)}
        >
          <option value="">Choose a Table Size</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
        </select>
      </div>

      <div className="content">
        <h1>Table Availability</h1>
        <p>Available Tables: </p>
        {filteredTables.length > 0 ? (
          filteredTables.map((table) => (
            <div key={table.id} className="table-item">
              <div>
                <TableItem
                  date={table.date}
                  time={table.time}
                  location={table.location}
                  tablesize={table.tablesize}
                />
              </div>
              
            </div>
          ))
        ) : (
          <p>No tables available matching the selected filters.</p>
        )}
        {filteredTables.map(table => (
          // <Link to={`/confirmation/${table.id}`}>confirmation</Link>
          // isFormValid && (
          //   <button
          //     onClick={() => handleFormSubmit(table.id)}
          //     className="button-light-yellow"
          //   >
          //     <p>CONFIRM</p>
          //   </button>
          // )
          <button onClick={() => handleFormSubmit(table.id)}
          className="button-light-yellow">
          <p>CONFIRM</p>
        </button>
        ))}
      

        {!isFormValid && (
          <p className="error-message">*Please fill in all required fields.</p>
        )}
      </div>
    </div>
  );
};

export default BookTable;
