'use client';
import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const hasProcessed = useRef(false); // ← Prevent multiple calls

  useEffect(() => {
    // Only run once
    if (hasProcessed.current) {
      console.log('⏭️ Auth Callback - Already processed, skipping');
      return;
    }
    hasProcessed.current = true;

    console.log('\n🔥 Frontend Auth Callback - START');
    console.log('🔥 Full URL:', window.location.href);
    console.log('🔥 Search params string:', window.location.search);
    console.log('🔍 Auth Callback - login function available:', typeof login);

    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const error = searchParams.get('error');

    console.log('🔍 Auth Callback - Parameters:', {
      hasToken: !!token,
      hasUser: !!userParam,
      hasError: !!error,
      tokenLength: token?.length,
      userParamLength: userParam?.length,
      tokenPreview: token ? token.substring(0, 30) + '...' : null,
    });

    if (error) {
      console.error('❌ Authentication error:', error);
      router.push('/signin?error=' + error);
      return;
    }

    if (token && userParam) {
      try {
        console.log('🔍 Auth Callback - Attempting to parse user data...');
        const userData = JSON.parse(userParam);
        console.log('✅ Auth Callback - Parsed user data:', {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          roles: userData.roles,
          isAdmin: userData.isAdmin,
          authProvider: userData.authProvider,
        });

        // Use the login function from AuthContext
        console.log('🔑 Auth Callback - About to call login() with:', {
          tokenLength: token.length,
          userData: userData,
        });

        if (typeof login !== 'function') {
          console.error(
            '❌ Auth Callback - login is not a function!',
            typeof login
          );
          // Fallback: manually save to localStorage
          console.log('🔧 Auth Callback - Using fallback localStorage save');
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(userData));

          // Set cookie manually
          const expires = new Date();
          expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000);
          document.cookie = `authToken=${token};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
          console.log('✅ Auth Callback - Fallback save complete');
        } else {
          login(token, userData);
          console.log('✅ Auth Callback - login() called successfully');
        }

        // Verify data was saved
        const savedToken = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('user');
        console.log('🔍 Auth Callback - Verification:', {
          tokenSaved: !!savedToken,
          userSaved: !!savedUser,
          savedTokenLength: savedToken?.length,
        });

        console.log(
          '✅ Auth Callback - Login successful, redirecting to dashboard'
        );
        console.log('🔥 Frontend Auth Callback - END\n');

        // Small delay to ensure data is saved
        setTimeout(() => {
          console.log('🚀 Redirecting to /dashboard...');
          router.push('/dashboard');
        }, 100);
      } catch (err) {
        console.error('❌ Error parsing user data:', err);
        console.error('❌ User param that failed to parse:', userParam);
        console.log('🔥 Frontend Auth Callback - FAILED (parse error)\n');
        router.push('/signin?error=invalid_data');
      }
    } else {
      console.warn('⚠️ Missing token or user data, redirecting to signin');
      console.warn('⚠️ Token present:', !!token);
      console.warn('⚠️ User param present:', !!userParam);
      console.log('🔥 Frontend Auth Callback - FAILED (missing data)\n');
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
