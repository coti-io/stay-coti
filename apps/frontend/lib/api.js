import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'https://beta-api-stay.appscyclone.com',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.NEXT_PUBLIC_X_API_KEY || 'fB7ohctLt5QsJIQYIyn7nhe5K75m6dVd'
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // You can transform response data here
    return response;
  },
  (error) => {
    // Handle common errors here
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          console.error('Unauthorized access');
          break;
        case 403:
          // Handle forbidden
          console.error('Forbidden access');
          break;
        case 404:
          // Handle not found
          console.error('Resource not found');
          break;
        case 500:
          // Handle server error
          console.error('Internal server error');
          break;
        default:
          console.error('An error occurred:', error.message);
      }
    }
    return Promise.reject(error);
  }
);

export default api;