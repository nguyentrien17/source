import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

function getCookie(name: string) {
  const parts = document.cookie.split(';').map((p) => p.trim());
  for (const part of parts) {
    if (part.startsWith(`${name}=`)) {
      return decodeURIComponent(part.slice(name.length + 1));
    }
  }
  return null;
}

// Tự động đính kèm CSRF token (double-submit cookie) cho request thay đổi trạng thái
api.interceptors.request.use((config) => {
  const method = (config.method || 'get').toLowerCase();
  const isSafe = method === 'get' || method === 'head' || method === 'options';

  if (!isSafe) {
    const csrfToken = getCookie('csrf_token');
    if (csrfToken) {
      config.headers = config.headers || {};
      config.headers['x-csrf-token'] = csrfToken;
    }
  }

  return config;
});

export { isAxiosError } from 'axios';
export default api;
