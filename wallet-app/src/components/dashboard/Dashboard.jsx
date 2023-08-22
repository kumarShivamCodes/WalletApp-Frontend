import React, { useEffect, useState } from "react";
import "../dashboard/dashboard.css";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import Recharge from "../dashboard/recharge/Recharge";
import Transfer from "../dashboard/transfer/Transfer";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [isSelectRecharge, setIsRecharge] = useState(false);
  const [isSelectTransfer, setIsTransfer] = useState(false);
  const user = useSelector(selectUser);
  const { balance, accNo } = user;
  const navigate = useNavigate();
  console.log(user);

  return (
    <div data-testid="dashboard">
      <h2 className="balance-header">Current Balance</h2>
      <div className="account-balance">Rs {balance}</div>
      <h4 className="balance-header">Your Acc No {accNo}</h4>
      <div className="custom-container">
        <button
          className="recharge circular"
          onClick={() => {
            setIsRecharge(!isSelectRecharge);
            setIsTransfer(false);
          }}
        >
          Recharge
        </button>
        <button
          className="transfer circular"
          onClick={() => {
            setIsTransfer(!isSelectTransfer);
            setIsRecharge(false);
          }}
        >
          Transfer
        </button>
        <button className="stmt circular" onClick={() => navigate("/transactions")}>
          Account Statement
        </button>
      </div>
      {isSelectRecharge && <Recharge />}
      {isSelectTransfer && <Transfer />}
    </div>
  );
};

export default Dashboard;
