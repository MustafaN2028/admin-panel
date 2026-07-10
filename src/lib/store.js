// src/lib/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import userReducer from "./features/userSlice";
import subscriptionReducer from "./features/subscriptionSlice";
import subscriptionPlansReducer from "./features/subscriptionPlansSlice";
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      users: userReducer,
      subscriptions: subscriptionReducer,
      subscriptionPlans: subscriptionPlansReducer,
    },
    // Production rule: Automatically disable devtools in live hosting envs for security
    devTools: process.env.NODE_ENV !== "production",
  });
};
