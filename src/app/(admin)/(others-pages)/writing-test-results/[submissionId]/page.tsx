'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  writingTestService,
  type SubmissionDetails,
  type TaskEvaluation,
} from '../../../../../../lib/services/writingTestService';
import { expertReviewService } from '../../../../../../lib/services/expertReviewService';
import {
  ChevronDown,
  ChevronUp,
  Award,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
} from 'lucide-react';

export default function WritingTestResults() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.submissionId as string;

  const [submission, setSubmission] = useState<SubmissionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTask, setExpandedTask] = useState<'task1' | 'task2' | null>(
    null
  );
  const [expandedCriteria, setExpandedCriteria] = useState<{
    [key: string]: boolean;
  }>({});

  // Expert review states
  const [reviewStatus, setReviewStatus] = useState<{
    has_request: boolean;
    request_id?: string;
    status?: string;
    requested_at?: string;
    reviewed_at?: string | null;
  } | null>(null);
  const [isRequestingReview, setIsRequestingReview] = useState(false);
  const [requestMessage, setRequestMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setIsLoading(true);
        const data =
          await writingTestService.getSubmissionDetails(submissionId);
        setSubmission(data);
      } catch (err) {
        console.error('Error fetching submission:', err);
        setError('Failed to load results. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (submissionId) {
      fetchSubmission();
    }
  }, [submissionId]);

  // Check expert review status
  useEffect(() => {
    const checkReviewStatus = async () => {
      if (!submissionId) return;

      try {
        const status =
          await expertReviewService.checkReviewStatus(submissionId);
        setReviewStatus(status);
      } catch (err) {
        console.error('Error checking review status:', err);
      }
    };

    if (submissionId) {
      checkReviewStatus();
    }
  }, [submissionId]);

  const handleRequestReview = async () => {
    if (!submissionId) return;

    setIsRequestingReview(true);
    setRequestMessage(null);

    try {
      await expertReviewService.requestReview(submissionId);

      // Refresh review status
      const status = await expertReviewService.checkReviewStatus(submissionId);
      setReviewStatus(status);

      setRequestMessage({
        type: 'success',
        text: 'Expert review requested successfully! You will be notified via email when the review is completed.',
      });
    } catch (err) {
      console.error('Error requesting review:', err);
      const error = err as { response?: { data?: { message?: string } } };
      setRequestMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          'Failed to request expert review. Please try again.',
      });
    } finally {
      setIsRequestingReview(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        label: 'Pending Review',
        color: 'bg-yellow-100 text-yellow-700',
      },
      in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
      completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
      rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
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

  const toggleTask = (task: 'task1' | 'task2') => {
    setExpandedTask(expandedTask === task ? null : task);
  };

  const toggleCriteria = (key: string) => {
    setExpandedCriteria(prev => ({ ...prev, [key]: !prev[key] }));
  };

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

  const renderCriteriaScore = (
    label: string,
    score: number,
    key: string,
    details?: string
  ) => (
    <div key={key} className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => toggleCriteria(key)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-medium text-gray-700">{label}</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-bold ${getBandBgColor(score)} ${getBandColor(score)}`}
          >
            {score}
          </span>
        </div>
        {expandedCriteria[key] ? (
          <ChevronUp size={20} />
        ) : (
          <ChevronDown size={20} />
        )}
      </button>
      {expandedCriteria[key] && details && (
        <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600">
          {details}
        </div>
      )}
    </div>
  );

  const renderExpertTaskEvaluation = (
    taskNum: 1 | 2,
    taskData: {
      task_achievement?: number;
      task_response?: number;
      coherence_cohesion?: number;
      lexical_resource?: number;
      grammatical_accuracy?: number;
      overall_band?: number;
      feedback?: string;
      improvements?: string[];
    } | null,
    answer: string | null,
    wordCount: number | null
  ) => {
    const taskKey = `task${taskNum}` as 'task1' | 'task2';
    const isExpanded = expandedTask === taskKey;

    if (!taskData) return null;

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 border-2 border-purple-200">
        <button
          onClick={() => toggleTask(taskKey)}
          className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-purple-100 to-transparent hover:from-purple-200 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Award className="text-purple-600" size={24} />
            <h3 className="text-xl font-bold text-gray-800">
              Task {taskNum} Expert Evaluation
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`px-4 py-2 rounded-lg text-lg font-bold bg-purple-100 ${getBandColor(taskData.overall_band || 0)}`}
            >
              Band {taskData.overall_band || 0}
            </span>
            {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>
        </button>

        {isExpanded && (
          <div className="p-6 bg-purple-50/30">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Student's Answer */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FileText size={18} />
                  Your Answer ({wordCount} words)
                </h4>
                <div className="bg-white p-4 rounded-lg max-h-96 overflow-y-auto border border-purple-200">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {answer || 'No answer provided'}
                  </p>
                </div>
              </div>

              {/* Right: Expert Evaluation */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Award size={18} className="text-purple-600" />
                  Expert Evaluation
                </h4>

                {/* Criteria Breakdown */}
                <div className="bg-white border border-purple-200 rounded-lg mb-4">
                  {taskNum === 1 &&
                    taskData.task_achievement &&
                    renderCriteriaScore(
                      'Task Achievement',
                      taskData.task_achievement,
                      `${taskKey}-achievement-expert`
                    )}
                  {taskNum === 2 &&
                    taskData.task_response &&
                    renderCriteriaScore(
                      'Task Response',
                      taskData.task_response,
                      `${taskKey}-response-expert`
                    )}
                  {renderCriteriaScore(
                    'Coherence & Cohesion',
                    taskData.coherence_cohesion || 0,
                    `${taskKey}-coherence-expert`
                  )}
                  {renderCriteriaScore(
                    'Lexical Resource',
                    taskData.lexical_resource || 0,
                    `${taskKey}-lexical-expert`
                  )}
                  {renderCriteriaScore(
                    'Grammatical Range & Accuracy',
                    taskData.grammatical_accuracy || 0,
                    `${taskKey}-grammar-expert`
                  )}
                </div>

                {/* Feedback */}
                <div className="bg-purple-50 p-4 rounded-lg mb-4 border border-purple-200">
                  <h5 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Award size={16} className="text-purple-600" />
                    Expert Detailed Feedback
                  </h5>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {taskData.feedback}
                  </p>
                </div>

                {/* Improvements */}
                {taskData.improvements && taskData.improvements.length > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h5 className="font-semibold text-gray-700 mb-2">
                      Key Improvements from Expert
                    </h5>
                    <ul className="space-y-2">
                      {taskData.improvements.map(
                        (improvement: string, idx: number) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-gray-700"
                          >
                            <CheckCircle
                              size={16}
                              className="text-green-600 mt-0.5 flex-shrink-0"
                            />
                            <span>{improvement}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTaskEvaluation = (
    taskNum: 1 | 2,
    taskData: TaskEvaluation,
    answer: string | null,
    wordCount: number | null
  ) => {
    const taskKey = `task${taskNum}` as 'task1' | 'task2';
    const isExpanded = expandedTask === taskKey;

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <button
          onClick={() => toggleTask(taskKey)}
          className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-[#06BBCC]/10 to-transparent hover:from-[#06BBCC]/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FileText className="text-[#06BBCC]" size={24} />
            <h3 className="text-xl font-bold text-gray-800">
              Task {taskNum} Evaluation
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`px-4 py-2 rounded-lg text-lg font-bold ${getBandBgColor(taskData.overall_band)} ${getBandColor(taskData.overall_band)}`}
            >
              Band {taskData.overall_band}
            </span>
            {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>
        </button>

        {isExpanded && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Student's Answer */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FileText size={18} />
                  Your Answer ({wordCount} words)
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {answer || 'No answer provided'}
                  </p>
                </div>
              </div>

              {/* Right: AI Evaluation */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Award size={18} />
                  AI Evaluation
                </h4>

                {/* Criteria Breakdown */}
                <div className="bg-white border border-gray-200 rounded-lg mb-4">
                  {taskNum === 1 &&
                    taskData.task_achievement &&
                    renderCriteriaScore(
                      'Task Achievement',
                      taskData.task_achievement,
                      `${taskKey}-achievement`
                    )}
                  {taskNum === 2 &&
                    taskData.task_response &&
                    renderCriteriaScore(
                      'Task Response',
                      taskData.task_response,
                      `${taskKey}-response`
                    )}
                  {renderCriteriaScore(
                    'Coherence & Cohesion',
                    taskData.coherence_cohesion,
                    `${taskKey}-coherence`
                  )}
                  {renderCriteriaScore(
                    'Lexical Resource',
                    taskData.lexical_resource,
                    `${taskKey}-lexical`
                  )}
                  {renderCriteriaScore(
                    'Grammatical Range & Accuracy',
                    taskData.grammatical_accuracy,
                    `${taskKey}-grammar`
                  )}
                </div>

                {/* Feedback */}
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h5 className="font-semibold text-gray-700 mb-2">
                    Detailed Feedback
                  </h5>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {taskData.feedback}
                  </p>
                </div>

                {/* Improvements */}
                {taskData.improvements && taskData.improvements.length > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-700 mb-2">
                      Key Improvements
                    </h5>
                    <ul className="space-y-2">
                      {taskData.improvements.map((improvement, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <CheckCircle
                            size={16}
                            className="text-green-600 mt-0.5 flex-shrink-0"
                          />
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#06BBCC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-lg mb-4">
            {error || 'Results not found'}
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-[#06BBCC] hover:bg-[#059aa8] text-white px-6 py-2 rounded-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const {
    ai_evaluation,
    overall_band_score,
    expert_feedback,
    expert_feedback_sent,
    time_taken,
  } = submission;

  // Parse expert feedback if it exists
  let expertEvaluation = null;
  if (expert_feedback) {
    try {
      expertEvaluation =
        typeof expert_feedback === 'string'
          ? JSON.parse(expert_feedback)
          : expert_feedback;
    } catch (e) {
      console.error('Error parsing expert feedback:', e);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Writing Test Results
          </h1>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>
                Time taken: {Math.floor(time_taken / 60)} min {time_taken % 60}{' '}
                sec
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600" />
              <span>Evaluated by AI</span>
            </div>
            {expert_feedback_sent && (
              <div className="flex items-center gap-2">
                <Award size={16} className="text-purple-600" />
                <span className="text-purple-600 font-medium">
                  Expert Reviewed
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Overall Band Score - Show both AI and Expert if available */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* AI Score */}
          <div className="bg-gradient-to-r from-[#06BBCC] to-[#059aa8] rounded-lg shadow-lg p-8 text-center text-white">
            <h2 className="text-xl font-semibold mb-2">
              AI Overall Band Score
            </h2>
            <div className="text-5xl font-bold mb-2">{overall_band_score}</div>
            <p className="text-sm opacity-90">
              {ai_evaluation?.task1 && ai_evaluation?.task2
                ? `Formula: (Task 1: ${ai_evaluation.task1.overall_band} + 2 × Task 2: ${ai_evaluation.task2.overall_band}) ÷ 3`
                : 'Based on completed task(s)'}
            </p>
          </div>

          {/* Expert Score */}
          {submission.expert_score && expert_feedback_sent ? (
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg shadow-lg p-8 text-center text-white">
              <h2 className="text-xl font-semibold mb-2">
                Expert Overall Band Score
              </h2>
              <div className="text-5xl font-bold mb-2">
                {submission.expert_score.toFixed(1)}
              </div>
              <p className="text-sm opacity-90">
                {expertEvaluation?.task1 && expertEvaluation?.task2
                  ? `Formula: (Task 1: ${expertEvaluation.task1.overall_band} + 2 × Task 2: ${expertEvaluation.task2.overall_band}) ÷ 3`
                  : 'Professional expert evaluation'}
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg shadow-lg p-8 text-center text-white">
              <h2 className="text-xl font-semibold mb-2">
                Expert Overall Band Score
              </h2>
              <div className="text-5xl font-bold mb-2">—</div>
              <p className="text-sm opacity-90">Awaiting expert review</p>
            </div>
          )}
        </div>

        {/* AI Evaluation Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            AI Evaluation
          </h2>

          {ai_evaluation?.task1 &&
            renderTaskEvaluation(
              1,
              ai_evaluation.task1,
              submission.task1_answer,
              submission.task1_word_count
            )}

          {ai_evaluation?.task2 &&
            renderTaskEvaluation(
              2,
              ai_evaluation.task2,
              submission.task2_answer,
              submission.task2_word_count
            )}
        </div>

        {/* Expert Evaluation Section - Only show if feedback is sent */}
        {expert_feedback_sent && expertEvaluation && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="text-purple-600" size={28} />
              Expert Evaluation
            </h2>

            {expertEvaluation.task1 &&
              renderExpertTaskEvaluation(
                1,
                expertEvaluation.task1,
                submission.task1_answer,
                submission.task1_word_count
              )}

            {expertEvaluation.task2 &&
              renderExpertTaskEvaluation(
                2,
                expertEvaluation.task2,
                submission.task2_answer,
                submission.task2_word_count
              )}
          </div>
        )}

        {/* Expert Feedback Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Expert Feedback
          </h2>

          {expert_feedback_sent && expertEvaluation ? (
            <div className="space-y-6">
              {/* Task 1 Feedback */}
              {expertEvaluation.task1 && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">
                    Task 1 Expert Feedback
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Feedback:
                      </p>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {expertEvaluation.task1.feedback}
                      </p>
                    </div>
                    {expertEvaluation.task1.improvements &&
                      expertEvaluation.task1.improvements.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Improvements:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {expertEvaluation.task1.improvements.map(
                              (improvement: string, idx: number) => (
                                <li key={idx}>{improvement}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* Task 2 Feedback */}
              {expertEvaluation.task2 && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">
                    Task 2 Expert Feedback
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Feedback:
                      </p>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {expertEvaluation.task2.feedback}
                      </p>
                    </div>
                    {expertEvaluation.task2.improvements &&
                      expertEvaluation.task2.improvements.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Improvements:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {expertEvaluation.task2.improvements.map(
                              (improvement: string, idx: number) => (
                                <li key={idx}>{improvement}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {submission.expert_score && (
                <div className="mt-4 pt-4 border-t border-purple-200">
                  <span className="text-sm font-semibold text-gray-700">
                    Expert Overall Score:{' '}
                  </span>
                  <span
                    className={`text-lg font-bold ${getBandColor(submission.expert_score)}`}
                  >
                    {submission.expert_score}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Show request status or request button */}
              {reviewStatus?.has_request ? (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-blue-600" size={20} />
                      <p className="font-semibold text-gray-700">
                        Expert Review Requested
                      </p>
                    </div>
                    {reviewStatus.status && getStatusBadge(reviewStatus.status)}
                  </div>
                  <p className="text-sm text-gray-600">
                    Your request for expert review has been submitted.
                    {reviewStatus.requested_at && (
                      <span className="block mt-1">
                        Requested on:{' '}
                        {new Date(reviewStatus.requested_at).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    You will receive an email notification when the expert
                    review is completed.
                  </p>
                  <button
                    onClick={() => router.push('/my-expert-reviews')}
                    className="mt-3 text-sm text-[#06BBCC] hover:text-[#059aa8] font-medium"
                  >
                    View all my review requests →
                  </button>
                </div>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertCircle className="text-yellow-600 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-700">
                        Expert feedback not requested yet
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Request an expert review to get professional feedback on
                        your writing. Expert&apos;s score and feedback will be
                        sent via email after 24 hours and shown here as well.
                      </p>
                    </div>
                  </div>

                  {/* Success/Error Message */}
                  {requestMessage && (
                    <div
                      className={`mb-4 p-3 rounded-lg ${
                        requestMessage.type === 'success'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      <p className="text-sm">{requestMessage.text}</p>
                    </div>
                  )}

                  {/* Request Button */}
                  <button
                    onClick={handleRequestReview}
                    disabled={isRequestingReview}
                    className="w-full sm:w-auto bg-[#06BBCC] hover:bg-[#059aa8] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    {isRequestingReview ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Requesting...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Request Expert Review</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
