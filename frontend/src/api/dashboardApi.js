import axios from './axios';

export const dashboardApi = {
  getDashboard: () => axios.get('/dashboard'),
  getProfileSummary: () => axios.get('/dashboard/profile-summary'),
  getNextSteps: () => axios.get('/dashboard/next-steps'),
};
