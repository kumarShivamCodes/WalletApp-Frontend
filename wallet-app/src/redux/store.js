import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/userSlice";

const store = configureStore({
  reducer: {
    // user: customReducer,
    user: userReducer,
  },
});

export default store;
