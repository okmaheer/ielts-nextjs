'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { paymentService } from '../../../../../lib/services/paymentService';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function PaymentCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, updateUser } = useAuth();
  const hasProcessed = useRef(false);
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>(
    'processing'
  );
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processCallback = async () => {
      try {
        // Collect all query params to forward to backend
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });

        const result = await paymentService.verifyCallback(params);

        if (result.isSuccess) {
          setStatus('success');
          setMessage(
            'Payment successful! Your premium access has been activated.'
          );

          // Update local user state
          if (user) {
            updateUser({ ...user, isUserPaid: true });
          }

          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        } else {
          setStatus('failed');
          setMessage('Payment could not be verified. Please contact support.');
          setTimeout(() => {
            router.push('/dashboard');
          }, 5000);
        }
      } catch (err) {
        console.error('Payment callback error:', err);
        setStatus('failed');
        setMessage(
          'Something went wrong while verifying your payment. Please contact support.'
        );
        setTimeout(() => {
          router.push('/dashboard');
        }, 5000);
      }
    };

    processCallback();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="fixed inset-0 z-50 flex w-full items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center max-w-md px-6">
        {status === 'processing' && (
          <>
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              Payment Successful!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
              Redirecting to dashboard...
            </p>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              Payment Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
              Redirecting to dashboard...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
