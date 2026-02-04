import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}`;

axios.defaults.withCredentials = true;

const initialState = {
  items: [],
  categorized: {
    Dream: [],
    Target: [],
    Safe: [],
  },
  lockedUniversities: [],
  isLoading: false,
  error: null,
  message: null,
};

// Fetch Shortlist
export const fetchShortlist = createAsyncThunk(
  "shortlist/fetchShortlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/shortlist`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch shortlist",
      );
    }
  },
);

// Add to Shortlist
export const addToShortlist = createAsyncThunk(
  "shortlist/addToShortlist",
  async ({ universityId, category, notes }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/shortlist`, {
        universityId,
        category,
        notes,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to shortlist",
      );
    }
  },
);

// Update Shortlist Item
export const updateShortlistItem = createAsyncThunk(
  "shortlist/updateShortlistItem",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/shortlist/${id}`, updates);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update shortlist item",
      );
    }
  },
);

// Remove from Shortlist
export const removeFromShortlist = createAsyncThunk(
  "shortlist/removeFromShortlist",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/shortlist/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove from shortlist",
      );
    }
  },
);

// Lock University
export const lockUniversity = createAsyncThunk(
  "shortlist/lockUniversity",
  async (universityId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/lock`, { universityId });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to lock university",
      );
    }
  },
);

// Fetch Locked Universities
export const fetchLockedUniversities = createAsyncThunk(
  "shortlist/fetchLockedUniversities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/lock`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch locked universities",
      );
    }
  },
);

// Unlock University 
export const unlockUniversity = createAsyncThunk(
  "shortlist/unlockUniversity",
  async (lockId, { rejectWithValue }) => {
    try {
      await axios.patch(`${API_URL}/lock/${lockId}/unlock`);
      return lockId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unlock university",
      );
    }
  },
);

const shortlistSlice = createSlice({
  name: "shortlist",
  initialState,
  reducers: {
    clearShortlistState: (state) => {
      state.error = null;
      state.message = null;
    },
    categorizeShortlist: (state) => {
      state.categorized = {
        Dream: state.items.filter((item) => item.category === "Dream"),
        Target: state.items.filter((item) => item.category === "Target"),
        Safe: state.items.filter((item) => item.category === "Safe"),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Shortlist
      .addCase(fetchShortlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShortlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.categorized = {
          Dream: action.payload.filter((item) => item.category === "Dream"),
          Target: action.payload.filter((item) => item.category === "Target"),
          Safe: action.payload.filter((item) => item.category === "Safe"),
        };
      })
      .addCase(fetchShortlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add to Shortlist
      .addCase(addToShortlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(addToShortlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
        state.message = "Added to shortlist successfully";
        // Re-categorize
        state.categorized = {
          Dream: state.items.filter((item) => item.category === "Dream"),
          Target: state.items.filter((item) => item.category === "Target"),
          Safe: state.items.filter((item) => item.category === "Safe"),
        };
      })
      .addCase(addToShortlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Shortlist Item
      .addCase(updateShortlistItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateShortlistItem.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.message = "Shortlist updated successfully";
        // Re-categorize
        state.categorized = {
          Dream: state.items.filter((item) => item.category === "Dream"),
          Target: state.items.filter((item) => item.category === "Target"),
          Safe: state.items.filter((item) => item.category === "Safe"),
        };
      })
      .addCase(updateShortlistItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Remove from Shortlist
      .addCase(removeFromShortlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromShortlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
        state.message = "Removed from shortlist";
        // Re-categorize
        state.categorized = {
          Dream: state.items.filter((item) => item.category === "Dream"),
          Target: state.items.filter((item) => item.category === "Target"),
          Safe: state.items.filter((item) => item.category === "Safe"),
        };
      })
      .addCase(removeFromShortlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Lock University
      .addCase(lockUniversity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(lockUniversity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lockedUniversities.push(action.payload);
        state.message = "University locked successfully";
      })
      .addCase(lockUniversity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Locked Universities
      .addCase(fetchLockedUniversities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLockedUniversities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lockedUniversities = action.payload;
      })
      .addCase(fetchLockedUniversities.rejected, (state, action) => {
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
        state.lockedUniversities = state.lockedUniversities.filter(
          (lock) => lock._id !== action.payload,
        );
        state.message = "University unlocked successfully";
      })
      .addCase(unlockUniversity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearShortlistState, categorizeShortlist } =
  shortlistSlice.actions;
export default shortlistSlice.reducer;
