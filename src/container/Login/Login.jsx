import "./Login.css";
import Axios from "axios";
import React, { useState } from "react";
import { SubHeading } from '../../components';
import { images } from '../../constants';

function Login() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [registerStatus, setRegisterStatus] = useState("");
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const register = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3001/register", {
      email: email,
      username: username,
      password: password,
    }).then((response) => {
      if (response.data.message) {
        setRegisterStatus(response.data.message);
      } else {
        setRegisterStatus("Account created successfully");
      }
    });
  };

  const login = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3001/login", {
      username: username,
      password: password,
    }).then((response) => {
      if (response.data.message) {
        setLoginStatus(response.data.message);
      } else {
        setLoginStatus("Login was successful");
      }
    });
  };
  const toggleRegisterForm = () => {
    setShowRegisterForm(!showRegisterForm);
  };

  return (
    <div className="container app__bg " id="login" >
      
      {showRegisterForm ? (
        <div className="registerForm">
          <form action="">
            <h4>Register Here</h4>
            <label htmlFor="email">Email: </label>
            <input
              className="textInput"
              type="email"
              name="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Enter email"
              required
            />
            <label htmlFor="username">Username: </label>
            <input
              className="textInput"
              type="text"
              name="username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              placeholder="Enter username"
              required
            />
            <label htmlFor="password">Password: </label>
            <input
              className="textInput"
              type="password"
              name="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Enter password"
              required
            />
            <input
              className="button"
              type="submit"
              onClick={register}
              value="Register"
            />
            <p>
              Already have an account?{" "}
              <b>
                <a
                  href="#"
                  style={{ textDecoration: "none" }}
                  onClick={toggleRegisterForm}
                >
                  Login here
                </a>
              </b>
            </p>
            <p style={{ color: "green" }}>{registerStatus}</p>
          </form>
        </div>
      ) : (
        <div className="loginForm">
          <form action="">
            <h4>Login Here</h4>
            <label htmlFor="username">Username: </label>
            <input
              className="textInput"
              type="text"
              name="username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              placeholder="Enter username"
              required
            />
            <label htmlFor="password">Password: </label>
            <input
              className="textInput"
              type="password"
              name="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Enter password"
              required
            />
            <input
              className="button"
              type="submit"
              onClick={login}
              value="Login"
            />
            <p>
              Don't have an account?{" "}
              <b>
                <a
                  href="#"
                  
                  onClick={toggleRegisterForm}
                >
                  Register here
                </a>
              </b>
            </p>
            <p className="statusMessage">{loginStatus}</p>
          </form>
        </div>
      )}
    </div>
  );
}

export default Login;
