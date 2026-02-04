import axios from './axios';

export const taskApi = {
  create: (data) => axios.post('/tasks', data),
  getAll: (params) => axios.get('/tasks', { params }),
  getById: (id) => axios.get(`/tasks/${id}`),
  update: (id, data) => axios.patch(`/tasks/${id}`, data),
  complete: (id) => axios.patch(`/tasks/${id}/complete`),
  delete: (id) => axios.delete(`/tasks/${id}`),
  getStats: () => axios.get('/tasks/stats'),
};
