import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}`;

axios.defaults.withCredentials = true;

const initialState = {
  list: [],
  filteredList: [],
  filters: {
    status: "",
    priority: "",
    category: "",
  },
  stats: {
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
  },
  isLoading: false,
  error: null,
  message: null,
};

// Fetch All Tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(`${API_URL}/tasks?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks",
      );
    }
  },
);

// Create Task
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/tasks`, taskData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create task",
      );
    }
  },
);

// Update Task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/tasks/${id}`, updates);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task",
      );
    }
  },
);

// Complete Task
export const completeTask = createAsyncThunk(
  "tasks/completeTask",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/tasks/${id}/complete`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to complete task",
      );
    }
  },
);

// Delete Task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task",
      );
    }
  },
);

// Generate AI Tasks
export const generateAITasks = createAsyncThunk(
  "tasks/generateAITasks",
  async (universityId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/tasks/generate`, {
        universityId,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate AI tasks",
      );
    }
  },
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTaskFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearTaskFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearTaskState: (state) => {
      state.error = null;
      state.message = null;
    },
    calculateStats: (state) => {
      state.stats = {
        total: state.list.length,
        completed: state.list.filter((task) => task.status === "Completed")
          .length,
        pending: state.list.filter((task) => task.status === "Pending").length,
        inProgress: state.list.filter((task) => task.status === "In Progress")
          .length,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
        state.filteredList = action.payload;
        state.stats = {
          total: action.payload.length,
          completed: action.payload.filter(
            (task) => task.status === "Completed",
          ).length,
          pending: action.payload.filter((task) => task.status === "Pending")
            .length,
          inProgress: action.payload.filter(
            (task) => task.status === "In Progress",
          ).length,
        };
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create Task
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list.push(action.payload);
        state.message = "Task created successfully";
        state.stats.total += 1;
        if (action.payload.status === "Pending") state.stats.pending += 1;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.list.findIndex(
          (task) => task._id === action.payload._id,
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        state.message = "Task updated successfully";
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Complete Task
      .addCase(completeTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.list.findIndex(
          (task) => task._id === action.payload._id,
        );
        if (index !== -1) {
          const oldStatus = state.list[index].status;
          state.list[index] = action.payload;

          // Update stats
          if (oldStatus === "Pending") state.stats.pending -= 1;
          if (oldStatus === "In Progress") state.stats.inProgress -= 1;
          state.stats.completed += 1;
        }
        state.message = "Task completed!";
      })
      .addCase(completeTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const task = state.list.find((t) => t._id === action.payload);
        state.list = state.list.filter((task) => task._id !== action.payload);
        state.message = "Task deleted";

        // Update stats
        if (task) {
          state.stats.total -= 1;
          if (task.status === "Completed") state.stats.completed -= 1;
          if (task.status === "Pending") state.stats.pending -= 1;
          if (task.status === "In Progress") state.stats.inProgress -= 1;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Generate AI Tasks
      .addCase(generateAITasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(generateAITasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = [...state.list, ...action.payload];
        state.message = `${action.payload.length} AI tasks generated successfully`;
        state.stats.total += action.payload.length;
        state.stats.pending += action.payload.length;
      })
      .addCase(generateAITasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setTaskFilters,
  clearTaskFilters,
  clearTaskState,
  calculateStats,
} = taskSlice.actions;
export default taskSlice.reducer;
