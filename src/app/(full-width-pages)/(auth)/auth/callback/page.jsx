'use client';
import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      console.error('Authentication error:', error);
      router.push('/signin?error=' + error);
      return;
    }

    if (token && userParam) {
      try {
        const userData = JSON.parse(userParam);

        if (typeof login !== 'function') {
          // Fallback: manually save to localStorage
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(userData));

          const expires = new Date();
          expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000);
          document.cookie = `authToken=${token};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
        } else {
          login(token, userData);
        }

        // Small delay to ensure data is saved
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
      } catch (err) {
        console.error('Error parsing user data:', err);
        router.push('/signin?error=invalid_data');
      }
    } else {
      router.push('/signin');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="fixed inset-0 w-full h-full bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Signing you in...
        </p>
      </div>
    </div>
  );
}
