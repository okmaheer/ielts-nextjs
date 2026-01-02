'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  writingTestService,
  type SubmissionDetails,
  type TaskEvaluation,
} from '../../../../../../lib/services/writingTestService';
import {
  ChevronDown,
  ChevronUp,
  Award,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
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

  const toggleTask = (task: 'task1' | 'task2') => {
    setExpandedTask(expandedTask === task ? null : task);
  };

  const toggleCriteria = (key: string) => {
    setExpandedCriteria(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getBandColor = (band: number): string => {
    if (band === 0) return 'text-gray-500';
    if (band >= 7) return 'text-green-600';
    if (band >= 6) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getBandBgColor = (band: number): string => {
    if (band === 0) return 'bg-gray-100';
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
      task_achievement_details?: string;
      task_response?: number;
      task_response_details?: string;
      coherence_cohesion?: number;
      coherence_cohesion_details?: string;
      lexical_resource?: number;
      lexical_resource_details?: string;
      grammatical_accuracy?: number;
      grammatical_accuracy_details?: string;
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
                      `${taskKey}-achievement-expert`,
                      taskData.task_achievement_details
                    )}
                  {taskNum === 2 &&
                    taskData.task_response &&
                    renderCriteriaScore(
                      'Task Response',
                      taskData.task_response,
                      `${taskKey}-response-expert`,
                      taskData.task_response_details
                    )}
                  {renderCriteriaScore(
                    'Coherence & Cohesion',
                    taskData.coherence_cohesion || 0,
                    `${taskKey}-coherence-expert`,
                    taskData.coherence_cohesion_details
                  )}
                  {renderCriteriaScore(
                    'Lexical Resource',
                    taskData.lexical_resource || 0,
                    `${taskKey}-lexical-expert`,
                    taskData.lexical_resource_details
                  )}
                  {renderCriteriaScore(
                    'Grammatical Range & Accuracy',
                    taskData.grammatical_accuracy || 0,
                    `${taskKey}-grammar-expert`,
                    taskData.grammatical_accuracy_details
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
                      `${taskKey}-achievement`,
                      taskData.task_achievement_details
                    )}
                  {taskNum === 2 &&
                    taskData.task_response &&
                    renderCriteriaScore(
                      'Task Response',
                      taskData.task_response,
                      `${taskKey}-response`,
                      taskData.task_response_details
                    )}
                  {renderCriteriaScore(
                    'Coherence & Cohesion',
                    taskData.coherence_cohesion,
                    `${taskKey}-coherence`,
                    taskData.coherence_cohesion_details
                  )}
                  {renderCriteriaScore(
                    'Lexical Resource',
                    taskData.lexical_resource,
                    `${taskKey}-lexical`,
                    taskData.lexical_resource_details
                  )}
                  {renderCriteriaScore(
                    'Grammatical Range & Accuracy',
                    taskData.grammatical_accuracy,
                    `${taskKey}-grammar`,
                    taskData.grammatical_accuracy_details
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
            <p className="text-sm opacity-90"></p>
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
              <p className="text-sm opacity-90"></p>
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

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          {submission && (
            <>
              {/* Check if any task is incomplete */}
              {(!submission.ai_evaluation?.task1 ||
                submission.ai_evaluation.task1.overall_band === 0 ||
                !submission.ai_evaluation?.task2 ||
                submission.ai_evaluation.task2.overall_band === 0) && (
                <button
                  onClick={() => {
                    const testCategory =
                      submission.ai_evaluation?.task1?.task_achievement !==
                      undefined
                        ? 'academic'
                        : 'general-training';
                    router.push(
                      `/take-writing-tests/${testCategory}/${submission.test_id}`
                    );
                  }}
                  className="bg-[#06BBCC] hover:bg-[#059aa8] text-white px-8 py-3 rounded-lg font-medium"
                >
                  Attempt{' '}
                  {!submission.ai_evaluation?.task1 ||
                  submission.ai_evaluation.task1.overall_band === 0
                    ? 'Task 1'
                    : 'Task 2'}
                </button>
              )}
            </>
          )}
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
