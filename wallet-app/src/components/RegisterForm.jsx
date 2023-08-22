import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { useDispatch } from "react-redux";
import { login, selectUser } from "../redux/userSlice";
import { useSelector } from "react-redux";
import Dashboard from "./dashboard/Dashboard";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!password || !username || !email) {
      setErrorMessage("Please fill in all fields.");
      setPassword("");
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email.");
      setUsername("");
      setPassword("");
      return;
    }

    if (!isValidPassword(password)) {
      setErrorMessage("Password must be at least 6 characters long and contain letters and numbers.");
      setPassword("");
      return;
    }

    const userData = {
      username: username,
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (response.status === 201) {
        const userData = await response.json();
        dispatch(
          login({
            email: email,
            username: username,
            password: password,
            balance: 0,
            accNo: userData.accNo,
            loggedIn: true,
          })
        );
        setEmail("");
        setUsername("");
        setPassword("");
        setErrorMessage("");
        navigate("/dashboard");
      } else if (response.status == 409) {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      } else {
        setErrorMessage("An error occured during registration.");
      }
    } catch (error) {
      setErrorMessage("An error occured. Please try again.");
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    // Regular expression for password validation: at least 6 characters, letters, and numbers
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordRegex.test(password);
  };

  return (
    <div className="container mt-5" data-testid="register-form">
      <div className="row justify-content-center">
        <div className="col-sm-4">
          <Form className="shadow p-3 bg-body rounded">
            <h2 className="text-center mb-4">Registration</h2>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            {errorMessage && (
              <p className="text-danger" data-testid="error">
                {errorMessage}
              </p>
            )}
            <div className="d-grid">
              <Button variant="dark" type="submit" onClick={handleLogin}>
                Register
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
