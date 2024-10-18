// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // Import the auth slice

const store = configureStore({
  reducer: {
    auth: authReducer, // Add auth reducer to store
  },
});

export default store;
