import React, { useEffect, useState } from "react";
import { Navbar, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.css"; // Make sure the path is correct
import { useSelector } from "react-redux";
import { login, logout, selectUser } from "../../redux/userSlice";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const MyNavbar = () => {
  const user = useSelector(selectUser);
  const currentPath = useLocation().pathname;

  // const [isLoggedIn, setLoggedIn] = useState(false);

  let name = "";
  if (user.loggedIn) {
    name = user.username;
    // setLoggedIn(true);
  }

  const renderGreeting = user.loggedIn ? `Hi ${name}` : null;

  //handle logout
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    const handlePopstate = () => {
      if (currentPath === "/dashboard") handleLogout();
    };
    window.addEventListener("popstate", handlePopstate);
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [currentPath]);

  return (
    <Navbar className="custom-navbar" expand="lg">
      <Container>
        <Navbar.Brand className="username">{renderGreeting}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <h3 className="wallet-title" data-testid="my-navbar">
            My Wallet
          </h3>
        </Navbar.Collapse>
        {user.loggedIn && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
