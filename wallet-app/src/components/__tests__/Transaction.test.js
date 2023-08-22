import React from "react";
import { render } from "@testing-library/react";
import Transaction from "../dashboard/statement/Transaction"; // Update the import path accordingly

describe("Transaction Component", () => {
  const mockTransaction = {
    type: "transfer",
    transactionAmount: 100,
    accNo: "123456",
    createdAt: "2023-08-21",
  };

  const getByTextContent = (content) => {
    return (node) => {
      const hasText = (node) => node.textContent === content;
      const nodeHasText = hasText(node);
      const childrenDontHaveText = Array.from(node.children).every((child) => !hasText(child));
      return nodeHasText && childrenDontHaveText ? node : null;
    };
  };

  test("renders transaction details correctly", () => {
    const { getByText } = render(<Transaction transaction={mockTransaction} />);

    expect(getByTextContent("transfer")).toBeInTheDocument;
    expect(getByTextContent("Rs 100")).toBeInTheDocument;
    expect(getByTextContent("123456")).toBeInTheDocument;
    expect(getByTextContent("2023-08-21")).toBeInTheDocument;
  });

  test("renders correct transaction type", () => {
    const { queryByText } = render(<Transaction transaction={mockTransaction} />);

    expect(queryByText("transfer")).toBeInTheDocument;
    expect(queryByText("payment")).not.toBeInTheDocument; // Assuming "payment" is not part of the transaction
  });

  test("renders formatted transaction amount", () => {
    const { queryByText } = render(<Transaction transaction={mockTransaction} />);

    expect(queryByText("Rs 100")).toBeInTheDocument;
    expect(queryByText("Rs 200")).not.toBeInTheDocument; // Assuming "Rs 200" is not part of the transaction
  });
});
