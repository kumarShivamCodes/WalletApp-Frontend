import React, { useState, useEffect } from "react";
import "../../dashboard/statement/transaction.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Transaction from "./Transaction";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/userSlice";
import { useNavigate } from "react-router-dom";

const TransactionList = () => {
  const user = useSelector(selectUser);
  const [transactions, setTransactions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = (event) => {
      navigate("/dashboard");
    };

    // Add the popstate event listener when the component mounts
    window.addEventListener("popstate", handlePopState);

    // Remove the popstate event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:8080/users/transactions/" + user.username, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        } else {
          console.error("Error fetching data");
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchTransactions();
  }, []);
  return (
    <div className="transaction-list-container">
      <div className="transaction-statement-container p-0">
        <div className="transaction-statement-row font-weight-bold">
          <div>Transaction type</div>
          <div>Transaction Amount</div>
          <div>Account Number</div>
          <div>Timestamp</div>
        </div>
        {transactions.map((transaction) => {
          return <Transaction transaction={transaction} key={transaction.username} />;
        })}
      </div>
    </div>
  );
};

export default TransactionList;
