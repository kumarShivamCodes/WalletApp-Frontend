import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import store from "../../redux/store";
import { useNavigate } from "react-router-dom";

// Mock the useNavigate hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
describe("Dashboard Component", () => {
  test("renders current balance and account number", () => {
    const user = {
      balance: 500,
      accNo: "123456789",
    };

    // Mock the useNavigate implementation
    useNavigate.mockReturnValue(jest.fn());

    const { queryByText } = render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    const balanceText = queryByText((content, element) => {
      const regex = new RegExp(`Rs ${user.balance}`);
      return regex.test(content);
    });
    const accNoText = queryByText(`Your Acc No ${user.accNo}`);

    expect(balanceText).toBeInTheDocument;
    expect(accNoText).toBeInTheDocument;
  });

  test("selects recharge section on button click", () => {
    const { getByText, queryByText } = render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    const rechargeButton = getByText("Recharge");
    fireEvent.click(rechargeButton);

    const rechargeComponent = queryByText("Enter Amount"); // Use a more specific text
    expect(rechargeComponent).toBeInTheDocument;
  });

  test("selects transfer section on button click", () => {
    const { getByText, queryByText } = render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    const transferButton = getByText("Transfer");
    fireEvent.click(transferButton);

    const transferComponent = queryByText("Enter Acc No."); // Use a more specific text
    expect(transferComponent).toBeInTheDocument;
  });

  test("navigates to account statement on button click", () => {
    // Mock the navigate function
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );

    const stmtButton = getByText("Account Statement");
    fireEvent.click(stmtButton);

    // Check if the navigate function was called with the correct argument
    expect(navigate).toHaveBeenCalledWith("/transactions");
  });
});
