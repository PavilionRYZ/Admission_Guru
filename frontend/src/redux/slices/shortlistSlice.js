import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { shortlistApi } from '../../api/shortlistApi';

export const fetchShortlist = createAsyncThunk(
  'shortlist/fetchAll',
  async (category) => {
    const response = await shortlistApi.getAll(category);
    return response.data.data;
  }
);

export const addToShortlist = createAsyncThunk(
  'shortlist/add',
  async (data) => {
    const response = await shortlistApi.add(data);
    return response.data.data;
  }
);

export const removeFromShortlist = createAsyncThunk(
  'shortlist/remove',
  async (id) => {
    await shortlistApi.remove(id);
    return id;
  }
);

export const fetchShortlistStats = createAsyncThunk(
  'shortlist/stats',
  async () => {
    const response = await shortlistApi.getStats();
    return response.data.data;
  }
);

const shortlistSlice = createSlice({
  name: 'shortlist',
  initialState: {
    items: [],
    stats: { total: 0, locked: 0, byCategory: {} },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShortlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShortlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchShortlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addToShortlist.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFromShortlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(fetchShortlistStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export default shortlistSlice.reducer;
