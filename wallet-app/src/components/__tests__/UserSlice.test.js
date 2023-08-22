import { configureStore } from "@reduxjs/toolkit";
import userReducer, { login, logout, rechargeBalance, transferBalance } from "../../redux/userSlice";

describe("userSlice", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
      },
    });
  });

  it("should handle initial state", () => {
    expect(store.getState().user.user).toEqual({
      username: null,
      password: null,
      balance: 0,
      accNo: null,
      loggedIn: false,
    });
  });

  it("should handle login", () => {
    const userData = {
      username: "testuser",
      password: "testpassword",
      balance: 100,
      accNo: "123456789",
      loggedIn: true,
    };

    store.dispatch(login(userData));
    expect(store.getState().user.user).toEqual(userData);
  });

  it("should handle logout", () => {
    store.dispatch(logout());
    expect(store.getState().user.user).toEqual({
      username: null,
      password: null,
      balance: 0,
      loggedIn: false,
    });
  });

  it("should handle recharge balance", () => {
    const initialBalance = store.getState().user.user.balance;
    const rechargeAmount = 50;

    store.dispatch(rechargeBalance(rechargeAmount));
    expect(store.getState().user.user.balance).toEqual(initialBalance + rechargeAmount);
  });

  it("should handle transfer balance", () => {
    const initialBalance = store.getState().user.user.balance;
    const transferAmount = 20;

    store.dispatch(transferBalance(transferAmount));
    expect(store.getState().user.user.balance).toEqual(initialBalance - transferAmount);
  });
});
