// src/api/axiosInstance.js
import axios from 'axios';

// ─── Environment Configuration ──────────────────────────────────────────────
// Vite exposes env variables via import.meta.env; prefix with VITE_
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/';

// ─── Axios Instance ──────────────────────────────────────────────────────────
const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds – adjust to your API's typical response time
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor: Attach Access Token ──────────────────────────────
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Token Refresh with Queue ────────────────────────
let refreshPromise = null; // shared promise to prevent concurrent refresh requests

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 Unauthorized and if we haven't retried this request yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If no refresh is currently in flight, start one
      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            // Use the same axios instance to call the refresh endpoint
            const response = await instance.post('/auth/token/refresh/', {
              refresh: refreshToken,
            });

            const { access } = response.data;
            localStorage.setItem('accessToken', access);
            return access;
          } catch (refreshError) {
            // Refresh failed – clear all session data and redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');

            // Optional: log the error to your monitoring service (e.g., Sentry)
            // console.error('Token refresh failed:', refreshError);

            // Redirect to login page (use your router's navigate if available)
            // For a React app, you could import history or use a global navigation service.
            window.location.href = '/login';

            // Re-throw so the original request fails with the refresh error
            throw refreshError;
          } finally {
            refreshPromise = null; // reset for future attempts
          }
        })();
      }

      // Wait for the refresh to complete, then retry the original request
      try {
        const newAccessToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (err) {
        // If refresh failed, the promise already redirected; just reject
        return Promise.reject(err);
      }
    }

    // For all other errors (non-401 or already retried), just reject
    return Promise.reject(error);
  }
);

export default instance;