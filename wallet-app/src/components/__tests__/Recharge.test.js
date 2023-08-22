import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Recharge from "../dashboard/recharge/Recharge";
import { Provider } from "react-redux"; // Import the Provider component
import store from "../../redux/store"; // Import your Redux store

test("renders Recharge component", () => {
  render(
    <Provider store={store}>
      <Recharge />
    </Provider>
  );
});

test("input field updates correctly", () => {
  const { getByLabelText } = render(
    <Provider store={store}>
      <Recharge />
    </Provider>
  );
  const inputField = getByLabelText("Amount");
  fireEvent.change(inputField, { target: { value: "100" } });
  expect(inputField.value).toBe("100");
});

test("displays error message", () => {
  const { getByLabelText, getByText } = render(
    <Provider store={store}>
      <Recharge />
    </Provider>
  );
  const inputField = getByLabelText("Amount");
  const rechargeButton = getByText("Recharge");

  fireEvent.change(inputField, { target: { value: "invalid" } });
  fireEvent.click(rechargeButton);

  const errorMessage = getByText("Please enter a valid integer amount");
  expect(errorMessage).toBeInTheDocument;
});

test("successful recharge updates balance", async () => {
  // Mock the fetch function
  const mockResponse = { ok: true };
  jest.spyOn(global, "fetch").mockResolvedValueOnce({
    json: jest.fn().mockResolvedValueOnce(mockResponse),
  });

  const { getByLabelText, getByText } = render(
    <Provider store={store}>
      <Recharge />
    </Provider>
  );
  const inputField = getByLabelText("Amount");
  const rechargeButton = getByText("Recharge");

  fireEvent.change(inputField, { target: { value: "100" } });
  fireEvent.click(rechargeButton);

  await new Promise((resolve) => setTimeout(resolve, 100));
});
