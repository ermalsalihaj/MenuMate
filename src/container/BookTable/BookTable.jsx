import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./BookTable.css";
import { images } from "../../constants";

const BookTable = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [tables, setTables] = useState([
    { id: 1, size: 2, available: true, time: "09:00", location: "inside" },
    { id: 2, size: 4, available: false, time: "10:00", location: "outside" },
    { id: 3, size: 6, available: true, time: "11:00", location: "inside" },
    // Add more tables with their respective time and location properties
  ]);

  const handleDateSelection = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleTimeSelection = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleLocationSelection = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleSizeSelection = (event) => {
    setSelectedSize(event.target.value);
  };

  const timeSlots = [
    { label: "9AM", value: "09:00" },
    { label: "10AM", value: "10:00" },
    { label: "11AM", value: "11:00" },
    { label: "12PM", value: "12:00" },
    { label: "1PM", value: "13:00" },
    { label: "2PM", value: "14:00" },
    { label: "3PM", value: "15:00" },
    { label: "4PM", value: "16:00" },
    { label: "5PM", value: "17:00" },
  ];

  const locationOptions = [
    { label: "Any Location", value: "any" },
    { label: "Inside", value: "inside" },
    { label: "Outside", value: "outside" },
  ];

  const tableSizes = [1, 2, 3, 4, 5, 6, 7];

  const filterTables = () => {
    return tables.filter((table) => {
      if (
        (selectedTime === "" || selectedTime === table.time) &&
        (selectedLocation === "" || selectedLocation === table.location)
      ) {
        return true;
      }
      return false;
    });
  };

  const filteredTables = filterTables();

  const today = new Date().toISOString().split("T")[0];

  const availableTableCount = filteredTables.reduce(
    (count, table) => (table.available ? count + 1 : count),
    0
  );

  const isDateValid = selectedDate && selectedDate >= today;
  const isLocationValid = selectedLocation !== "";
  const isTimeValid = selectedTime !== "";
  const isSizeValid = selectedSize !== "";

  const isFormValid =
    isDateValid &&
    isLocationValid &&
    isTimeValid &&
    isSizeValid &&
    availableTableCount > 0;

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
          onChange={handleDateSelection}
          min={today}
          className={`input-one ${isDateValid ? "" : "invalid"}`}
        />

        <select
          value={selectedTime}
          onChange={handleTimeSelection}
          className={`input-one ${isTimeValid ? "" : "invalid"}`}
        >
          <option value="">Choose a Time</option>
          {timeSlots.map((slot) => (
            <option key={slot.value} value={slot.value}>
              {slot.label}
            </option>
          ))}
        </select>

        <select
          value={selectedLocation}
          onChange={handleLocationSelection}
          className={`input-one ${isLocationValid ? "" : "invalid"}`}
        >
          <option value="">Choose a Location</option>
          {locationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={selectedSize}
          onChange={handleSizeSelection}
          className={`input-one ${isSizeValid ? "" : "invalid"}`}
        >
          <option value="">Choose a Table Size</option>
          {tableSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="content">
        <h1>Table Availability</h1>
        <p>Available Tables: {availableTableCount}</p>

        <table>
          <thead>
            <tr>
              <th>Table ID</th>
              <th>Size</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTables.map((table) => (
              <tr key={table.id}>
                <td>{table.id}</td>
                <td>{table.size}</td>
                <td>{table.available ? "Available" : "Not Available"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {isFormValid ? (
        <Link to="/confirmation" className="confirmation-link">
          <p>CONFIRM</p>
        </Link>
      ) : (
        <p className="error-message">*Please fill in all required fields.</p>
      )}

      </div>

      
    </div>
  );
};

export default BookTable;
