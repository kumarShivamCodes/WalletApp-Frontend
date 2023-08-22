import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoginForm from "../LoginForm"; // Update the path to your LoginForm component
import { login } from "../../redux/userSlice"; // Import relevant Redux actions

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("LoginForm component", () => {
  it("dispatches login action and navigates to dashboard on successful login", async () => {
    const dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);

    render(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText("Enter Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Mock fetch response for successful login
    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 200,
      json: async () => ({
        balance: 1000,
        accNo: "123456789",
      }),
    });

    fireEvent.click(loginButton);

    // Wait for dispatch and navigation to occur
    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(
        login({
          username: "testuser",
          password: "password123",
          loggedIn: true,
          balance: 1000,
          accNo: "123456789",
        })
      );
      expect(navigateMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("displays error message on incorrect password", async () => {
    const dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);

    render(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText("Enter Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "incorrectpassword" } });

    // Mock fetch response for incorrect password
    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 401,
      json: async () => ({
        message: "Incorrect password",
      }),
    });

    fireEvent.click(loginButton);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText("Incorrect password")).toBeInTheDocument;
    });
  });

  it("displays error message on user not found", async () => {
    const dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);

    render(<LoginForm />);

    const usernameInput = screen.getByPlaceholderText("Enter Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: /Login/i });

    fireEvent.change(usernameInput, { target: { value: "unknownuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Mock fetch response for user not found
    global.fetch = jest.fn().mockResolvedValueOnce({
      status: 404,
      json: async () => ({
        message: "User not found",
      }),
    });

    fireEvent.click(loginButton);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText("User not found")).toBeInTheDocument;
    });
  });

  // ... Other test cases ...
});
