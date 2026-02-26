import axios from 'axios';

const API = axios.create({
  baseURL: '/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data)
};

export const propertyAPI = {
  getAll: (params) => API.get('/properties', { params }),
  getById: (id) => API.get(`/properties/${id}`),
  getMyProperties: () => API.get('/properties/owner/my-properties'),
  create: (data) => API.post('/properties', data),
  update: (id, data) => API.put(`/properties/${id}`, data),
  delete: (id) => API.delete(`/properties/${id}`)
};

export const bookingAPI = {
  create: (data) => API.post('/bookings', data),
  getMyBookings: () => API.get('/bookings/my-bookings'),
  getOwnerRequests: () => API.get('/bookings/owner/requests'),
  updateStatus: (id, status) => API.put(`/bookings/${id}/status`, { status })
};

export const adminAPI = {
  getPendingOwners: () => API.get('/admin/pending-owners'),
  approveOwner: (id, isApproved) => API.put(`/admin/approve-owner/${id}`, { isApproved }),
  getAllUsers: () => API.get('/admin/users')
};

export default API;
