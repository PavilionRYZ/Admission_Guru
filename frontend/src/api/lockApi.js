import axios from './axios';

export const lockApi = {
  lock: (data) => axios.post('/locks', data),
  getAll: () => axios.get('/locks'),
  unlock: (id, reason) => axios.patch(`/locks/${id}/unlock`, { reason }),
  updateStatus: (id, data) => axios.patch(`/locks/${id}/status`, data),
};
