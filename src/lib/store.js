// src/lib/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    // Production rule: Automatically disable devtools in live hosting envs for security
    devTools: process.env.NODE_ENV !== "production",
  });
};
