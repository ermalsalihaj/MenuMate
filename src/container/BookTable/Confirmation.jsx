import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios for making HTTP requests
import "./Confirmation.css";
import { images } from "../../constants";

const Confirmation = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

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
        // Send a POST request to create a reservation
        await axios.post("http://localhost:3001/reservations", {
          name,
          phoneNumber,
          email,
        });

        // Perform any other actions or redirect to a success page
        console.log("Reservation created successfully.");

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
              type="email"
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
