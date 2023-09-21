import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import "./BookTable.css";
import { TableItem, SubHeading } from "../../components";
import { data, images } from "../../constants";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdArrowCircleLeft } from "react-icons/md";

const BookTable = () => {
  const navigate = useNavigate();
  const [tables, setTable] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedTableSize, setSelectedTableSize] = useState("");
  const [isFormValid, setIsFormValid] = useState(true);

  const [timeOptions, setTimeOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);

  useEffect(() => {
    // Fetch size options from the server when the component mounts
    const fetchSizeOptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/booktable/size"
        );
        setSizeOptions(response.data);
      } catch (error) {
        console.error("Error fetching size options:", error);
      }
    };

    fetchSizeOptions();

    // Fetch time options from the server when the component mounts
    const fetchTimeOptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/booktable/time"
        );
        setTimeOptions(response.data);
      } catch (error) {
        console.error("Error fetching time options:", error);
      }
    };

    fetchTimeOptions();

    // Fetch location options from the server when the component mounts
    const fetchLocationOptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/booktable/location"
        );
        setLocationOptions(response.data);
      } catch (error) {
        console.error("Error fetching location options:", error);
      }
    };

    fetchLocationOptions();

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
    if (
      selectedDate === "" ||
      selectedTime === "" ||
      selectedLocation === "" ||
      selectedTableSize === ""
    ) {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
      const belgradeDate = DateTime.fromISO(selectedDate, {
        zone: "Europe/Belgrade",
      }).toISODate();
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
      (selectedTableSize !== "" &&
        table.tablesize !== parseInt(selectedTableSize)) ||
      table.isReserved
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="app__bg" style={{ height: "150vh" }}>
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
          {timeOptions.map((timeOption) => (
            <option key={timeOption} value={timeOption}>
              {timeOption}
            </option>
          ))}
        </select>

        <select
          className={`input-one`}
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="">Choose a Location</option>
          {locationOptions.map((locationOption) => (
            <option key={locationOption} value={locationOption}>
              {locationOption}
            </option>
          ))}
        </select>

        <select
          className={`input-one`}
          value={selectedTableSize}
          onChange={(e) => setSelectedTableSize(e.target.value)}
        >
          <option value="">Choose a Table Size</option>
          {sizeOptions.map((sizeOption) => (
            <option key={sizeOption} value={sizeOption}>
              {sizeOption}
            </option>
          ))}
        </select>
      </div>

      <div className="content">
        <h1>Table Availability</h1>
        <p>Available Tables: {filteredTables.length}</p>
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

        {filteredTables.length > 0 && (
          <button
            onClick={() => handleFormSubmit(filteredTables[0].id)}
            className="button-light-yellow"
          >
            <p>CONFIRM</p>
          </button>
        )}

        {!isFormValid && (
          <p className="error-message">*Please fill in all required fields.</p>
        )}
      </div>
    </div>
  );
};

export default BookTable;
