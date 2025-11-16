'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  expertReviewService,
  type ExpertReviewRequest,
} from '../../../../../lib/services/expertReviewService';
import {
  FileText,
  Clock,
  Award,
  ChevronRight,
  Calendar,
  AlertCircle,
  CheckCircle,
  Loader,
} from 'lucide-react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

export default function MyExpertReviews() {
  const router = useRouter();
  const [requests, setRequests] = useState<ExpertReviewRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const data = await expertReviewService.getMyRequests();
        setRequests(data);
      } catch (err) {
        console.error('Error fetching expert review requests:', err);
        setError(
          'Failed to load your expert review requests. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        label: 'Pending Review',
        color: 'bg-yellow-100 text-yellow-700',
        icon: Clock,
      },
      in_progress: {
        label: 'In Progress',
        color: 'bg-blue-100 text-blue-700',
        icon: Loader,
      },
      completed: {
        label: 'Completed',
        color: 'bg-green-100 text-green-700',
        icon: CheckCircle,
      },
      rejected: {
        label: 'Rejected',
        color: 'bg-red-100 text-red-700',
        icon: AlertCircle,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.color} flex items-center gap-1`}
      >
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  const getBandColor = (band: number): string => {
    if (band >= 7) return 'text-green-600';
    if (band >= 6) return 'text-yellow-600';
    return 'text-orange-600';
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

  const viewDetails = (submissionId: string) => {
    router.push(`/writing-test-results/${submissionId}`);
  };

  // Filter requests based on selected status
  const filteredRequests =
    filterStatus === 'all'
      ? requests
      : requests.filter(req => req.status === filterStatus);

  // Calculate statistics
  const totalRequests = requests.length;
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const completedCount = requests.filter(r => r.status === 'completed').length;
  const inProgressCount = requests.filter(
    r => r.status === 'in_progress'
  ).length;

  if (isLoading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="My Expert Reviews" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#06BBCC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">
              Loading your expert review requests...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageBreadcrumb pageTitle="My Expert Reviews" />
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

  return (
    <div>
      <PageBreadcrumb pageTitle="My Expert Reviews" />

      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Requests */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Requests</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalRequests}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600" size={20} />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pendingCount}
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="text-yellow-600" size={20} />
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  {inProgressCount}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Loader className="text-blue-600" size={20} />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {completedCount}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filterStatus === 'all'
                  ? 'bg-[#06BBCC] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({totalRequests})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filterStatus === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilterStatus('in_progress')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filterStatus === 'in_progress'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filterStatus === 'completed'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-[#06BBCC]/10 to-transparent border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              Expert Review Requests
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Click on any request to view the test results and feedback
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredRequests.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {filterStatus === 'all'
                    ? 'No expert review requests yet'
                    : `No ${filterStatus.replace('_', ' ')} requests`}
                </h3>
                <p className="text-gray-600 mb-4">
                  {filterStatus === 'all'
                    ? 'Take a writing test and request expert review from the results page'
                    : `You don't have any ${filterStatus.replace('_', ' ')} expert review requests`}
                </p>
                {filterStatus === 'all' && (
                  <button
                    onClick={() => router.push('/take-writing-tests/academic')}
                    className="bg-[#06BBCC] hover:bg-[#059aa8] text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Take a Test
                  </button>
                )}
              </div>
            ) : (
              filteredRequests.map(request => (
                <div
                  key={request.id}
                  onClick={() => viewDetails(request.submission_id)}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#06BBCC] transition-colors">
                          Test Submission #{request.submission_id}
                        </h3>
                        {getStatusBadge(request.status)}
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>
                            Requested: {formatDate(request.requested_at)}
                          </span>
                        </div>

                        {request.reviewed_at && (
                          <div className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-600" />
                            <span>
                              Reviewed: {formatDate(request.reviewed_at)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Show submission details if available */}
                      {request.submission && (
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Award size={16} className="text-gray-500" />
                            <span className="text-gray-600">AI Score:</span>
                            <span
                              className={`font-bold ${getBandColor(request.submission.overall_band_score)}`}
                            >
                              {request.submission.overall_band_score.toFixed(1)}
                            </span>
                          </div>

                          {request.submission.expert_score && (
                            <div className="flex items-center gap-2">
                              <Award size={16} className="text-purple-600" />
                              <span className="text-gray-600">
                                Expert Score:
                              </span>
                              <span
                                className={`font-bold ${getBandColor(request.submission.expert_score)}`}
                              >
                                {request.submission.expert_score.toFixed(1)}
                              </span>
                            </div>
                          )}

                          {request.submission.expert_feedback_sent && (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle size={16} />
                              <span className="text-sm font-medium">
                                Feedback Sent
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Admin Notes */}
                      {request.admin_notes && (
                        <div className="mt-2 bg-purple-50 p-2 rounded text-sm text-gray-700">
                          <span className="font-semibold">Admin Note: </span>
                          {request.admin_notes}
                        </div>
                      )}
                    </div>

                    {/* Arrow Icon */}
                    <ChevronRight
                      className="text-gray-400 group-hover:text-[#06BBCC] transition-colors"
                      size={24}
                    />
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
