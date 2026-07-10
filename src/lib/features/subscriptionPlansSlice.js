import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

export const fetchSubscriptionPlans = createAsyncThunk(
    "subscriptionPlans/fetchSubscriptionPlans",
    async (page = 1, thunkAPI) => {
        try {
            const token =
                typeof window !== "undefined" ? localStorage.getItem("token") : null;

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/subscription-plans?page=${page}&limit=10`,
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
                    data.message || "Failed to download subscription plans.";

                toast.error(errorMessage);
                return thunkAPI.rejectWithValue(errorMessage);
            }

            return data;
        } catch (error) {
            const errorMessage =
                error.message || "Could not communicate with subscription plans service.";

            toast.error(errorMessage);
            return thunkAPI.rejectWithValue(errorMessage);
        }
    },
);

export const fetchSubscriptionPlanById = createAsyncThunk(
    "subscriptionPlans/fetchSubscriptionPlanById",
    async (planId, thunkAPI) => {
        try {
            const token =
                typeof window !== "undefined" ? localStorage.getItem("token") : null;

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/subscription-plans/${planId}`,
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
                const errorMessage = data.message || "Failed to fetch subscription plan.";

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

export const createSubscriptionPlan = createAsyncThunk(
    "subscriptionPlans/createSubscriptionPlan",
    async (planData, thunkAPI) => {
        try {
            const token =
                typeof window !== "undefined" ? localStorage.getItem("token") : null;

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/subscription-plans`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                    body: JSON.stringify(planData),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.message || "Failed to create subscription plan.";

                toast.error(errorMessage);
                return thunkAPI.rejectWithValue(errorMessage);
            }

            toast.success("Subscription plan created successfully");
            return data;
        } catch (error) {
            const errorMessage =
                error.message || "Could not communicate with server.";

            toast.error(errorMessage);
            return thunkAPI.rejectWithValue(errorMessage);
        }
    },
);

export const updateSubscriptionPlan = createAsyncThunk(
    "subscriptionPlans/updateSubscriptionPlan",
    async ({ planId, planData }, thunkAPI) => {
        try {
            const token =
                typeof window !== "undefined" ? localStorage.getItem("token") : null;

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/subscription-plans/${planId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                    body: JSON.stringify(planData),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.message || "Failed to update subscription plan.";

                toast.error(errorMessage);
                return thunkAPI.rejectWithValue(errorMessage);
            }

            toast.success("Subscription plan updated successfully");
            return data;
        } catch (error) {
            const errorMessage =
                error.message || "Could not communicate with server.";

            toast.error(errorMessage);
            return thunkAPI.rejectWithValue(errorMessage);
        }
    },
);

export const deleteSubscriptionPlan = createAsyncThunk(
    "subscriptionPlans/deleteSubscriptionPlan",
    async (planId, thunkAPI) => {
        try {
            const token =
                typeof window !== "undefined" ? localStorage.getItem("token") : null;

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/subscription-plans/${planId}`,
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
                const errorMessage = data.message || "Failed to delete subscription plan.";

                toast.error(errorMessage);
                return thunkAPI.rejectWithValue(errorMessage);
            }

            toast.success("Subscription plan deleted successfully");
            return planId;
        } catch (error) {
            const errorMessage =
                error.message || "Could not communicate with server.";

            toast.error(errorMessage);
            return thunkAPI.rejectWithValue(errorMessage);
        }
    },
);

const initialState = {
    plansList: [],
    selectedPlan: null,
    loading: false,
    error: null,
};

const subscriptionPlansSlice = createSlice({
    name: "subscriptionPlans",
    initialState,
    reducers: {
        clearPlanError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubscriptionPlans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
                state.loading = false;
                state.plansList = action.payload;
            })
            .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchSubscriptionPlanById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubscriptionPlanById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPlan = action.payload;
            })
            .addCase(fetchSubscriptionPlanById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createSubscriptionPlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSubscriptionPlan.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(createSubscriptionPlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateSubscriptionPlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSubscriptionPlan.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPlan = action.payload;
            })
            .addCase(updateSubscriptionPlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteSubscriptionPlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSubscriptionPlan.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                if (state.plansList?.data?.length) {
                    state.plansList.data = state.plansList.data.filter(
                        (plan) => plan.code !== action.payload,
                    );
                }
            })
            .addCase(deleteSubscriptionPlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearPlanError } = subscriptionPlansSlice.actions;

export default subscriptionPlansSlice.reducer;
