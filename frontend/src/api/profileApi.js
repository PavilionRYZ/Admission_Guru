import axios from './axios';

export const profileApi = {
  createOrUpdate: (data) => axios.post('/profile/ed-profile', data),
  getProfile: () => axios.get('/profile/ed-profile/me'),
  updateProfile: (data) => axios.patch('/profile/update', data),
  deleteProfile: () => axios.delete('/profile/me/delete'),
  checkOnboardingStatus: () => axios.get('/profile/onboarding-status'),
};
