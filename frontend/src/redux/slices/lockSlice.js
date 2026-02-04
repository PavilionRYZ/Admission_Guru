import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

axios.defaults.withCredentials = true;

const initialState = {
  locks: [],
  currentLock: null,
  isLoading: false,
  error: null,
};

// Lock University
export const lockUniversity = createAsyncThunk(
  "locks/lockUniversity",
  async ({ shortlistId, applicationDeadline }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/locks`, {
        shortlistId,
        applicationDeadline,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to lock university",
      );
    }
  },
);

// Fetch All Locks
export const fetchLocks = createAsyncThunk(
  "locks/fetchLocks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/locks`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch locks",
      );
    }
  },
);

// Get Lock by ID
export const getLockById = createAsyncThunk(
  "locks/getLockById",
  async (lockId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/locks/${lockId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch lock details",
      );
    }
  },
);

// Update Lock
export const updateLock = createAsyncThunk(
  "locks/updateLock",
  async ({ lockId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/locks/${lockId}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update lock",
      );
    }
  },
);

// Unlock University
export const unlockUniversity = createAsyncThunk(
  "locks/unlockUniversity",
  async (lockId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/locks/${lockId}`);
      return lockId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unlock university",
      );
    }
  },
);

const lockSlice = createSlice({
  name: "locks",
  initialState,
  reducers: {
    clearLockState: (state) => {
      state.error = null;
    },
    clearCurrentLock: (state) => {
      state.currentLock = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Lock University
      .addCase(lockUniversity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(lockUniversity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.locks.push(action.payload);
      })
      .addCase(lockUniversity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Locks
      .addCase(fetchLocks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLocks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.locks = action.payload;
      })
      .addCase(fetchLocks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get Lock by ID
      .addCase(getLockById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLockById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLock = action.payload;
      })
      .addCase(getLockById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Lock
      .addCase(updateLock.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateLock.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.locks.findIndex(
          (lock) => lock._id === action.payload._id,
        );
        if (index !== -1) {
          state.locks[index] = action.payload;
        }
        if (state.currentLock?._id === action.payload._id) {
          state.currentLock = action.payload;
        }
      })
      .addCase(updateLock.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Unlock University
      .addCase(unlockUniversity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unlockUniversity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.locks = state.locks.filter((lock) => lock._id !== action.payload);
        if (state.currentLock?._id === action.payload) {
          state.currentLock = null;
        }
      })
      .addCase(unlockUniversity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLockState, clearCurrentLock } = lockSlice.actions;
export default lockSlice.reducer;
