import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// ✅ Add token automatically if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // must match your Login.jsx & ProtectedRoute
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
