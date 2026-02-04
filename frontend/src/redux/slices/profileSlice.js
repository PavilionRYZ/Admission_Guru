import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { profileApi } from '../../api/profileApi';

export const fetchProfile = createAsyncThunk('profile/fetch', async () => {
  const response = await profileApi.getProfile();
  return response.data.data;
});

export const createOrUpdateProfile = createAsyncThunk(
  'profile/createOrUpdate',
  async (data) => {
    const response = await profileApi.createOrUpdate(data);
    return response.data.data;
  }
);

export const checkOnboarding = createAsyncThunk('profile/checkOnboarding', async () => {
  const response = await profileApi.checkOnboardingStatus();
  return response.data;
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    loading: false,
    error: null,
    onboardingComplete: false,
    currentStage: 'Building Profile',
  },
  reducers: {
    clearProfile: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.onboardingComplete = action.payload?.isOnboardingComplete || false;
        state.currentStage = action.payload?.currentStage || 'Building Profile';
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createOrUpdateProfile.fulfilled, (state, action) => {
        state.data = action.payload;
        state.onboardingComplete = true;
        state.currentStage = action.payload.currentStage;
      })
      .addCase(checkOnboarding.fulfilled, (state, action) => {
        state.onboardingComplete = action.payload.isComplete;
        state.currentStage = action.payload.currentStage;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
