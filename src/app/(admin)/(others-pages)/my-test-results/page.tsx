'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { writingTestService } from '../../../../../lib/services/writingTestService';
import {
  FileText,
  Clock,
  Award,
  ChevronRight,
  Calendar,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

interface Submission {
  id: string;
  test_id: string;
  task1_word_count: number | null;
  task2_word_count: number | null;
  time_taken: number;
  overall_band_score: number;
  status: string;
  created_at: string;
}

export default function MyTestResults() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        const data = await writingTestService.getUserSubmissions();
        setSubmissions(data);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError('Failed to load your test results. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const getBandColor = (band: number): string => {
    if (band >= 7) return 'text-green-600';
    if (band >= 6) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getBandBgColor = (band: number): string => {
    if (band >= 7) return 'bg-green-100';
    if (band >= 6) return 'bg-yellow-100';
    return 'bg-orange-100';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      evaluated: { label: 'AI Evaluated', color: 'bg-blue-100 text-blue-700' },
      expert_reviewed: {
        label: 'Expert Reviewed',
        color: 'bg-purple-100 text-purple-700',
      },
      pending: { label: 'Pending', color: 'bg-gray-100 text-gray-700' },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const viewDetails = (submissionId: string) => {
    router.push(`/writing-test-results/${submissionId}`);
  };

  if (isLoading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="My Test Results" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#06BBCC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">
              Loading your test results...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageBreadcrumb pageTitle="My Test Results" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#06BBCC] hover:bg-[#059aa8] text-white px-6 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalTests = submissions.length;
  const averageBand =
    totalTests > 0
      ? (
          submissions.reduce((sum, s) => sum + s.overall_band_score, 0) /
          totalTests
        ).toFixed(1)
      : '0.0';
  const highestBand =
    totalTests > 0
      ? Math.max(...submissions.map(s => s.overall_band_score))
      : 0;

  return (
    <div>
      <PageBreadcrumb pageTitle="My Test Results" />

      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Tests */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Tests</p>
                <p className="text-3xl font-bold text-gray-800">{totalTests}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          {/* Average Band */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Band Score</p>
                <p
                  className={`text-3xl font-bold ${getBandColor(parseFloat(averageBand))}`}
                >
                  {averageBand}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          {/* Highest Band */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Highest Band Score</p>
                <p
                  className={`text-3xl font-bold ${getBandColor(highestBand)}`}
                >
                  {highestBand.toFixed(1)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Test Results List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-[#06BBCC]/10 to-transparent border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              Test Results History
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Click on any test to view detailed results and feedback
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {submissions.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No test results yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start taking writing tests to see your results here
                </p>
                <button
                  onClick={() => router.push('/take-writing-tests/academic')}
                  className="bg-[#06BBCC] hover:bg-[#059aa8] text-white px-6 py-2 rounded-lg font-medium"
                >
                  Take a Test
                </button>
              </div>
            ) : (
              submissions.map(submission => (
                <div
                  key={submission.id}
                  onClick={() => viewDetails(submission.id)}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#06BBCC] transition-colors">
                          Writing Test #{submission.id}
                        </h3>
                        {getStatusBadge(submission.status)}
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{formatDate(submission.created_at)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>Time: {formatTime(submission.time_taken)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <FileText size={16} />
                          <span>
                            {submission.task1_word_count &&
                            submission.task2_word_count
                              ? 'Both Tasks'
                              : submission.task1_word_count
                                ? 'Task 1 Only'
                                : 'Task 2 Only'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Band Score */}
                      <div className="text-right">
                        <p className="text-xs text-gray-600 mb-1">Band Score</p>
                        <div
                          className={`px-4 py-2 rounded-lg font-bold text-xl ${getBandBgColor(submission.overall_band_score)} ${getBandColor(submission.overall_band_score)}`}
                        >
                          {submission.overall_band_score.toFixed(1)}
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <ChevronRight
                        className="text-gray-400 group-hover:text-[#06BBCC] transition-colors"
                        size={24}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
