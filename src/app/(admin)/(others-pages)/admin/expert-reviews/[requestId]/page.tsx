'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  adminExpertReviewService,
  type AdminExpertReviewRequest,
  type ExpertEvaluation,
} from '../../../../../../../lib/services/adminExpertReviewService';
import { Save, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

export default function AdminReviewDetails() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.requestId as string;

  const [request, setRequest] = useState<AdminExpertReviewRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Expert evaluation form state
  const [expertEvaluation, setExpertEvaluation] = useState<ExpertEvaluation>(
    {}
  );
  const [adminNotes, setAdminNotes] = useState('');
  const [reviewStatus, setReviewStatus] = useState<string>('completed');

  useEffect(() => {
    fetchRequestDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  const fetchRequestDetails = async () => {
    try {
      setIsLoading(true);
      const data = await adminExpertReviewService.getRequestDetails(requestId);
      setRequest(data);
      setAdminNotes(data.admin_notes || '');
      // Only restore status if it was previously completed/rejected (re-editing a finished review)
      if (data.status === 'completed' || data.status === 'rejected') {
        setReviewStatus(data.status);
      }

      // If expert feedback exists, parse and populate form
      if (data.submission.expert_feedback) {
        try {
          const parsed =
            typeof data.submission.expert_feedback === 'string'
              ? JSON.parse(data.submission.expert_feedback)
              : data.submission.expert_feedback;
          setExpertEvaluation(parsed);
        } catch (e) {
          console.error('Error parsing expert feedback:', e);
        }
      } else {
        // Initialize with AI evaluation structure
        const aiEval = data.submission.ai_evaluation as {
          task1?: {
            task_achievement?: number;
            coherence_cohesion?: number;
            lexical_resource?: number;
            grammatical_accuracy?: number;
            overall_band?: number;
          };
          task2?: {
            task_response?: number;
            coherence_cohesion?: number;
            lexical_resource?: number;
            grammatical_accuracy?: number;
            overall_band?: number;
          };
        };
        const initialEval: ExpertEvaluation = {};

        if (aiEval?.task1) {
          initialEval.task1 = {
            task_achievement: aiEval.task1.task_achievement || 0,
            coherence_cohesion: aiEval.task1.coherence_cohesion || 0,
            lexical_resource: aiEval.task1.lexical_resource || 0,
            grammatical_accuracy: aiEval.task1.grammatical_accuracy || 0,
            overall_band: aiEval.task1.overall_band || 0,
            feedback: '',
            improvements: [''],
          };
        }

        if (aiEval?.task2) {
          initialEval.task2 = {
            task_response: aiEval.task2.task_response || 0,
            coherence_cohesion: aiEval.task2.coherence_cohesion || 0,
            lexical_resource: aiEval.task2.lexical_resource || 0,
            grammatical_accuracy: aiEval.task2.grammatical_accuracy || 0,
            overall_band: aiEval.task2.overall_band || 0,
            feedback: '',
            improvements: [''],
          };
        }

        setExpertEvaluation(initialEval);
      }
    } catch (err) {
      console.error('Error fetching request details:', err);
      setError('Failed to load request details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateOverallBand = (): number => {
    const task1Band = expertEvaluation.task1?.overall_band || 0;
    const task2Band = expertEvaluation.task2?.overall_band || 0;

    if (task1Band > 0 && task2Band > 0) {
      // IELTS formula: (Task 1 + 2×Task 2) ÷ 3
      const rawScore = (task1Band + 2 * task2Band) / 3;
      // Round to nearest 0.5
      return Math.round(rawScore * 2) / 2;
    } else if (task1Band > 0) {
      return task1Band;
    } else if (task2Band > 0) {
      return task2Band;
    }
    return 0;
  };

  const updateTaskScore = (
    taskNum: 1 | 2,
    criterion: string,
    value: number
  ) => {
    const taskKey = `task${taskNum}` as 'task1' | 'task2';
    setExpertEvaluation(prev => {
      const taskData = prev[taskKey] || {
        ...(taskNum === 1 ? { task_achievement: 0 } : { task_response: 0 }),
        coherence_cohesion: 0,
        lexical_resource: 0,
        grammatical_accuracy: 0,
        overall_band: 0,
        feedback: '',
        improvements: [''],
      };

      return {
        ...prev,
        [taskKey]: {
          ...taskData,
          [criterion]: value,
        },
      };
    });
  };

  const updateTaskFeedback = (taskNum: 1 | 2, feedback: string) => {
    const taskKey = `task${taskNum}` as 'task1' | 'task2';
    setExpertEvaluation(prev => ({
      ...prev,
      [taskKey]: {
        ...prev[taskKey]!,
        feedback,
      },
    }));
  };

  const updateTaskImprovements = (
    taskNum: 1 | 2,
    index: number,
    value: string
  ) => {
    const taskKey = `task${taskNum}` as 'task1' | 'task2';
    setExpertEvaluation(prev => {
      const improvements = [...(prev[taskKey]?.improvements || [''])];
      improvements[index] = value;
      return {
        ...prev,
        [taskKey]: {
          ...prev[taskKey]!,
          improvements,
        },
      };
    });
  };

  const addImprovement = (taskNum: 1 | 2) => {
    const taskKey = `task${taskNum}` as 'task1' | 'task2';
    setExpertEvaluation(prev => ({
      ...prev,
      [taskKey]: {
        ...prev[taskKey]!,
        improvements: [...(prev[taskKey]?.improvements || []), ''],
      },
    }));
  };

  const removeImprovement = (taskNum: 1 | 2, index: number) => {
    const taskKey = `task${taskNum}` as 'task1' | 'task2';
    setExpertEvaluation(prev => {
      const improvements = (prev[taskKey]?.improvements || []).filter(
        (_, i) => i !== index
      );
      return {
        ...prev,
        [taskKey]: {
          ...prev[taskKey]!,
          improvements: improvements.length > 0 ? improvements : [''],
        },
      };
    });
  };

  const handleSubmit = async () => {
    if (!request) return;

    // Validation
    const overallScore = calculateOverallBand();
    if (overallScore === 0) {
      setSaveMessage({
        type: 'error',
        text: 'Please provide scores for at least one task',
      });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      await adminExpertReviewService.submitReview(requestId, {
        expert_evaluation: expertEvaluation,
        expert_overall_score: overallScore,
        admin_notes: adminNotes,
        status: reviewStatus, // only 'completed' or 'rejected'
      });

      setSaveMessage({
        type: 'success',
        text: 'Expert review submitted successfully!',
      });

      // Refresh data
      setTimeout(() => {
        router.push('/admin/expert-reviews');
      }, 1500);
    } catch (err) {
      console.error('Error submitting review:', err);
      const error = err as { response?: { data?: { message?: string } } };
      setSaveMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          'Failed to submit review. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getBandColor = (band: number): string => {
    if (band >= 7) return 'text-green-600';
    if (band >= 6) return 'text-yellow-600';
    return 'text-orange-600';
  };

  if (isLoading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Review Details" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#06BBCC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading review details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Review Details" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <p className="text-red-500 text-lg mb-4">
              {error || 'Request not found'}
            </p>
            <button
              onClick={() => router.push('/admin/expert-reviews')}
              className="bg-[#06BBCC] hover:bg-[#059aa8] text-white px-6 py-2 rounded-lg"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { submission } = request;
  const overallBand = calculateOverallBand();

  return (
    <div>
      <PageBreadcrumb pageTitle="Expert Review" />

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {submission.test.title}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Submission #{submission.id} • Requested:{' '}
                {new Date(request.requested_at).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/expert-reviews')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Back to List</span>
            </button>
          </div>

          {/* AI Score vs Expert Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">
                AI Overall Band Score
              </p>
              <p
                className={`text-3xl font-bold ${getBandColor(submission.overall_band_score)}`}
              >
                {submission.overall_band_score.toFixed(1)}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">
                Expert Overall Band Score
              </p>
              <p className={`text-3xl font-bold ${getBandColor(overallBand)}`}>
                {overallBand.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Success/Error Message */}
        {saveMessage && (
          <div
            className={`p-4 rounded-lg ${
              saveMessage.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            <div className="flex items-center gap-2">
              {saveMessage.type === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <p className="font-medium">{saveMessage.text}</p>
            </div>
          </div>
        )}

        {/* Task 1 - if exists */}
        {submission.task1_answer &&
          submission.test.questions.find(q => q.task_number === 1) && (
            <TaskReviewForm
              taskNum={1}
              question={
                submission.test.questions.find(q => q.task_number === 1)!
              }
              answer={submission.task1_answer}
              wordCount={submission.task1_word_count}
              aiEvaluation={
                (submission.ai_evaluation?.task1 as {
                  task_achievement?: number;
                  coherence_cohesion?: number;
                  lexical_resource?: number;
                  grammatical_accuracy?: number;
                  overall_band?: number;
                }) || null
              }
              expertEvaluation={expertEvaluation.task1 || null}
              onScoreChange={(criterion, value) =>
                updateTaskScore(1, criterion, value)
              }
              onFeedbackChange={feedback => updateTaskFeedback(1, feedback)}
              onImprovementChange={(index, value) =>
                updateTaskImprovements(1, index, value)
              }
              onAddImprovement={() => addImprovement(1)}
              onRemoveImprovement={index => removeImprovement(1, index)}
            />
          )}

        {/* Task 2 - if exists */}
        {submission.task2_answer &&
          submission.test.questions.find(q => q.task_number === 2) && (
            <TaskReviewForm
              taskNum={2}
              question={
                submission.test.questions.find(q => q.task_number === 2)!
              }
              answer={submission.task2_answer}
              wordCount={submission.task2_word_count}
              aiEvaluation={
                (submission.ai_evaluation?.task2 as {
                  task_response?: number;
                  coherence_cohesion?: number;
                  lexical_resource?: number;
                  grammatical_accuracy?: number;
                  overall_band?: number;
                }) || null
              }
              expertEvaluation={expertEvaluation.task2 || null}
              onScoreChange={(criterion, value) =>
                updateTaskScore(2, criterion, value)
              }
              onFeedbackChange={feedback => updateTaskFeedback(2, feedback)}
              onImprovementChange={(index, value) =>
                updateTaskImprovements(2, index, value)
              }
              onAddImprovement={() => addImprovement(2)}
              onRemoveImprovement={index => removeImprovement(2, index)}
            />
          )}

        {/* Admin Notes and Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Admin Notes & Status
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Outcome
              </label>
              <select
                value={reviewStatus}
                onChange={e => setReviewStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06BBCC] focus:border-transparent"
              >
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes (Internal Only)
              </label>
              <textarea
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06BBCC] focus:border-transparent"
                placeholder="Add notes about this review (visible only to admins)"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => router.push('/admin/expert-reviews')}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving || overallBand === 0}
            className="px-6 py-3 bg-[#06BBCC] hover:bg-[#059aa8] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Submit Expert Review</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Task Review Form Component
function TaskReviewForm({
  taskNum,
  question,
  answer,
  wordCount,
  aiEvaluation,
  expertEvaluation,
  onScoreChange,
  onFeedbackChange,
  onImprovementChange,
  onAddImprovement,
  onRemoveImprovement,
}: {
  taskNum: number;
  question: {
    id: string;
    task_number: number;
    question_text: string;
    word_limit: number;
  };
  answer: string;
  wordCount: number | null;
  aiEvaluation: {
    task_achievement?: number;
    task_response?: number;
    coherence_cohesion?: number;
    lexical_resource?: number;
    grammatical_accuracy?: number;
    overall_band?: number;
  } | null;
  expertEvaluation: {
    task_achievement?: number;
    task_response?: number;
    coherence_cohesion?: number;
    lexical_resource?: number;
    grammatical_accuracy?: number;
    overall_band?: number;
    feedback?: string;
    improvements?: string[];
  } | null;
  onScoreChange: (criterion: string, value: number) => void;
  onFeedbackChange: (feedback: string) => void;
  onImprovementChange: (index: number, value: string) => void;
  onAddImprovement: () => void;
  onRemoveImprovement: (index: number) => void;
}) {
  const getBandColor = (band: number): string => {
    if (band >= 7) return 'text-green-600';
    if (band >= 6) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const criteriaName = taskNum === 1 ? 'task_achievement' : 'task_response';
  const criteriaLabel = taskNum === 1 ? 'Task Achievement' : 'Task Response';

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Task {taskNum} Expert Review
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Question & Answer */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Question</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{question?.question_text}</p>
              <p className="text-xs text-gray-500 mt-2">
                Maximum words: {question?.word_limit} (Minimum:{' '}
                {Math.ceil((question?.word_limit || 0) * 0.5)} words)
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              Student&apos;s Answer ({wordCount} words)
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>
            </div>
          </div>

          {/* AI Evaluation Reference */}
          {aiEvaluation && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">
                AI Evaluation (Reference)
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">{criteriaLabel}:</span>{' '}
                  <span
                    className={getBandColor(aiEvaluation[criteriaName] || 0)}
                  >
                    {aiEvaluation[criteriaName] || 0}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Coherence & Cohesion:</span>{' '}
                  <span
                    className={getBandColor(
                      aiEvaluation.coherence_cohesion || 0
                    )}
                  >
                    {aiEvaluation.coherence_cohesion || 0}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Lexical Resource:</span>{' '}
                  <span
                    className={getBandColor(aiEvaluation.lexical_resource || 0)}
                  >
                    {aiEvaluation.lexical_resource || 0}
                  </span>
                </p>
                <p>
                  <span className="font-medium">
                    Grammatical Range & Accuracy:
                  </span>{' '}
                  <span
                    className={getBandColor(
                      aiEvaluation.grammatical_accuracy || 0
                    )}
                  >
                    {aiEvaluation.grammatical_accuracy || 0}
                  </span>
                </p>
                <p className="pt-2 border-t border-blue-200 mt-2">
                  <span className="font-bold">Overall Band:</span>{' '}
                  <span
                    className={`font-bold ${getBandColor(aiEvaluation.overall_band || 0)}`}
                  >
                    {aiEvaluation.overall_band || 0}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Expert Scores & Feedback */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700">Expert Scores</h3>

          {/* Score Inputs */}
          <ScoreInput
            label={criteriaLabel}
            value={expertEvaluation?.[criteriaName] || 0}
            onChange={value => onScoreChange(criteriaName, value)}
          />
          <ScoreInput
            label="Coherence & Cohesion"
            value={expertEvaluation?.coherence_cohesion || 0}
            onChange={value => onScoreChange('coherence_cohesion', value)}
          />
          <ScoreInput
            label="Lexical Resource"
            value={expertEvaluation?.lexical_resource || 0}
            onChange={value => onScoreChange('lexical_resource', value)}
          />
          <ScoreInput
            label="Grammatical Range & Accuracy"
            value={expertEvaluation?.grammatical_accuracy || 0}
            onChange={value => onScoreChange('grammatical_accuracy', value)}
          />

          {/* Overall Band (Manual) */}
          <div className="pt-4 border-t border-gray-200">
            <ScoreInput
              label="Overall Band Score"
              value={expertEvaluation?.overall_band || 0}
              onChange={value => onScoreChange('overall_band', value)}
            />
          </div>

          {/* Feedback */}
          <div className="pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Feedback (280-350 words)
            </label>
            <textarea
              value={expertEvaluation?.feedback || ''}
              onChange={e => onFeedbackChange(e.target.value)}
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06BBCC] focus:border-transparent"
              placeholder="Provide detailed feedback on the student's performance..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {expertEvaluation?.feedback?.length || 0} characters
            </p>
          </div>

          {/* Improvements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Improvements (2-3 points)
            </label>
            {expertEvaluation?.improvements?.map(
              (improvement: string, index: number) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={improvement}
                    onChange={e => onImprovementChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06BBCC] focus:border-transparent"
                    placeholder={`Improvement ${index + 1}`}
                  />
                  {(expertEvaluation?.improvements?.length ?? 0) > 1 && (
                    <button
                      onClick={() => onRemoveImprovement(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )
            )}
            <button
              onClick={onAddImprovement}
              className="text-sm text-[#06BBCC] hover:text-[#059aa8] font-medium"
            >
              + Add Improvement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Score Input Component
function ScoreInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const getBandColor = (band: number): string => {
    if (band >= 7) return 'bg-green-500';
    if (band >= 6) return 'bg-yellow-500';
    if (band >= 4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const bands = [
    0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9,
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <select
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="w-36 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06BBCC] focus:border-transparent"
        >
          {bands.map(b => (
            <option key={b} value={b}>
              {b === 0 ? 'Not Scored' : `Band ${b}`}
            </option>
          ))}
        </select>
        {value > 0 && (
          <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`${getBandColor(value)} h-3 rounded-full transition-all duration-300`}
              style={{ width: `${(value / 9) * 100}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
