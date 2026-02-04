import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { universityApi } from '../../api/universityApi';

export const fetchUniversities = createAsyncThunk(
  'universities/fetchAll',
  async (params) => {
    const response = await universityApi.getAll(params);
    return response.data;
  }
);

export const fetchUniversityById = createAsyncThunk(
  'universities/fetchById',
  async (id) => {
    const response = await universityApi.getById(id);
    return response.data.data;
  }
);

export const fetchMatchedUniversities = createAsyncThunk(
  'universities/fetchMatched',
  async () => {
    const response = await universityApi.getMatched();
    return response.data.data;
  }
);

export const searchUniversities = createAsyncThunk(
  'universities/search',
  async (query) => {
    const response = await universityApi.search(query);
    return response.data.data;
  }
);

const universitySlice = createSlice({
  name: 'universities',
  initialState: {
    list: [],
    matched: [],
    selected: null,
    loading: false,
    error: null,
    filters: {
      country: [],
      degree: '',
      field: '',
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { country: [], degree: '', field: '' };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUniversities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUniversities.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
      })
      .addCase(fetchUniversities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUniversityById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(fetchMatchedUniversities.fulfilled, (state, action) => {
        state.matched = action.payload;
      })
      .addCase(searchUniversities.fulfilled, (state, action) => {
        state.list = action.payload;
      });
  },
});

export const { setFilters, clearFilters } = universitySlice.actions;
export default universitySlice.reducer;
