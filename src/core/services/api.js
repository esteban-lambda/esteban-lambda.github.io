import axios from 'axios';
import { logger } from '../utils/logger';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log API requests in development
    logger.api(config.method, config.url, config.data || config.params);
    
    return config;
  },
  (error) => {
    logger.error('API Request Error', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log successful API responses in development
    logger.apiResponse(response.status, response.config.url, response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log API errors
    logger.apiResponse(
      error.response?.status || 500,
      error.config?.url || 'unknown',
      error.response?.data
    );

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresco: refreshToken,
        });

        localStorage.setItem('accessToken', data.acceso);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.acceso}`;
        
        logger.info('Token refreshed successfully');
        return api(originalRequest);
      } catch (err) {
        logger.error('Token refresh failed', err);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
