// src/lib/features/subscriptionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

// Fetch all subscriptions
export const fetchSubscriptions = createAsyncThunk(
  "subscriptions/fetchSubscriptions",
  async (page = 1, thunkAPI) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/subscriptions?page=${page}&limit=10`,
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

      return data;
    } catch (error) {
      const errorMessage =
        "Could not communicate with subscription data streams.";

      toast.error(errorMessage);

      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

// Fetch subscription by id
export const fetchSubscriberById = createAsyncThunk(
  "subscriptions/fetchSubscriberById",
  async (id, thunkAPI) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/subscriptions/${id}`,
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
        const errorMessage = data.message || "Failed to fetch subscription.";

        toast.error(errorMessage);

        return thunkAPI.rejectWithValue(errorMessage);
      }

      return data;
    } catch (error) {
      const errorMessage =
        error.message || "Could not communicate with server.";

      toast.error(errorMessage);

      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

// Update subscription
export const updateSubscription = createAsyncThunk(
  "subscriptions/updateSubscription",
  async ({ id, userData }, thunkAPI) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/subscriptions/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(userData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || "Failed to update subscription.";

        toast.error(errorMessage);

        return thunkAPI.rejectWithValue(errorMessage);
      }

      toast.success("Subscription updated successfully");

      return data;
    } catch (error) {
      const errorMessage =
        error.message || "Could not communicate with server.";

      toast.error(errorMessage);

      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

export const deleteSubscription = createAsyncThunk(
  "subscription/deleteSubscription",
  async (id, thunkAPI) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/subscriptions/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || "Failed to delete subscription.";

        toast.error(errorMessage);

        return thunkAPI.rejectWithValue(errorMessage);
      }

      toast.success("Subscription deleted successfully");

      return id;
    } catch (error) {
      const errorMessage =
        error.message || "Could not communicate with server.";

      toast.error(errorMessage);

      return thunkAPI.rejectWithValue(errorMessage);
    }
  },
);

const initialState = {
  subscriptionsList: [],
  selectedsubscription: null,
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

      // FETCH ALL
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
      })

      // FETCH BY ID
      .addCase(fetchSubscriberById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriberById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedsubscription = action.payload;
        state.error = null;
      })
      .addCase(fetchSubscriberById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        // update selected subscription
        state.selectedsubscription = action.payload;

        // update subscription in list if available
        if (state.subscriptionsList?.data?.length) {
          const updatedSubscription = action.payload.data || action.payload;

          const subscriptionIndex = state.subscriptionsList.data.findIndex(
            (subscription) => subscription.id === updatedSubscription.id,
          );

          if (subscriptionIndex !== -1) {
            state.subscriptionsList.data[subscriptionIndex] =
              updatedSubscription;
          }
        }
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.subscriptionsList.data = state.subscriptionsList.data.filter(
          (subscription) => subscription.id !== action.payload,
        );
      })

      .addCase(deleteSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSubError } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
