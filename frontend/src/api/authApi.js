import axios from './axios';

export const authApi = {
  signup: (data) => axios.post('/auth/signup', data),
  verifyOtp: (data) => axios.post('/auth/verify-otp', data),
  login: (data) => axios.post('/auth/login', data),
  googleLogin: (token) => axios.post('/auth/google', { token }),
  logout: () => axios.post('/auth/logout'),
  getCurrentUser: () => axios.get('/auth/me'),
  updateProfile: (data) => axios.patch('/auth/profile', data),
  updatePassword: (data) => axios.patch('/auth/password', data),
  forgotPassword: (email) => axios.post('/auth/forgot-password', { email }),
  resetPassword: (token, data) => axios.post(`/auth/reset-password/${token}`, data),
};
