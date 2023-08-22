import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../dashboard/recharge/recharge.css";
import { useDispatch } from "react-redux";
import { rechargeBalance } from "../../../redux/userSlice";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/userSlice";

const Recharge = () => {
  const [rechargeAmount, setRechargeAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { username, balance } = user;

  const handleRecharge = async (e) => {
    e.preventDefault();

    // Use regular expression to validate input as an integer
    const isValidInteger = /^\d+$/.test(rechargeAmount);
    if (!isValidInteger) {
      setErrorMessage("Please enter a valid integer amount");
      setRechargeAmount(0);
      return;
    }

    // Convert rechargeAmount to a number before dispatching
    const amountToRecharge = parseFloat(rechargeAmount);

    const rechargeData = {
      username: username,
      amount: rechargeAmount,
    };

    try {
      const response = await fetch("http://localhost:8080/users/recharge", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rechargeData),
      });

      if (response.ok) {
        // Recharge successful, update user's balance using dispatch action

        dispatch(rechargeBalance(amountToRecharge));
      } else if (response.status == 400) {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      } else {
        // Recharge failed, handle the error
        setErrorMessage("Failed to recharge. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      console.error("Fetch error:", error);
    }

    setRechargeAmount(0);

    setErrorMessage("");
  };
  return (
    <div>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-3 recharge-container">
            <h3 className="label-text">Enter Amount</h3>
            <div className="input-group mb-3">
              <span className="recharge-currency-label">Rs</span>
              <input
                type="text"
                className="form-control amount-input"
                aria-label="Amount"
                value={rechargeAmount}
                onChange={(e) => {
                  setRechargeAmount(e.target.value);
                  setErrorMessage("");
                }}
              />
            </div>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <div className="d-flex justify-content-center">
              <button className="recharge-btn" onClick={handleRecharge}>
                Recharge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recharge;
