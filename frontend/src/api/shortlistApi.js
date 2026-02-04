import axios from './axios';

export const shortlistApi = {
  add: (data) => axios.post('/shortlist', data),
  getAll: (category) => axios.get('/shortlist', { params: { category } }),
  getStats: () => axios.get('/shortlist/stats'),
  update: (id, data) => axios.patch(`/shortlist/${id}`, data),
  remove: (id) => axios.delete(`/shortlist/${id}`),
};
