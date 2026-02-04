import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Import reducers
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import universityReducer from "./slices/universitySlice";
import shortlistReducer from "./slices/shortlistSlice";
import taskReducer from "./slices/taskSlice";
import aiReducer from "./slices/aiSlice";
import dashboardReducer from "./slices/dashboardSlice";
import lockReducer from "./slices/lockSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  universities: universityReducer,
  shortlist: shortlistReducer,
  tasks: taskReducer,
  ai: aiReducer,
  dashboard: dashboardReducer,
  locks: lockReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
