import axios from './axios';

export const aiCounsellorApi = {
  sendMessage: (message) => axios.post('/ai-counsellor/message', { message }),
  getConversation: (limit) => axios.get('/ai-counsellor/conversation', { params: { limit } }),
  getRecommendations: () => axios.get('/ai-counsellor/recommendations'),
  getAnalysis: () => axios.get('/ai-counsellor/analyze-profile'),
  clearConversation: () => axios.delete('/ai-counsellor/conversation'),
};
