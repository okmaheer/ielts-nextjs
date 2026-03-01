// components/takewritingtest/TestList.tsx

'use client';

import Button from '@/components/ui/button/Button';
import { useEffect, useState, useCallback, useRef } from 'react';
import {
  writingTestService,
  WritingTest,
  TestCategory,
} from '../../../lib/services/writingTestService';
import {
  FileText,
  BookOpen,
  RefreshCw,
  ArrowRight,
  Clock,
  Target,
  CheckCircle,
  Award,
  Eye,
  Crown,
  Lock,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import PremiumModal from '@/components/premium/PremiumModal';
import { usePremium } from '@/hooks/usePremium';

interface TestListProps {
  category: TestCategory;
}

// Content configuration based on category
const categoryConfig = {
  academic: {
    title: 'IELTS Academic Writing Tests',
    description:
      'Choose a writing test to begin. Each test includes Task 1 (graph/chart description) and Task 2 (essay writing) with comprehensive evaluation and feedback.',
    icon: BookOpen,
    routePrefix: '/take-writing-tests/academic',
  },
  generalTraining: {
    title: 'IELTS General Training Writing Tests',
    description:
      'Choose a writing test to begin. Each test includes Task 1 (letter writing) and Task 2 (essay writing) with comprehensive evaluation and feedback.',
    icon: BookOpen,
    routePrefix: '/take-writing-tests/general-training',
  },
};

export default function TestList({ category }: TestListProps) {
  const [tests, setTests] = useState<WritingTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const premiumAutoShown = useRef(false);

  const config = categoryConfig[category];
  const IconComponent = config.icon;

  const {
    isUserPaid,
    isTestLocked,
    isPaidTest,
    hasCompletedAllFreeTests,
    isPremiumModalOpen,
    openPremiumModal,
    closePremiumModal,
  } = usePremium();

  const fetchTests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await writingTestService.getTestsByCategory(category);
      setTests(data);
    } catch (err) {
      const e = err as
        | { message?: string; response?: { data?: { message?: string } } }
        | undefined;
      const message =
        e?.message ?? e?.response?.data?.message ?? 'Failed to load tests';
      setError(String(message));
      console.error('Error fetching tests:', err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  // Auto-show premium modal when all free tests are completed
  useEffect(() => {
    if (
      !loading &&
      tests.length > 0 &&
      !isUserPaid &&
      !premiumAutoShown.current
    ) {
      if (hasCompletedAllFreeTests(tests)) {
        premiumAutoShown.current = true;
        openPremiumModal();
      }
    }
  }, [loading, tests, isUserPaid, hasCompletedAllFreeTests, openPremiumModal]);

  const handleStartTest = (testId: number) => {
    const test = tests.find(t => t.id === testId);
    if (test && isTestLocked(test)) {
      openPremiumModal();
      return;
    }
    router.push(`${config.routePrefix}/${testId}/instructions`);
  };

  const handleViewResults = (submissionId: string) => {
    router.push(`/writing-test-results/${submissionId}`);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="mx-auto mb-8 w-full max-w-[900px] text-center">
        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
          <IconComponent className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mb-4 font-bold text-gray-900 text-3xl dark:text-white sm:text-4xl">
          {config.title}
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400 sm:text-lg">
          {config.description}
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading tests...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/30 dark:bg-red-900/10">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h3 className="mb-2 font-semibold text-red-800 dark:text-red-300">
            Error Loading Tests
          </h3>
          <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
          <Button
            onClick={fetchTests}
            variant="primary"
            size="sm"
            startIcon={<RefreshCw className="h-4 w-4" />}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && tests.length === 0 && (
        <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900/20">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
            No Tests Available
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            There are no active{' '}
            {category === 'academic' ? 'academic' : 'general training'} writing
            tests at the moment. Please check back later.
          </p>
        </div>
      )}

      {/* Tests Grid */}
      {!loading && !error && tests.length > 0 && (
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {tests.length} {tests.length === 1 ? 'Test' : 'Tests'} Available
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tests.map(test => {
              const hasSubmission =
                test.submission !== null && test.submission !== undefined;
              const isFullyCompleted =
                hasSubmission &&
                test.submission?.task1_completed &&
                test.submission?.task2_completed;
              const locked = isTestLocked(test);
              const paid = isPaidTest(test);

              return (
                <div
                  key={test.id}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border ${
                    locked
                      ? 'border-gray-300 bg-gray-100 opacity-60 dark:border-gray-700 dark:bg-gray-800/60'
                      : hasSubmission
                        ? 'border-green-200 bg-green-50/50 dark:border-green-900/30 dark:bg-green-900/10'
                        : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/60'
                  } shadow-sm transition-all duration-300 ${locked ? 'cursor-not-allowed' : 'hover:shadow-xl'}`}
                  onClick={() => locked && openPremiumModal()}
                >
                  {/* Premium Badge */}
                  {paid && (
                    <div
                      className={`absolute top-4 ${hasSubmission ? 'right-28' : 'right-4'} z-10`}
                    >
                      <div className="flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 shadow-lg">
                        <Crown className="h-3 w-3 text-white" />
                        <span className="text-xs font-bold text-white">
                          Premium
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Free Badge */}
                  {!paid && !hasSubmission && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="flex items-center gap-1 rounded-full bg-green-500 px-2.5 py-1 shadow-lg">
                        <span className="text-xs font-bold text-white">
                          Free
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Completed/Partial Badge */}
                  {hasSubmission && (
                    <div className="absolute top-4 right-4 z-10">
                      <div
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-lg ${isFullyCompleted ? 'bg-green-600' : 'bg-orange-500'}`}
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-white" />
                        <span className="text-xs font-bold text-white">
                          {isFullyCompleted ? 'Completed' : 'Partial'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Card Header with Gradient Accent */}
                  <div
                    className={`relative ${hasSubmission ? 'bg-gradient-to-br from-green-100/50 via-green-50/30 to-transparent dark:from-green-900/20 dark:via-green-900/10' : 'bg-gradient-to-br from-primary/5 via-primary/3 to-transparent'} p-6 pb-4`}
                  >
                    <div
                      className={`mb-4 inline-flex rounded-xl ${hasSubmission ? 'bg-green-100 dark:bg-green-900/30' : 'bg-white dark:bg-gray-900'} p-3 shadow-sm`}
                    >
                      <FileText
                        className={`h-6 w-6 ${hasSubmission ? 'text-green-600 dark:text-green-400' : 'text-primary'}`}
                      />
                    </div>

                    <h3 className="mb-2 font-bold text-gray-900 text-lg leading-tight dark:text-white">
                      {test.name}
                    </h3>

                    <p className="line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {test.description}
                    </p>

                    {/* Decorative Element */}
                    <div
                      className={`absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full ${hasSubmission ? 'bg-green-500/10' : 'bg-primary/5'} blur-2xl`}
                    />
                  </div>

                  {/* Test Info Section */}
                  <div
                    className={`flex-1 border-t ${hasSubmission ? 'border-green-100 bg-green-50/30 dark:border-green-900/20 dark:bg-green-900/5' : 'border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/40'} px-6 py-4`}
                  >
                    {hasSubmission && test.submission ? (
                      <div className="space-y-3">
                        {test.submission.task1_completed &&
                          test.submission.task2_completed && (
                            <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm dark:bg-gray-900/50">
                              <div className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Overall Band
                                </span>
                              </div>
                              <span className="font-bold text-green-600 text-xl dark:text-green-400">
                                {test.submission.overall_band_score.toFixed(1)}
                              </span>
                            </div>
                          )}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Task 1
                            </span>
                            {test.submission.task1_completed ? (
                              <span className="font-bold text-gray-900 dark:text-white">
                                {test.submission.task1_score.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-xs font-medium text-orange-500 dark:text-orange-400">
                                Not Attempted
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Task 2
                            </span>
                            {test.submission.task2_completed ? (
                              <span className="font-bold text-gray-900 dark:text-white">
                                {test.submission.task2_score.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-xs font-medium text-orange-500 dark:text-orange-400">
                                Not Attempted
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="pt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                          Submitted:{' '}
                          {new Date(
                            test.submission.submitted_at
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            60 minutes
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            2 Writing Tasks
                          </span>
                        </div>
                        <div className="pt-2">
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            <span className="text-xs font-semibold text-primary">
                              AI + Expert Review
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div
                    className={`border-t ${hasSubmission ? 'border-green-100 dark:border-green-900/20' : 'border-gray-100 dark:border-gray-800'} p-4`}
                  >
                    {locked ? (
                      <Button
                        onClick={e => {
                          e.stopPropagation();
                          openPremiumModal();
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full border-amber-500 text-amber-600 hover:bg-amber-50 dark:border-amber-400 dark:text-amber-400"
                        startIcon={<Lock className="h-4 w-4" />}
                      >
                        Unlock with Premium
                      </Button>
                    ) : hasSubmission && test.submission ? (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleViewResults(test.submission!.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1 border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20"
                          endIcon={<Eye className="h-4 w-4" />}
                        >
                          View Results
                        </Button>
                        {(!test.submission.task1_completed ||
                          !test.submission.task2_completed) && (
                          <Button
                            onClick={() => handleStartTest(test.id)}
                            variant="primary"
                            size="sm"
                            className="flex-1"
                          >
                            Attempt{' '}
                            {!test.submission.task1_completed
                              ? 'Task 1'
                              : 'Task 2'}
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleStartTest(test.id)}
                        variant="primary"
                        size="sm"
                        className="w-full group-hover:shadow-md"
                        endIcon={
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        }
                      >
                        Start Test
                      </Button>
                    )}
                  </div>

                  {/* Subtle Hover Border */}
                  <div
                    className={`pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ${
                      locked
                        ? 'ring-amber-500/0'
                        : hasSubmission
                          ? 'ring-green-500/0 group-hover:ring-green-500/30'
                          : 'ring-primary/0 group-hover:ring-primary/30'
                    } transition-all duration-300`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info Banner */}
      {!loading && !error && tests.length > 0 && (
        <div className="mx-auto mt-12 max-w-[800px] overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-50/50 shadow-sm dark:border-blue-900/30 dark:from-blue-900/10 dark:to-blue-900/5">
          <div className="flex gap-4 p-6">
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 shadow-sm dark:bg-blue-900/30">
                <svg
                  className="h-5 w-5 text-blue-600 dark:text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="mb-2 font-bold text-blue-900 dark:text-blue-300">
                Test Guidelines
              </h4>
              <ul className="space-y-1.5 text-sm leading-relaxed text-blue-800/90 dark:text-blue-400/90">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" />
                  <span>
                    Each test can only be taken once - choose carefully
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" />
                  <span>Ensure stable internet connection before starting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" />
                  <span>Complete both Task 1 and Task 2 within time limit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" />
                  <span>Your progress will be automatically saved</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Premium Modal */}
      <PremiumModal isOpen={isPremiumModalOpen} onClose={closePremiumModal} />
    </div>
  );
}
