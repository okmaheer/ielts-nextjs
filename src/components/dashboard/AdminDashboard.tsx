'use client';

import { useEffect, useState } from 'react';
import dashboardService, {
  type AdminDashboardData,
} from '../../../lib/services/dashboardService';
import {
  Users,
  FileText,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Clock,
  Award,
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const dashboardData = await dashboardService.getAdminDashboard();
      setData(dashboardData);
    } catch (err) {
      console.error('Error fetching admin dashboard:', err);
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
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error || 'No data available'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Comprehensive platform analytics and insights
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={data.overview.totalUsers}
          icon={<Users size={24} />}
          color="blue"
          subtitle={`${data.overview.activeUsersCount} active (30d)`}
        />
        <MetricCard
          title="Total Tests"
          value={data.overview.totalTests}
          icon={<FileText size={24} />}
          color="green"
          subtitle="Available tests"
        />
        <MetricCard
          title="Submissions"
          value={data.overview.totalSubmissions}
          icon={<CheckCircle size={24} />}
          color="purple"
          subtitle={`${data.overview.recentSubmissions} this month`}
        />
        <MetricCard
          title="Expert Reviews"
          value={data.expertReviews.total}
          icon={<Award size={24} />}
          color="orange"
          subtitle={`${data.expertReviews.byStatus.pending || 0} pending`}
        />
      </div>

      {/* AI Costs & Scores Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Costs Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              AI API Costs (Real-Time)
            </h3>
            <DollarSign
              size={24}
              className="text-green-600 dark:text-green-400"
            />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total API Cost
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                ${data.aiCosts.totalCost.toFixed(4)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Avg Per Evaluation
                </p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  ${data.aiCosts.avgCostPerSubmission.toFixed(6)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total Tokens
                </p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {data.aiCosts.totalTokensUsed.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total Evaluations
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  {data.aiCosts.totalEvaluations}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  With Cost Data
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  {data.aiCosts.submissionsWithCostData}
                </p>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mt-4">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                GPT-4o-mini: $0.15/1M input tokens, $0.60/1M output tokens
              </p>
            </div>
          </div>
        </div>

        {/* Average Scores Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Average Scores
            </h3>
            <TrendingUp
              size={24}
              className="text-purple-600 dark:text-purple-400"
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI Score Average
                </p>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {data.scores.avgAiScore}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${(data.scores.avgAiScore / 9) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Expert Score Average
                </p>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {data.scores.avgExpertScore > 0
                    ? data.scores.avgExpertScore
                    : 'N/A'}
                </span>
              </div>
              {data.scores.avgExpertScore > 0 && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-purple-600 h-3 rounded-full transition-all"
                    style={{
                      width: `${(data.scores.avgExpertScore / 9) * 100}%`,
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expert Review Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          Expert Review Requests Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      {/* Submissions Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            Submissions (Last 7 Days)
          </h3>
          <Clock size={24} className="text-gray-400" />
        </div>
        <div className="space-y-3">
          {Object.keys(data.submissionsChart.last7Days).length > 0 ? (
            Object.entries(data.submissionsChart.last7Days).map(
              ([date, count]) => (
                <div key={date} className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[100px]">
                    {new Date(date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-8 relative">
                    <div
                      className="bg-gradient-to-r from-[#06BBCC] to-[#059aa8] h-8 rounded-full flex items-center justify-end pr-3"
                      style={{
                        width: `${Math.min((count / Math.max(...Object.values(data.submissionsChart.last7Days))) * 100, 100)}%`,
                      }}
                    >
                      <span className="text-white text-sm font-semibold">
                        {count}
                      </span>
                    </div>
                  </div>
                </div>
              )
            )
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No submissions in the last 7 days
            </p>
          )}
        </div>
      </div>

      {/* Bottom Row: Recent Users & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Recent Users
          </h3>
          <div className="space-y-3">
            {data.recentUsers.map(user => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Top Performers (3+ tests)
          </h3>
          <div className="space-y-3">
            {data.topPerformers.length > 0 ? (
              data.topPerformers.map((performer, index) => (
                <div
                  key={performer.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0
                          ? 'bg-yellow-500'
                          : index === 1
                            ? 'bg-gray-400'
                            : index === 2
                              ? 'bg-orange-600'
                              : 'bg-gray-300'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {performer.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {performer.testCount} tests
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {performer.avgScore}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No qualified performers yet
              </p>
            )}
          </div>
        </div>
      </div>
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
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
  subtitle?: string;
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
        {value.toLocaleString()}
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
