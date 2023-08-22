import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import MyNavbar from "../Navbar/MyNavbar"; // Make sure the path is correct
import { login, logout } from "../../redux/userSlice"; // Import relevant Redux actions
import { useLocation as mockUseLocation } from "react-router-dom";
import { MemoryRouter } from "react-router-dom";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: () => mockedUsedNavigate,
}));

describe("MyNavbar component", () => {
  beforeEach(() => {
    useSelector.mockReturnValue({ loggedIn: true, username: "John" });
    mockUseLocation.mockReturnValue({ pathname: "/dashboard" });
  });

  it("calls handleLogout when logout button is clicked", () => {
    const dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);

    render(
      <MemoryRouter>
        <MyNavbar />
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole("button", { name: /Logout/i });
    fireEvent.click(logoutButton);

    expect(dispatchMock).toHaveBeenCalledWith(logout());
  });

  it("renders the correct greeting when user is logged in", () => {
    useSelector.mockReturnValue({ loggedIn: true, username: "John" });
    render(
      <MemoryRouter>
        <MyNavbar />
      </MemoryRouter>
    );
    const greetingElement = screen.getByText(/Hi John/i);
    expect(greetingElement).toBeInTheDocument;
  });

  it("does not render the greeting when user is not logged in", () => {
    useSelector.mockReturnValue({ loggedIn: false });
    render(
      <MemoryRouter>
        <MyNavbar />
      </MemoryRouter>
    );
    const greetingElement = screen.queryByText(/Hi/i);
    expect(greetingElement).toBeNull();
  });

  it("renders the 'My Wallet' title", () => {
    render(
      <MemoryRouter>
        <MyNavbar />
      </MemoryRouter>
    );
    const walletTitleElement = screen.getByText(/My Wallet/i);
    expect(walletTitleElement).toBeInTheDocument;
  });

  it("renders the logout button when user is logged in", () => {
    useSelector.mockReturnValue({ loggedIn: true });
    render(
      <MemoryRouter>
        <MyNavbar />
      </MemoryRouter>
    );
    const logoutButton = screen.getByRole("button", { name: /Logout/i });
    expect(logoutButton).toBeInTheDocument;
  });

  it("does not render the logout button when user is not logged in", () => {
    useSelector.mockReturnValue({ loggedIn: false });
    render(
      <MemoryRouter>
        <MyNavbar />
      </MemoryRouter>
    );
    const logoutButton = screen.queryByRole("button", { name: /Logout/i });
    expect(logoutButton).toBeNull();
  });

  // ... Other test cases ...
});
