import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://quinoa-legal-ostrich.abasthan.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000, // 20 detik max timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('jombe_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {}
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto-Retry on Network Failure / 5xx Blips (Up to 3 Retries)
interface RetryConfig extends AxiosRequestConfig {
  _retryCount?: number;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig;

    if (!config) {
      return Promise.reject(error);
    }

    config._retryCount = config._retryCount || 0;

    // Retry only on network errors or 502/503/504 server blips (do not retry 400/401/403/404)
    const isNetworkOrServerBlip = !error.response || (error.response.status >= 500 && error.response.status <= 504);

    if (isNetworkOrServerBlip && config._retryCount < 3) {
      config._retryCount += 1;
      const delayMs = Math.pow(2, config._retryCount) * 500; // Exponential backoff: 1s, 2s, 4s

      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return api(config);
    }

    // Handle 401 Unauthorized Gracefully
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      try {
        localStorage.removeItem('jombe_token');
        localStorage.removeItem('jombe_user');
      } catch (e) {}
    }

    return Promise.reject(error);
  }
);

export default api;
