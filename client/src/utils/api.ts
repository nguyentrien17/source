import axios from 'axios';
import { AUTH_KEY } from './constants';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Tự động đính kèm Bearer token từ localStorage vào mọi request
api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      const { token } = JSON.parse(stored) as { token: string };
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Bỏ qua lỗi parse
  }
  return config;
});

export { isAxiosError } from 'axios';
export default api;
