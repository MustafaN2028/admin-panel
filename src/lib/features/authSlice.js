// src/lib/features/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

// 1. ASYNC THUNK METHOD: Orchestrates your live network request lifecycle
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ mobileNumber, password }, thunkAPI) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone_number: mobileNumber, password }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        // Fall back to a backend error message, or issue a clean text string default
        const errorMessage = data.message || "Invalid credentials supplied";
        toast.error(errorMessage);
        return thunkAPI.rejectWithValue(errorMessage);
      }

      // If token injection or cookie handshakes are handled manually:
      if (data.token) localStorage.setItem("token", data.token);

      toast.success(data.message || "Login successful!");
      return data.admin; // Becomes the action.payload inside your success reducer
    } catch (error) {
      const errorMessage = "Server connection failed. Please try again later.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);
// Helper function to hydrate state safely on page refreshes
const checkInitialAuth = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    return !!token; // Returns true if token exists, false if empty
  }
  return false;
};
const initialState = {
  user: null,
  isAuthenticated: checkInitialAuth(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      if (typeof window !== "undefined") localStorage.removeItem("token");
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  // 2. EXTRA REDUCERS LAYER: Intercepts the automated promise states of your Thunk
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload; // Holds your clean error strings
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
