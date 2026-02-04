import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../api/authApi";

export const login = createAsyncThunk("auth/login", async (credentials) => {
  const response = await authApi.login(credentials);
  return response.data;
});

export const signup = createAsyncThunk("auth/signup", async (data) => {
  const response = await authApi.signup(data);
  return response.data;
});

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async () => {
    const response = await authApi.getCurrentUser();
    return response.data;
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await authApi.logout();
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.data;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
