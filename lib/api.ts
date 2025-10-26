import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050',
});

// Check if token is expired (decode JWT)
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

// Before every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');

  if (token) {
    // Check if expired
    if (isTokenExpired(token)) {
      // Clear everything
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      document.cookie =
        'authToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
      window.location.href = '/signin';
      return Promise.reject(new Error('Token expired'));
    }

    // Add token to request
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// If backend says 401 (Unauthorized)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      document.cookie =
        'authToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default api;
