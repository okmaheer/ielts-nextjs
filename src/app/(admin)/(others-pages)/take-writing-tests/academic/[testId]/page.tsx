'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BookOpen, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import {
  writingTestService,
  WritingTestWithQuestions,
  WritingQuestion,
} from '../../../../../../../lib/services/writingTestService';
import TestHeader from '@/components/writing-test/TestHeader';
import SubmitModal from '@/components/writing-test/SubmitModal';
import TestFooter from '@/components/writing-test/TestFooter';
import AuthRequiredModal from '@/components/auth/AuthRequiredModal';

export default function TakeWritingTestPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;

  const [currentTask, setCurrentTask] = useState<number>(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(16);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [testData, setTestData] = useState<WritingTestWithQuestions | null>(
    null
  );

  // Timer tracking
  const hasReachedZeroRef = useRef<boolean>(false); // Track if timer has reached 0
  const timerStartedRef = useRef<boolean>(false); // Track if timer has started

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Mock user data - replace with actual user from auth context
  const studentName = 'John Doe';
  const remainingTests = 3;

  // Check authentication FIRST - TOP PRIORITY
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsCheckingAuth(true);

        // Check if authToken cookie exists
        const cookies = document.cookie.split(';');
        const authToken = cookies.find(cookie =>
          cookie.trim().startsWith('authToken=')
        );

        if (!authToken) {
          setIsAuthenticated(false);
          setIsCheckingAuth(false);
          return;
        }

        setIsAuthenticated(true);
      } catch (err) {
        console.error('Auth check failed:', err);
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // Fetch test data from API - ONLY if authenticated
  useEffect(() => {
    if (!isAuthenticated || isCheckingAuth) return;

    const fetchTestData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await writingTestService.getTestDetails(Number(testId));
        setTestData(data);

        // Always set timer to 60 minutes (3600 seconds)
        setTimeRemaining(3600);
      } catch (err) {
        console.error('Error fetching test:', err);
        setError('Failed to load test. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (testId) {
      fetchTestData();
    }
  }, [testId, isAuthenticated, isCheckingAuth]);

  // Timer countdown - runs every second
  useEffect(() => {
    // Don't start timer if: no data, still loading, not authenticated, or timer is 0
    if (!testData || isLoading || !isAuthenticated || timeRemaining === 0)
      return;

    // Mark timer as started
    if (!timerStartedRef.current && timeRemaining > 0) {
      timerStartedRef.current = true;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;

        // When timer reaches 0, submit the test
        if (newTime <= 0) {
          clearInterval(timer);

          // Only submit once using ref
          if (!hasReachedZeroRef.current) {
            hasReachedZeroRef.current = true;
            console.log('Timer reached 0 - Submitting test...');
            // Auto-submit when timer reaches 0
            submitTest();
          }

          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testData, isLoading, isAuthenticated, timeRemaining]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const countWords = (text?: string): number => {
    if (!text) return 0;
    return text
      .trim()
      .split(/\s+/)
      .filter((word: string) => word.length > 0).length;
  };

  const handleAnswerChange = (text: string, taskNumber: number) => {
    if (!testData) return;
    const question = testData.questions.find(
      (q: WritingQuestion) => q.task_number === taskNumber
    );
    if (!question) return;

    const wordCount = countWords(text);
    if (wordCount <= question.word_limit) {
      setAnswers(prev => ({ ...prev, [taskNumber]: text }));
    }
  };

  const getWordCountStatus = (
    count: number,
    minWords: number,
    maxWords: number
  ) => {
    if (count === 0)
      return {
        color: 'text-gray-400',
        hasIcon: false,
        message: '',
        isAlert: false,
      };
    if (count > maxWords)
      return {
        color: 'text-red-500',
        hasIcon: true,
        isAlert: true,
        message: 'Exceeds limit',
      };
    if (count < minWords)
      return {
        color: 'text-orange-500',
        hasIcon: true,
        isAlert: true,
        message: 'Below minimum',
      };
    return {
      color: 'text-green-500',
      hasIcon: true,
      isAlert: false,
      message: 'Good',
    };
  };

  const handleSubmit = () => {
    // Validate that all tasks meet the 50% minimum word count requirement
    for (const question of testData?.questions || []) {
      const minWords = Math.ceil(question.word_limit * 0.5);
      const wordCount = countWords(answers[question.task_number] || '');

      if (wordCount < minWords) {
        alert(
          `Task ${question.task_number} must have at least ${minWords} words (50% of ${question.word_limit}). Current: ${wordCount} words.`
        );
        return;
      }
    }

    setShowSubmitModal(true);
  };

  const submitTest = async () => {
    if (!testData) return;

    try {
      const payload = {
        test_id: testData.test.id,
        time_taken: 3600 - timeRemaining, // 60 minutes in seconds
        answers: testData.questions.map(q => ({
          task_number: q.task_number,
          answer_text: answers[q.task_number] || '',
          word_count: countWords(answers[q.task_number] || ''),
        })),
      };

      const result = await writingTestService.submitWritingTest(payload);
      console.log('Test submitted successfully!', result);
      // Redirect to results page
      router.push(`/writing-test-results/${result.data.submission_id}`);
    } catch (err) {
      console.error('Error submitting test:', err);
      alert('Failed to submit test. Please try again.');
    }
  };

  const confirmSubmit = async () => {
    setShowSubmitModal(false);
    await submitTest();
  };

  const handleDashboardClick = () => {
    router.push('/dashboard');
  };

  const handleLogout = () => {
    console.log('Logout');
    router.push('/signin');
  };

  // Show auth modal if not authenticated
  if (!isAuthenticated && !isCheckingAuth) {
    return <AuthRequiredModal show={true} />;
  }

  // Checking authentication state
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#06BBCC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Loading test data
  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#06BBCC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p
            className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg`}
          >
            Loading test...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      >
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#06BBCC] hover:bg-[#059aa8] text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No Data State
  if (!testData) {
    return null;
  }

  const currentQuestion = testData.questions.find(
    (q: WritingQuestion) => q.task_number === currentTask
  );
  const currentAnswer = answers[currentTask] || '';
  const currentWordCount = countWords(currentAnswer);
  // Calculate minimum words as 50% of word_limit
  const minWords = Math.ceil((currentQuestion?.word_limit || 0) * 0.5);
  const wordCountStatus = getWordCountStatus(
    currentWordCount,
    minWords,
    currentQuestion?.word_limit || 0
  );

  return (
    <div
      className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}
    >
      <TestHeader
        studentName={studentName}
        remainingTests={remainingTests}
        timeRemaining={timeRemaining}
        darkMode={darkMode}
        fontSize={fontSize}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        setDarkMode={setDarkMode}
        setFontSize={setFontSize}
        onDashboardClick={handleDashboardClick}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-hidden">
        <div className="h-full max-w-[1800px] mx-auto p-6">
          <div
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg h-full flex flex-col overflow-hidden`}
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-[#06BBCC]/10 to-transparent">
              <div>
                <h2 className="text-2xl font-bold">Task {currentTask}</h2>
                <p
                  className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1`}
                >
                  {testData.test.category === 1
                    ? 'Academic Writing Task'
                    : 'General Training Writing Task'}{' '}
                  {currentTask}
                </p>
              </div>
              <div
                className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} px-4 py-2 rounded-lg`}
              >
                <span className="text-sm font-medium">
                  Min: {minWords} words
                </span>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-hidden">
              <div
                className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-xl p-6 overflow-auto border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#06BBCC] flex items-center justify-center">
                    <BookOpen size={16} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">Question</h3>
                </div>
                <div
                  style={{ fontSize: `${fontSize}px` }}
                  className="whitespace-pre-line leading-relaxed"
                >
                  {currentQuestion?.question_text}
                </div>
                {currentQuestion?.image_url && (
                  <div className="mt-6">
                    <img
                      src={currentQuestion.image_url}
                      alt="Task visual"
                      className="w-full rounded-xl border-2 border-gray-300 shadow-md"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#06BBCC] flex items-center justify-center">
                      <FileText size={16} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">Your Answer</h3>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  >
                    {wordCountStatus.hasIcon &&
                      (wordCountStatus.isAlert ? (
                        <AlertCircle
                          size={16}
                          className={wordCountStatus.color}
                        />
                      ) : (
                        <CheckCircle
                          size={16}
                          className={wordCountStatus.color}
                        />
                      ))}
                    <span
                      className={`text-sm font-semibold ${wordCountStatus.color}`}
                    >
                      {currentWordCount} / {currentQuestion?.word_limit}
                    </span>
                    {wordCountStatus.message && (
                      <span className={`text-xs ${wordCountStatus.color}`}>
                        • {wordCountStatus.message}
                      </span>
                    )}
                  </div>
                </div>
                <textarea
                  value={currentAnswer}
                  onChange={e =>
                    handleAnswerChange(e.target.value, currentTask)
                  }
                  style={{ fontSize: `${fontSize}px` }}
                  className={`flex-1 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} border-2 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#06BBCC] focus:border-[#06BBCC] resize-none transition-all`}
                  placeholder="Start typing your answer here..."
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <TestFooter
        currentTask={currentTask}
        totalTasks={testData.questions.length}
        darkMode={darkMode}
        onTaskChange={setCurrentTask}
        onSubmit={handleSubmit}
      />

      <SubmitModal
        show={showSubmitModal}
        darkMode={darkMode}
        task1Words={countWords(answers[1] || '')}
        task2Words={countWords(answers[2] || '')}
        timeRemaining={formatTime(timeRemaining)}
        onCancel={() => setShowSubmitModal(false)}
        onConfirm={confirmSubmit}
      />
    </div>
  );
}
