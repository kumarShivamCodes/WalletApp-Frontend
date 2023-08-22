import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../transfer/transfer.css";
import { useDispatch } from "react-redux";
import { transferBalance } from "../../../redux/userSlice";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/userSlice";

const Transfer = () => {
  const [transferAmount, setTransferAmount] = useState(0);
  const [accNo, setAccNo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { username, balance } = user;

  const handleTransfer = async (e) => {
    e.preventDefault();

    // Use regular expression to validate input as an integer
    const isValidInteger = /^\d+$/.test(transferAmount);
    if (!isValidInteger) {
      setErrorMessage("Please enter a valid integer amount");
      setTransferAmount(0);
      return;
    }

    // Convert rechargeAmount to a number before dispatching
    const amountToTransfer = parseFloat(transferAmount);
    const transferData = {
      username: username,
      amount: transferAmount,
      accNo: accNo,
    };

    try {
      const response = await fetch("http://localhost:8080/users/transfer", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transferData),
      });

      if (response.ok) {
        // Recharge successful, update user's balance using dispatch action
        dispatch(transferBalance(amountToTransfer));
        alert("transfer succesfully completed");
      } else if (response.status == 400) {
        // Handle specific error case: amount greater than current balance
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      console.error("Fetch error:", error);
    }

    setTransferAmount(0);
    setAccNo("");
  };

  return (
    <div>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-4 transfer-container">
            <h3 className="label-text">Enter Amount</h3>
            <div className="input-group mb-3">
              <span className="currency-label">Rs</span>
              <input
                type="text"
                className="form-control amount-input"
                aria-label="Amount"
                value={transferAmount}
                onChange={(e) => {
                  setTransferAmount(e.target.value);
                  setErrorMessage("");
                }}
              />
            </div>
            <h5 className="label-text">Enter Acc No.</h5>
            <div className="input-group mb-3">
              <span className="currency-label">Acc No.</span>
              <input
                type="text"
                className="form-control amount-input"
                aria-label="Acc No"
                value={accNo}
                onChange={(e) => {
                  setAccNo(e.target.value);
                  setErrorMessage("");
                }}
              />
            </div>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <div className="d-flex justify-content-center">
              <button className="transfer-btn" onClick={handleTransfer}>
                Transfer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
