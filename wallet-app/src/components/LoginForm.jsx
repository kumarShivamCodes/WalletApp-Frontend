import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { useDispatch } from "react-redux";
import { login, logout, selectUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // let [balance, setBalance] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!password || !username) {
      setErrorMessage("Please fill in all fields.");
      setPassword("");
      return;
    }

    const userLoginData = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userLoginData),
      });
      if (response.status === 200) {
        const userData = await response.json();
        console.log(userData.balance);

        dispatch(
          login({
            username: username,
            password: password,
            loggedIn: true,
            balance: parseFloat(userData.balance),
            accNo: userData.accNo,
          })
        );
        navigate("/dashboard");
      } else if (response.status === 401) {
        //Wrong password
        const errorData = await response.json();
        setErrorMessage(errorData.message);
        setPassword("");
      } else if (response.status === 404) {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
        setUsername("");
        setPassword("");
      }
    } catch (error) {
      setErrorMessage("Login failed! due to internal server error: ");
    }
  };

  return (
    <div className="container mt-5" data-testid="login-form">
      <div className="row justify-content-center">
        <div className="col-sm-4">
          <Form className="shadow p-3 bg-body rounded">
            <h2 className="text-center mb-4">Login</h2>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value), setErrorMessage("");
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value), setErrorMessage("");
                }}
              />
            </Form.Group>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <div className="d-grid">
              <Button variant="dark" type="submit" onClick={handleLogin}>
                Login
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
