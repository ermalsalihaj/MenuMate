import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Confirmation.css";

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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      // Perform the submission or other actions here
      console.log("Form is valid, submitting data...");
    }
  };

  

  return (
    <div className="confirmation-container ">
      <h2>Confirmation Page</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="confirmation-input"
          placeholder="Name"
          value={name}
          onChange={handleNameChange}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
        <br />
        <input
          type="text"
          className="confirmation-input"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
        />
        {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
        <br />
        <input
          type="email"
          className="confirmation-input"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
        <br />
        <input type="submit" value="Book Now" className="confirmation-btn" />
      </form>

      

    </div>
  );
};

export default Confirmation;
