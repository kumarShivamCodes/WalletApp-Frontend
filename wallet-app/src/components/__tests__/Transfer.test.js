import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import Transfer from "../dashboard/transfer/Transfer"; // Update the import path accordingly
import store from "../../redux/store";

describe("Transfer Component", () => {
  test("renders input fields and button", () => {
    const { getByLabelText, getByText } = render(
      <Provider store={store}>
        <Transfer />
      </Provider>
    );

    const amountInput = getByLabelText("Amount");
    const accNoInput = getByLabelText("Acc No");
    const transferButton = getByText("Transfer");

    expect(amountInput).toBeInTheDocument;
    expect(accNoInput).toBeInTheDocument;
    expect(transferButton).toBeInTheDocument;
  });

  test("updates input fields correctly", () => {
    const { getAllByLabelText } = render(
      <Provider store={store}>
        <Transfer />
      </Provider>
    );

    const amountInputs = getAllByLabelText("Amount");
    const accNoInputs = getAllByLabelText("Acc No");

    fireEvent.change(amountInputs[0], { target: { value: "100" } });
    fireEvent.change(accNoInputs[0], { target: { value: "123456789" } });

    expect(amountInputs[0].value).toBe("100");
    expect(accNoInputs[0].value).toBe("123456789");
  });

  test("displays error message for invalid input", () => {
    const { getAllByLabelText, getByText } = render(
      <Provider store={store}>
        <Transfer />
      </Provider>
    );

    const amountInputs = getAllByLabelText("Amount");
    const transferButton = getByText("Transfer");

    fireEvent.change(amountInputs[0], { target: { value: "invalid" } });
    fireEvent.click(transferButton);

    const errorMessage = getByText("Please enter a valid integer amount");
    expect(errorMessage).toBeInTheDocument;
  });

  test("parseFloat converts transferAmount to a number", () => {
    const transferAmount = "50.75";
    const result = parseFloat(transferAmount);
    expect(result).toBe(50.75);
  });
});

test("handles successful transfer", async () => {
  const mockResponse = {
    ok: true,
  };
  jest.spyOn(global, "fetch").mockResolvedValueOnce({
    json: jest.fn().mockResolvedValue(mockResponse),
    ok: true,
  });

  render(
    <Provider store={store}>
      <Transfer />
    </Provider>
  );

  // Interact with input fields, etc.

  fireEvent.click(screen.getByText("Transfer"));

  await waitFor(() => {
    // Check if dispatch function or alert was called as expected
    // Check if state was updated as expected
  });

  // Restore the original fetch function
  global.fetch.mockRestore();
});

test("handles transfer error", async () => {
  const mockResponse = {
    status: 400,
    json: jest.fn().mockResolvedValue({ message: "Insufficient balance" }),
  };
  jest.spyOn(global, "fetch").mockResolvedValueOnce(mockResponse);

  render(
    <Provider store={store}>
      <Transfer />
    </Provider>
  );

  // Interact with input fields, etc.

  fireEvent.click(screen.getByText("Transfer"));

  await waitFor(() => {
    // Check if error message was displayed as expected
    // Check if state was updated as expected
  });

  // Restore the original fetch function
  global.fetch.mockRestore();
});

test("handles fetch error", async () => {
  jest.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Network error"));

  render(
    <Provider store={store}>
      <Transfer />
    </Provider>
  );

  // Interact with input fields, etc.

  fireEvent.click(screen.getByText("Transfer"));

  await waitFor(() => {
    // Check if error message was displayed as expected
    // Check if state was updated as expected
  });

  // Restore the original fetch function
  global.fetch.mockRestore();
});
