import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskApi } from '../../api/taskApi';

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (params) => {
  const response = await taskApi.getAll(params);
  return response.data.data;
});

export const createTask = createAsyncThunk('tasks/create', async (data) => {
  const response = await taskApi.create(data);
  return response.data.data;
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, data }) => {
  const response = await taskApi.update(id, data);
  return response.data.data;
});

export const completeTask = createAsyncThunk('tasks/complete', async (id) => {
  const response = await taskApi.complete(id);
  return response.data.data;
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id) => {
  await taskApi.delete(id);
  return id;
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.list.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        const index = state.list.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t._id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
