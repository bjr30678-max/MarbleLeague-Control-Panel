import axios from 'axios';
import { STORAGE_KEYS } from '@/constants';

const API_BASE_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_URL || 'https://api.bjr8888.com');

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request: 自動帶 X-Session-ID
httpClient.interceptors.request.use((config) => {
  const sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);
  if (sessionId && config.headers) {
    config.headers['X-Session-ID'] = sessionId;
  }
  return config;
});

// Response: 解包 response.data
httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 登入請求的 401 不做自動跳轉，由呼叫端處理錯誤訊息
    const isLoginRequest = error.config?.url?.includes('/login');
    if (error.response?.status === 401 && !isLoginRequest) {
      sessionStorage.removeItem(STORAGE_KEYS.SESSION_ID);
      sessionStorage.removeItem(STORAGE_KEYS.OPERATOR);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default httpClient;
