// src/lib/features/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

// ASYNC THUNK: Fetches the user list array from your secure backend admin panel endpoint
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, thunkAPI) => {
    try {
      // Pulling token manually out of state tracking to authorize request header
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, // Update to match your exact backend endpoint
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }), // Attaches JWT token securely
          },
        },
      );

      const data = await response.json();
      if (!response.ok) {
        const errorMessage =
          data.message || "Failed to download directory directory.";
        toast.error(errorMessage);
        return thunkAPI.rejectWithValue(errorMessage);
      }

      // Return your array of users (Adapt 'data.users' depending on your API payload structure)
      return data || data;
    } catch (error) {
      const errorMessage =
        "Could not communicate with server database profile stacks.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

const initialState = {
  usersList: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.usersList = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
