'use client';
import { ChevronLeftIcon } from '@/icons';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import api from '../../../lib/api';

export default function SignInForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleGoogleSignIn = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  const handleFacebookSignIn = () => {
    // Redirect to backend Facebook OAuth endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`;
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data.data;
      login(token, user);
      router.push('/dashboard');
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : undefined;
      setFormError(
        message || 'Could not sign in. Please check your email and password.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full bg-white dark:bg-gray-900">
      {/* Back Link */}
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5 px-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to home
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-6">
        <div>
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <h1 className="mb-3 font-bold text-gray-900 text-3xl dark:text-white sm:text-4xl">
              Welcome Back
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Sign in to continue improving your IELTS writing skills
            </p>
          </div>

          {/* Sign In Buttons */}
          <div className="space-y-3">
            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full inline-flex items-center justify-center gap-3 py-4 text-base font-medium text-white transition-all rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              style={{
                backgroundColor: '#06BBCC',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#059aa8';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#06BBCC';
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                  fill="#4285F4"
                />
                <path
                  d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                  fill="#34A853"
                />
                <path
                  d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                  fill="#FBBC05"
                />
                <path
                  d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                  fill="#EB4335"
                />
              </svg>
              Sign in with Google
            </button>

            {/* Facebook Sign In Button */}
            <button
              onClick={handleFacebookSignIn}
              className="w-full inline-flex items-center justify-center gap-3 py-4 text-base font-medium text-white transition-all rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              style={{
                backgroundColor: '#1877F2',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#166FE5';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#1877F2';
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                  fill="white"
                />
              </svg>
              Sign in with Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            <span className="text-xs text-gray-400 uppercase">
              Premium members
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
          </div>

          {/* Email & Password Sign In (required for premium test access) */}
          <form onSubmit={handleEmailSignIn} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 text-sm"
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-3 text-sm"
            />
            {formError && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {formError}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 text-sm font-medium text-white rounded-xl disabled:opacity-60"
              style={{ backgroundColor: '#111827' }}
            >
              {submitting ? 'Signing in...' : 'Sign in with email & password'}
            </button>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              This login is only needed for premium test access. Free users
              should sign in with Google above.
            </p>
          </form>

          {/* Simple Info Note */}
          <div className="mt-6">
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              By signing in, you agree to our{' '}
              <Link
                href="/terms"
                className="font-medium hover:underline"
                style={{ color: '#06BBCC' }}
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                className="font-medium hover:underline"
                style={{ color: '#06BBCC' }}
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
