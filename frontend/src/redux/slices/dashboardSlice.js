import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

axios.defaults.withCredentials = true;

const initialState = {
  stats: null,
  nextSteps: [],
  profileSummary: null,
  isLoading: false,
  error: null,
};

// Fetch Dashboard Stats
export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/dashboard`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard stats",
      );
    }
  },
);

// Get Next Steps
export const getNextSteps = createAsyncThunk(
  "dashboard/getNextSteps",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/next-steps`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch next steps",
      );
    }
  },
);

// Get Profile Summary
export const getProfileSummary = createAsyncThunk(
  "dashboard/getProfileSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/profile-summary`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile summary",
      );
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardState: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get Next Steps
      .addCase(getNextSteps.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getNextSteps.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nextSteps = action.payload;
      })
      .addCase(getNextSteps.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get Profile Summary
      .addCase(getProfileSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfileSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileSummary = action.payload;
      })
      .addCase(getProfileSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardState } = dashboardSlice.actions;
export default dashboardSlice.reducer;
