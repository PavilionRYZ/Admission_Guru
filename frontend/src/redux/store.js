import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import universityReducer from './slices/universitySlice';
import shortlistReducer from './slices/shortlistSlice';
import taskReducer from './slices/taskSlice';
import aiReducer from './slices/aiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    universities: universityReducer,
    shortlist: shortlistReducer,
    tasks: taskReducer,
    ai: aiReducer,
  },
});
