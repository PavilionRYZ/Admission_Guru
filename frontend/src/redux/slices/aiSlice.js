import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

axios.defaults.withCredentials = true;

const initialState = {
  messages: [],
  recommendations: [],
  analysis: null,
  isLoading: false,
  error: null,
};

// Send Message
export const sendMessage = createAsyncThunk(
  'ai/sendMessage',
  async (message, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/ai-counsellor/chat`, {
        message,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send message'
      );
    }
  }
);

// Fetch Conversation
export const fetchConversation = createAsyncThunk(
  'ai/fetchConversation',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/ai-counsellor/conversation`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch conversation'
      );
    }
  }
);

// Clear Conversation
export const clearConversation = createAsyncThunk(
  'ai/clearConversation',
  async (_, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/ai-counsellor/conversation`);
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to clear conversation'
      );
    }
  }
);

// Get Recommendations
export const getRecommendations = createAsyncThunk(
  'ai/getRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/ai-counsellor/recommendations`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch recommendations'
      );
    }
  }
);

// Get Profile Analysis
export const getProfileAnalysis = createAsyncThunk(
  'ai/getProfileAnalysis',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/ai-counsellor/analysis`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch profile analysis'
      );
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearAiState: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.userMessage) {
          state.messages.push(action.payload.userMessage);
        }
        if (action.payload.aiResponse) {
          state.messages.push(action.payload.aiResponse);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Conversation
      .addCase(fetchConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload || [];
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Clear Conversation
      .addCase(clearConversation.fulfilled, (state) => {
        state.messages = [];
      })

      // Get Recommendations
      .addCase(getRecommendations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRecommendations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recommendations = action.payload;
      })
      .addCase(getRecommendations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get Profile Analysis
      .addCase(getProfileAnalysis.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfileAnalysis.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analysis = action.payload;
      })
      .addCase(getProfileAnalysis.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAiState } = aiSlice.actions;
export default aiSlice.reducer;
