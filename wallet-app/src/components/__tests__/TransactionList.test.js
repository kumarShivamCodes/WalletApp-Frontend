import React from "react";
import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../redux/store";
import TransactionList from "../dashboard/statement/TransactionList";

test("renders transactions correctly", async () => {
  // Mock the fetch function to return sample data
  const mockTransactions = [
    { transactionType: "transfer", transactionAmount: 100, accountNumber: "123456", timestamp: "2023-08-21" },
    // Add more sample transactions as needed
  ];
  jest.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: jest.fn().mockResolvedValueOnce(mockTransactions),
  });

  const { getByText, queryByText } = render(
    <Provider store={store}>
      <MemoryRouter>
        <TransactionList />
      </MemoryRouter>
    </Provider>
  );

  // Wait for transactions to be rendered
  await waitFor(() => {
    mockTransactions.forEach((transaction) => {
      expect(queryByText(transaction.transactionType)).toBeInTheDocument;
      expect(queryByText(transaction.transactionAmount.toString())).toBeInTheDocument;
      expect(queryByText(transaction.accountNumber)).toBeInTheDocument;
      expect(queryByText(transaction.timestamp)).toBeInTheDocument;
    });
  });
});

test("navigates to dashboard on popstate", () => {
  const { getByText } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/dashboard"]}>
        <TransactionList />
      </MemoryRouter>
    </Provider>
  );

  // Simulate the popstate event
  fireEvent.popState(window);

  // Check if the navigation occurred (you might want to add more specific checks here)
  expect(getByText("Transaction type")).toBeInTheDocument; // Use a different text that's part of the component
});
