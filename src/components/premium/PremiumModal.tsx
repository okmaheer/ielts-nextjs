'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import { Crown, CheckCircle, Loader2 } from 'lucide-react';
import {
  paymentService,
  SubscriptionInfo,
} from '../../../lib/services/paymentService';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const [subscriptionInfo, setSubscriptionInfo] =
    useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [initiating, setInitiating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !subscriptionInfo) {
      fetchSubscriptionInfo();
    }
  }, [isOpen, subscriptionInfo]);

  const fetchSubscriptionInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const info = await paymentService.getSubscriptionInfo();
      setSubscriptionInfo(info);
    } catch {
      setError('Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      setInitiating(true);
      setError(null);
      const { paymentUrl } = await paymentService.initiatePayment();
      window.location.href = paymentUrl;
    } catch {
      setError('Failed to initiate payment. Please try again.');
      setInitiating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg p-6 sm:p-8">
      <div className="text-center">
        {/* Crown Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
          <Crown className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        </div>

        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Upgrade to Premium
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Unlock all premium tests and maximize your IELTS preparation
        </p>

        {loading ? (
          <div className="py-8">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          </div>
        ) : subscriptionInfo ? (
          <>
            {/* What's Included */}
            <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-left dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                What&apos;s included:
              </h3>
              <ul className="space-y-2">
                {subscriptionInfo.testCounts.academicWriting > 0 && (
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                    {subscriptionInfo.testCounts.academicWriting} Academic
                    Writing Tests
                  </li>
                )}
                {subscriptionInfo.testCounts.generalTrainingWriting > 0 && (
                  <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                    {subscriptionInfo.testCounts.generalTrainingWriting} General
                    Training Writing Tests
                  </li>
                )}
                <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                  AI-powered evaluation for all tests
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                  Detailed band score breakdown
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                  Expert review access
                </li>
              </ul>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {subscriptionInfo.currency}{' '}
                {parseFloat(subscriptionInfo.price).toLocaleString()}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {' '}
                / one-time
              </span>
            </div>

            {/* Buy Now Button */}
            <Button
              onClick={handleBuyNow}
              variant="primary"
              size="md"
              className="w-full"
              disabled={initiating}
            >
              {initiating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Buy Now'
              )}
            </Button>
          </>
        ) : null}

        {error && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    </Modal>
  );
}
