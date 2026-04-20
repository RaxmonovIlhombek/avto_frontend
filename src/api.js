import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

// Request interceptor to attach the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized, clear the stale token
      localStorage.removeItem('token');
      // Optional: window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

export const getSpaces = () => api.get('spaces/');
export const getLots = () => api.get('lots/');
export const getBookings = () => api.get('bookings/');
export const createBooking = (data) => api.post('bookings/', data);

export default api;
