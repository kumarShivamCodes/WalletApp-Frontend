import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import RegisterForm from "../RegisterForm";
import store from "../../redux/store";

// Mock the useNavigate function from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

// Mock useDispatch hook from react-redux
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => jest.fn(),
}));

test("renders the registration form", () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    </Provider>
  );
  const emailInput = screen.getByPlaceholderText("Enter email");
  const usernameInput = screen.getByPlaceholderText("Enter Username");
  const passwordInput = screen.getByPlaceholderText("Password");
  const registerButton = screen.getByText("Register");

  expect(emailInput).toBeInTheDocument;
  expect(usernameInput).toBeInTheDocument;
  expect(passwordInput).toBeInTheDocument;
  expect(registerButton).toBeInTheDocument;
});

test("displays error message for server error", async () => {
  // Mock a server error response using a test server library like MSW
  // Then, render the component and attempt registration
  render(
    <Provider store={store}>
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    </Provider>
  );
  const registerButton = screen.getByText("Register");

  userEvent.type(screen.getByPlaceholderText("Enter email"), "valid@example.com");
  userEvent.type(screen.getByPlaceholderText("Enter Username"), "validUsername");
  userEvent.type(screen.getByPlaceholderText("Password"), "validPassword123");
  fireEvent.click(registerButton);

  // Wait for error message
  const errorMessage = await screen.findByTestId("error");
  expect(errorMessage).toBeInTheDocument;
});

// Add more test cases to cover other scenarios and edge cases

test("displays error messages for invalid inputs", async () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    </Provider>
  );
  const registerButton = screen.getByText("Register");

  // Attempt registration with empty fields
  fireEvent.click(registerButton);
  const errorMessage = await screen.findByText("Please fill in all fields.");
  expect(errorMessage).toBeInTheDocument;

  // Attempt registration with invalid email
  userEvent.type(screen.getByPlaceholderText("Enter email"), "invalidemail");
  fireEvent.click(registerButton);
  const invalidEmailErrorMessage = await screen.findByTestId("error"); // Replace with the actual data-testid you set
  expect(invalidEmailErrorMessage).toBeInTheDocument;

  // Attempt registration with invalid password
  userEvent.type(screen.getByPlaceholderText("Password"), "12345");
  fireEvent.click(registerButton);
  const invalidPasswordErrorMessage = await screen.findByTestId("error");
  expect(invalidPasswordErrorMessage).toBeInTheDocument;
});

test("handles invalid email input", () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    </Provider>
  );

  const emailInput = screen.getByPlaceholderText("Enter email");
  const usernameInput = screen.getByPlaceholderText("Enter Username");
  const passwordInput = screen.getByPlaceholderText("Password");
  const registerButton = screen.getByText("Register");

  fireEvent.change(emailInput, { target: { value: "invalid-email" } });
  fireEvent.change(usernameInput, { target: { value: "testuser" } });
  fireEvent.change(passwordInput, { target: { value: "password123" } });
  fireEvent.click(registerButton);

  const errorMessage = screen.getByText("Please enter a valid email.");
  expect(errorMessage).toBeInTheDocument;
  expect(usernameInput.value).toBe("");
  expect(passwordInput.value).toBe("");
});
