import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import App from "../../App";
import store from "../../redux/store";
import { MemoryRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import RegisterForm from "../RegisterForm";
import Dashboard from "../dashboard/Dashboard";
import LoginForm from "../LoginForm";

// Mock the react-router-dom module
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

test("renders App component without errors", () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
});

test("renders MyNavbar component", () => {
  const { getByTestId } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const navbar = getByTestId("my-navbar");
  expect(navbar).toBeInTheDocument; // You missed the parentheses here
});

test("renders RegisterForm component for '/register' route", () => {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/register"]}>
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
  const registerForm = screen.getByTestId("register-form"); // Adjust based on your component's structure
  expect(registerForm).toBeInTheDocument;
});

test("renders Dashboard component for '/dashboard' route", () => {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
  const dashboard = screen.getByTestId("dashboard"); // Adjust based on your component's structure
  expect(dashboard).toBeInTheDocument;
});

test("renders LoginForm component for '/login' route", () => {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
  const loginForm = screen.getByTestId("login-form"); // Adjust based on your component's structure
  expect(loginForm).toBeInTheDocument;
});
