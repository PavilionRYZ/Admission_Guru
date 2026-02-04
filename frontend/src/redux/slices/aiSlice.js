import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { aiCounsellorApi } from "../../api/aiCounsellorApi";

export const sendMessage = createAsyncThunk(
  "ai/sendMessage",
  async (message) => {
    const response = await aiCounsellorApi.sendMessage(message);
    return response.data.data;
  },
);

export const fetchConversation = createAsyncThunk(
  "ai/fetchConversation",
  async () => {
    const response = await aiCounsellorApi.getConversation(50);
    return response.data.data;
  },
);

export const fetchRecommendations = createAsyncThunk(
  "ai/recommendations",
  async () => {
    const response = await aiCounsellorApi.getRecommendations();
    return response.data.data;
  },
);

export const fetchAnalysis = createAsyncThunk("ai/analysis", async () => {
  const response = await aiCounsellorApi.getAnalysis();
  return response.data.data;
});

const aiSlice = createSlice({
  name: "ai",
  initialState: {
    messages: [],
    recommendations: [],
    analysis: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearConversation: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(
          {
            role: "user",
            content: action.meta.arg,
            timestamp: new Date().toISOString(),
          },
          {
            role: "assistant",
            content: action.payload.message,
            timestamp: new Date().toISOString(),
          },
        );
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload;
      })
      .addCase(fetchAnalysis.fulfilled, (state, action) => {
        state.analysis = action.payload;
      });
  },
});

export const { clearConversation } = aiSlice.actions;
export default aiSlice.reducer;
