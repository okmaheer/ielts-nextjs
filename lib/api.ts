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

  console.log('🌐 API Interceptor - Request:', {
    url: config.url,
    hasToken: !!token,
    tokenLength: token?.length,
  });

  if (token) {
    // Check if expired
    const expired = isTokenExpired(token);
    console.log('🌐 API Interceptor - Token check:', {
      expired,
      token: token.substring(0, 20) + '...',
    });

    if (expired) {
      console.error(
        '❌ API Interceptor - Token expired, redirecting to signin'
      );
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
    console.log('✅ API Interceptor - Token added to request');
  } else {
    console.warn('⚠️ API Interceptor - No token found in localStorage');
  }

  return config;
});

// If backend says 401 (Unauthorized)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error(
        '❌ API Interceptor - 401 Unauthorized, redirecting to signin'
      );
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
