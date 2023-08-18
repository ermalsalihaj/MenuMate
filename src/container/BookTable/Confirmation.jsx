import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "./Confirmation.css";
import { images } from "../../constants";

const Confirmation = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [idtable, setIdtable] = useState();
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const [table, setTable] = useState(null);
  const [tables, setTables] = useState([]);
  const [filteredTables, setfilteredTables] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get("http://localhost:3001/booktable");
        setTable(response.data[id - 1]);
        setIdtable(response.data.find((table) => table.id === Number(id)));

        console.log(response.data.find((table) => table.id === Number(id)));
      } catch (error) {
        console.error(error);
      }
    };

    fetch();
  }, [id]);

  const [userid, setuserid] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get("http://localhost:3001/users");
        setUser(response.data[id - 1]);

        setuserid(response.data.find((user) => user.id === Number(id)));
        console.log(response.data.find((user) => user.id === Number(id)));
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, [id]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = "Name is required";
    }

    if (!phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d+$/.test(phoneNumber)) {
      errors.phoneNumber = "Invalid phone number";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email address";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        await axios.post("http://localhost:3001/reservations", {
          name,
          phoneNumber,
          email,
          idtable: idtable.id,
          userid: userid.id,
        });

        console.log("Reservation created successfully.");
        const updatedTables = tables.map((table) =>
          table.id === idtable.id ? { ...table, isReserved: true } : table
        );

        // Update the filteredTables state to reflect the changes
        const updatedFilteredTables = filteredTables.map((table) =>
          table.id === idtable.id ? { ...table, isReserved: true } : table
        );
        setfilteredTables(updatedFilteredTables);

        console.log(updatedTables);
        setTable(updatedTables);
        navigate("/");
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };

  return (
    <div>
      <div className="app__bg">
        <div className="navbar">
          <div className="app__navbar-logo">
            <img src={images.menumate} alt="app logo" />
          </div>

          <div className="app__navbar-spoon">
            <img src={images.spoon} alt="about_spoon" className="spoon__img" />
          </div>
        </div>

        <div className="confirmation-container">
          <h2>CONFIRMATION FORM</h2>
          <p>You are reserving table number : {id}</p>
          <br />
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="confirmation-input"
              placeholder="Name"
              value={name}
              onChange={handleNameChange}
            />
            <br />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
            <br />
            <br />
            <input
              type="text"
              className="confirmation-input"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
            />
            <br />
            {errors.phoneNumber && (
              <span className="error-message">{errors.phoneNumber}</span>
            )}
            <br />
            <br />
            <input
              type="text"
              className="confirmation-input"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />
            <br />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
            <br />
            <br />
            <input
              type="submit"
              value="Book Now"
              className="confirmation-btn"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
