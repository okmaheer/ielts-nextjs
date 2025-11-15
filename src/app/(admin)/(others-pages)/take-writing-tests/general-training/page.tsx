import type { Metadata } from 'next';
import React from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TestList from '@/components/takewritingtest/TestList';
export const metadata: Metadata = {
  title: 'Writing Test List IELTS Prep & Practice',
  description: 'List of Writing Tests for ielts',
};

export default function generalTrainingTestList() {
  return (
    <div>
      <PageBreadcrumb pageTitle="General Training Writing" />
      <div className="space-y-6">
        <ComponentCard title="Test List">
          <TestList category="generalTraining" />
        </ComponentCard>
      </div>
    </div>
  );
}
