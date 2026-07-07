import SetPremiumPasswordCard from '@/components/user-profile/SetPremiumPasswordCard';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Premium Test Login | IELTS Prep & Practice',
  description: 'Set up an email and password login for premium test access.',
};

export default function PremiumLoginSetup() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Premium Test Access
        </h3>
        <div className="space-y-6">
          <SetPremiumPasswordCard />
        </div>
      </div>
    </div>
  );
}
