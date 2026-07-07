'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dashboardService, {
  type UserDashboardData,
} from '../../../lib/services/dashboardService';
import {
  FileText,
  TrendingUp,
  Award,
  Target,
  Clock,
  BookOpen,
  Crown,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/hooks/useModal';
import PremiumModal from '@/components/premium/PremiumModal';

export default function UserDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    isOpen: isPremiumOpen,
    openModal: openPremium,
    closeModal: closePremium,
  } = useModal();
  const [data, setData] = useState<UserDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const dashboardData = await dashboardService.getUserDashboard();
      setData(dashboardData);
    } catch (err) {
      console.error('Error fetching user dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#06BBCC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">
            {error || 'No data available'}
          </p>
          <button
            onClick={() => router.push('/take-writing-tests/academic')}
            className="bg-[#06BBCC] hover:bg-[#059aa8] text-white px-6 py-2 rounded-lg"
          >
            Take Your First Test
          </button>
        </div>
      </div>
    );
  }

  const getBandColor = (score: number): string => {
    if (score >= 7) return 'text-green-600 dark:text-green-400';
    if (score >= 6) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 4) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getBandBgColor = (score: number): string => {
    if (score >= 7) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    if (score >= 4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          My Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your progress and performance
        </p>
      </div>

      {/* Premium Upgrade Banner */}
      {user && !user.isUserPaid && (
        <button
          onClick={openPremium}
          className="w-full rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-4 shadow-md transition-all hover:shadow-lg hover:brightness-105"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-white">Upgrade to Premium</p>
                <p className="text-sm text-white/80">
                  Unlock all tests and get full access
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-white" />
          </div>
        </button>
      )}

      {/* Premium Login Setup Banner — premium tests require an email+password
          login, distinct from this Google/Facebook session */}
      {user && user.loginMethod !== 'email' && (
        <button
          onClick={() => router.push('/premium-login')}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-4 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="font-bold text-gray-800 dark:text-white">
                Taking premium tests?
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Premium tests need a separate email &amp; password login. Set
                one up here.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
        </button>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Tests Taken"
          value={data.overview.totalTestsTaken}
          icon={<FileText size={24} />}
          color="blue"
        />
        <MetricCard
          title="Average Score"
          value={data.overview.avgScore}
          icon={<TrendingUp size={24} />}
          color="green"
          isBandScore
        />
        <MetricCard
          title="Highest Score"
          value={data.overview.highestScore}
          icon={<Target size={24} />}
          color="purple"
          isBandScore
        />
        <MetricCard
          title="Expert Reviews"
          value={data.overview.expertReviewRequests}
          icon={<Award size={24} />}
          color="orange"
          subtitle={`${data.expertReviews.byStatus.pending || 0} pending`}
        />
      </div>

      {/* Score Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">
          Score Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Average Score
            </p>
            <p
              className={`text-4xl font-bold mb-3 ${getBandColor(data.overview.avgScore)}`}
            >
              {data.overview.avgScore}
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={`${getBandBgColor(data.overview.avgScore)} h-3 rounded-full transition-all`}
                style={{
                  width: `${(data.overview.avgScore / 9) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Highest Score
            </p>
            <p
              className={`text-4xl font-bold mb-3 ${getBandColor(data.overview.highestScore)}`}
            >
              {data.overview.highestScore}
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={`${getBandBgColor(data.overview.highestScore)} h-3 rounded-full transition-all`}
                style={{
                  width: `${(data.overview.highestScore / 9) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Lowest Score
            </p>
            <p
              className={`text-4xl font-bold mb-3 ${getBandColor(data.overview.lowestScore)}`}
            >
              {data.overview.lowestScore}
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={`${getBandBgColor(data.overview.lowestScore)} h-3 rounded-full transition-all`}
                style={{
                  width: `${(data.overview.lowestScore / 9) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Task Performance
            </h3>
            <BookOpen
              size={24}
              className="text-purple-600 dark:text-purple-400"
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Task 1 Average ({data.taskPerformance.task1Count} tests)
                </span>
                <span
                  className={`text-2xl font-bold ${getBandColor(data.taskPerformance.task1Avg)}`}
                >
                  {data.taskPerformance.task1Avg}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`${getBandBgColor(data.taskPerformance.task1Avg)} h-3 rounded-full transition-all`}
                  style={{
                    width: `${(data.taskPerformance.task1Avg / 9) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Task 2 Average ({data.taskPerformance.task2Count} tests)
                </span>
                <span
                  className={`text-2xl font-bold ${getBandColor(data.taskPerformance.task2Avg)}`}
                >
                  {data.taskPerformance.task2Avg}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`${getBandBgColor(data.taskPerformance.task2Avg)} h-3 rounded-full transition-all`}
                  style={{
                    width: `${(data.taskPerformance.task2Avg / 9) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Expert Review Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Expert Review Requests
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <StatusCard
              label="Pending"
              count={data.expertReviews.byStatus.pending || 0}
              color="yellow"
            />
            <StatusCard
              label="In Progress"
              count={data.expertReviews.byStatus.in_progress || 0}
              color="blue"
            />
            <StatusCard
              label="Completed"
              count={data.expertReviews.byStatus.completed || 0}
              color="green"
            />
            <StatusCard
              label="Rejected"
              count={data.expertReviews.byStatus.rejected || 0}
              color="red"
            />
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      {data.progress.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Your Progress (Last 10 Tests)
            </h3>
            <TrendingUp
              size={24}
              className="text-green-600 dark:text-green-400"
            />
          </div>
          <div className="flex items-end justify-between gap-2 h-64">
            {data.progress.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-[#06BBCC] to-[#059aa8] rounded-t-lg relative group"
                  style={{
                    height: `${(item.score / 9) * 100}%`,
                    minHeight: '20px',
                  }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 dark:bg-gray-600 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                    Band {item.score}
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {index + 1}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Test Number
            </p>
          </div>
        </div>
      )}

      {/* Recent Tests */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            Recent Tests
          </h3>
          <Clock size={24} className="text-gray-400" />
        </div>
        <div className="space-y-3">
          {data.recentTests.length > 0 ? (
            data.recentTests.map(test => (
              <div
                key={test.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg gap-3"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-white">
                    {test.testName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(test.date).toLocaleDateString()} • {test.category}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Task 1
                    </p>
                    <p
                      className={`text-lg font-bold ${getBandColor(test.task1Score)}`}
                    >
                      {test.task1Score || 'N/A'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Task 2
                    </p>
                    <p
                      className={`text-lg font-bold ${getBandColor(test.task2Score)}`}
                    >
                      {test.task2Score || 'N/A'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Overall
                    </p>
                    <p
                      className={`text-lg font-bold ${getBandColor(test.score)}`}
                    >
                      {test.score}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      router.push(`/writing-test-results/${test.id}`)
                    }
                    className="text-sm bg-[#06BBCC] hover:bg-[#059aa8] text-white px-4 py-2 rounded-lg"
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No tests taken yet
              </p>
              <button
                onClick={() => router.push('/take-writing-tests/academic')}
                className="bg-[#06BBCC] hover:bg-[#059aa8] text-white px-6 py-2 rounded-lg"
              >
                Take Your First Test
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Premium Modal */}
      <PremiumModal isOpen={isPremiumOpen} onClose={closePremium} />
    </div>
  );
}

// Metric Card Component
function MetricCard({
  title,
  value,
  icon,
  color,
  subtitle,
  isBandScore,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
  subtitle?: string;
  isBandScore?: boolean;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green:
      'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple:
      'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    orange:
      'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      </div>
      <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
        {isBandScore ? value.toFixed(1) : value}
      </p>
      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
      )}
    </div>
  );
}

// Status Card Component
function StatusCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: 'yellow' | 'blue' | 'green' | 'red';
}) {
  const colorClasses = {
    yellow:
      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    green:
      'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-4 text-center`}>
      <p className="text-2xl font-bold mb-1">{count}</p>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
