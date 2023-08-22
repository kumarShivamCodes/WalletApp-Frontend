import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || {
      username: null,
      password: null,
      balance: 0,
      accNo: null,
      loggedIn: false,
    },
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = {
        username: null,
        password: null,
        balance: 0,
        loggedIn: false,
      };
      localStorage.removeItem("user");
    },

    rechargeBalance: (state, action) => {
      state.user.balance += action.payload;
      localStorage.setItem("user", JSON.stringify(state.user));
    },

    transferBalance: (state, action) => {
      state.user.balance -= action.payload;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { login, logout, rechargeBalance, transferBalance } = userSlice.actions;
export const selectUser = ({ user }) => user.user;

export default userSlice.reducer;
