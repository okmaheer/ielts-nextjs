import type { Metadata } from 'next';
import React from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import TestList from '@/components/takewritingtest/TestList';
export const metadata: Metadata = {
  title: 'IELTS Academic Writing Tests | IELTS Prep & Practice',
  description:
    'Browse and take IELTS Academic Writing tests with AI evaluation and expert review.',
};

export default function academicTestList() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Academic Writing" />
      <div className="space-y-6">
        <ComponentCard title="Test List">
          <TestList category="academic" />
        </ComponentCard>
      </div>
    </div>
  );
}
