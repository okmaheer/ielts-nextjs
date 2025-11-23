import type { Metadata } from 'next';
import { EcommerceMetrics } from '@/components/ecommerce/EcommerceMetrics';
import React from 'react';
import MonthlyTarget from '@/components/ecommerce/MonthlyTarget';
import MonthlySalesChart from '@/components/ecommerce/MonthlySalesChart';
import StatisticsChart from '@/components/ecommerce/StatisticsChart';
import RecentOrders from '@/components/ecommerce/RecentOrders';
import DemographicCard from '@/components/ecommerce/DemographicCard';

export const metadata: Metadata = {
  title: 'IELTS Writing Practice Tests | AI + Expert Review',
  description:
    'Master IELTS Writing with AI-powered instant feedback and expert human review. Practice Academic and General Training tests under real exam conditions.',
  keywords: [
    'IELTS',
    'Writing Test',
    'IELTS Practice',
    'Academic Writing',
    'General Training',
    'AI Feedback',
    'Expert Review',
  ],
  openGraph: {
    title: 'IELTS Writing Practice Tests | AI + Expert Review',
    description:
      'Master IELTS Writing with AI-powered instant feedback and expert human review.',
    type: 'website',
  },
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
  );
}
