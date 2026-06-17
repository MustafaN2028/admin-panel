// src/lib/features/subscriptionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

// ASYNC THUNK: Fetches the subscription logs from your secure backend admin panel endpoint
export const fetchSubscriptions = createAsyncThunk(
  "subscriptions/fetchSubscriptions",
  async (_, thunkAPI) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/subscriptions`, // Update to match your exact backend endpoint
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.message || "Failed to download subscription records.";
        toast.error(errorMessage);
        return thunkAPI.rejectWithValue(errorMessage);
      }

      // Return your array of subscriptions (Adapt depending on your exact API response wrapper)
      return data || data;
    } catch (error) {
      const errorMessage =
        "Could not communicate with subscription data streams.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

const initialState = {
  subscriptionsList: [],
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    clearSubError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptionsList = action.payload;
        state.error = null;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSubError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
