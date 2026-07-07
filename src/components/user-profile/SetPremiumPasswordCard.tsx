'use client';
import React, { useState } from 'react';
import axios from 'axios';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import api from '../../../lib/api';
import { useAuth } from '@/context/AuthContext';

export default function SetPremiumPasswordCard() {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password.length < 8) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 8 characters.',
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/auth/set-password', { password });
      setMessage({ type: 'success', text: response.data.message });
      setPassword('');
    } catch (err) {
      const responseMessage = axios.isAxiosError(err)
        ? err.response?.data?.message
        : undefined;
      setMessage({
        type: 'error',
        text: responseMessage || 'Could not set password. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-2">
        Premium test login
      </h4>
      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
        You&apos;re signed in with{' '}
        {user?.authProvider === 'facebook' ? 'Facebook' : 'Google'}, which is
        great for free tests.{' '}
        <strong>
          Premium tests require a separate email &amp; password login.
        </strong>
      </p>
      <p className="mb-4 text-sm text-amber-600 dark:text-amber-400">
        This form only sets up the login itself — it does not grant premium
        access by itself. If you haven&apos;t already, you&apos;ll still need to
        upgrade (purchase premium) before this login can access premium tests.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <Label>New password (email: {user?.email})</Label>
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
        </div>
        <Button size="sm" disabled={submitting}>
          {submitting ? 'Saving...' : 'Set password'}
        </Button>
      </form>
      {message && (
        <p
          className={`mt-3 text-sm ${
            message.type === 'success' ? 'text-success-600' : 'text-red-600'
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
