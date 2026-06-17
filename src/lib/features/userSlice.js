// src/lib/features/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

// ASYNC THUNK: Fetches the user list array from your secure backend admin panel endpoint
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (page = 1, thunkAPI) => {
    try {
      // Pulling token manually out of state tracking to authorize request header
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users?page=${page}&limit=10`, // Update to match your exact backend endpoint
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

export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (id, thunkAPI) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${id}`,
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
          data.message || "Failed to download user directory.";
        toast.error(errorMessage);
        return thunkAPI.rejectWithValue(errorMessage);
      }
      return data;
    } catch (error) {}
  },
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData }, thunkAPI) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${id}`,
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
        const errorMessage = data.message || "Failed to update user.";

        toast.error(errorMessage);

        return thunkAPI.rejectWithValue(errorMessage);
      }

      toast.success("User updated successfully");

      return data;
    } catch (error) {
      toast.error("Could not update user");

      return thunkAPI.rejectWithValue("Could not communicate with server");
    }
  },
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, thunkAPI) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${id}`,
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
        const errorMessage = data.message || "Failed to delete user.";

        toast.error(errorMessage);

        return thunkAPI.rejectWithValue(errorMessage);
      }

      toast.success("User deleted successfully");

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
  usersList: [],
  selectedUser: null,
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
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        // update selected user after PUT success
        state.selectedUser = action.payload;

        // optional: update user in list also
        if (state.usersList?.data?.length) {
          const updatedUser = action.payload.data || action.payload;

          state.usersList.data = state.usersList.data.map((user) =>
            user.id === updatedUser.id ? updatedUser : user,
          );
        }
      })

      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.usersList.data = state.usersList.data.filter(
          (user) => user.id !== action.payload,
        );
      })

      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
