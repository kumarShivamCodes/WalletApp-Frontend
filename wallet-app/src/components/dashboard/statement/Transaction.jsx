import React from "react";
import "../statement/transaction.css";
import "bootstrap/dist/css/bootstrap.min.css";
const Transaction = ({ transaction }) => {
  return (
    <div class="transaction-statement-row">
      <div>{transaction.type}</div>
      <div>Rs {transaction.transactionAmount}</div>
      <div>{transaction.accNo}</div>
      <div>{transaction.createdAt}</div>
    </div>
  );
};

export default Transaction;
