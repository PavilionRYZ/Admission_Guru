import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}`;

axios.defaults.withCredentials = true;

const initialState = {
  list: [],
  currentUniversity: null,
  filters: {
    country: [],
    degree: "",
    fieldOfStudy: "",
    minRanking: "",
    maxRanking: "",
    minCost: "",
    maxCost: "",
    search: "",
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalUniversities: 0,
  },
  isLoading: false,
  error: null,
  message: null,
};

// Fetch Universities with filters
export const fetchUniversities = createAsyncThunk(
  "universities/fetchUniversities",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          if (Array.isArray(filters[key])) {
            filters[key].forEach((value) => params.append(key, value));
          } else {
            params.append(key, filters[key]);
          }
        }
      });

      const response = await axios.get(
        `${API_URL}/universities?${params.toString()}`,
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch universities",
      );
    }
  },
);

// Fetch Single University
export const fetchUniversityById = createAsyncThunk(
  "universities/fetchUniversityById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/universities/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch university details",
      );
    }
  },
);

// Search Universities
export const searchUniversities = createAsyncThunk(
  "universities/searchUniversities",
  async (searchQuery, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/universities/search`, {
        params: { q: searchQuery },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search universities",
      );
    }
  },
);

const universitySlice = createSlice({
  name: "universities",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearUniversityState: (state) => {
      state.error = null;
      state.message = null;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Universities
      .addCase(fetchUniversities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUniversities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.universities || action.payload;
        state.pagination = {
          currentPage: action.payload.currentPage || 1,
          totalPages: action.payload.totalPages || 1,
          totalUniversities:
            action.payload.totalUniversities || action.payload.length,
        };
      })
      .addCase(fetchUniversities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch University by ID
      .addCase(fetchUniversityById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUniversityById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUniversity = action.payload;
      })
      .addCase(fetchUniversityById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Search Universities
      .addCase(searchUniversities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchUniversities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(searchUniversities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  clearUniversityState,
  setCurrentPage,
} = universitySlice.actions;
export default universitySlice.reducer;
