// app/(full-width-pages)/writing-test-instructions/page.tsx

'use client';

import { useSearchParams } from 'next/navigation';
import Instructions from '@/components/takewritingtest/Instructions';
import { useEffect, useState } from 'react';
export default function WritingTestInstructionsPage() {
  const searchParams = useSearchParams();
  const testId = searchParams.get('testId');
  const category = searchParams.get('category');
  const testName = searchParams.get('testName');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading or fetch test data if needed
    setIsLoading(false);
  }, [testId, category]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div
            className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200"
            style={{ borderTopColor: '#06BBCC' }}
          ></div>
          <p className="text-gray-600">Loading instructions...</p>
        </div>
      </div>
    );
  }

  if (!testId || !category) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Invalid Test</h2>
          <p className="text-gray-600">Test ID or category is missing.</p>
        </div>
      </div>
    );
  }

  // Define instructions for writing test
  const writingInstructions = {
    testType: 'Writing' as const,
    category: (category === 'academic' ? 'Academic' : 'General Training') as
      | 'Academic'
      | 'General Training',
    duration: 60,
    testId: parseInt(testId),
    testName: testName,
    sections: [
      {
        title: 'Task 1',
        duration: 20,
        description: 'You should spend about 20 minutes on this task.',
        requirements: [
          'Write at least 150 words minimum',
          'Question displayed on the left, write your answer on the right',
          'Describe visual information (graph, chart, diagram, or table)',
          'Summarize and report main features with comparisons',
        ],
      },
      {
        title: 'Task 2',
        duration: 40,
        description: 'You should spend about 40 minutes on this task.',
        requirements: [
          'Write at least 250 words minimum',
          'Question displayed on the left, write your answer on the right',
          'Present and justify an opinion with examples',
          'Compare and contrast evidence and opinions',
        ],
      },
    ],
    generalRules: [
      {
        icon: 'Clock',
        title: 'Time Management',
        description:
          'Complete both tasks within 60 minutes. Timer visible at top of screen. Clock changes color when 5 minutes remain. Test auto-submits when time expires.',
      },
      {
        icon: 'FileText',
        title: 'Word Count',
        description:
          'Word count shown below your answer box. Task 1 requires minimum 150 words. Task 2 requires minimum 250 words. You cannot exceed the maximum word limit.',
      },
      {
        icon: 'Target',
        title: 'Navigation',
        description:
          'Use arrow buttons at the bottom of the screen to move between Task 1 and Task 2. You can switch tasks at any time during the test.',
      },
      {
        icon: 'Settings',
        title: 'Accessibility Features',
        description:
          'Adjust font size for comfortable writing. Switch between light and dark mode for visual comfort. Settings available in the top-right corner.',
      },
    ],
    importantNotes: [
      'Complete two writing tasks within 60 minutes total',
      'Task questions are displayed on the left; write your answers on the right',
      'Word count is shown below your answer box at all times',
      'Minimum word requirements: 150 words (Task 1) and 250 words (Task 2)',
      'Timer visible at top of screen; changes color when 5 minutes remain',
      'You can change font size and color mode for comfortable writing',
      'Use arrow buttons at bottom to move between Task 1 and Task 2',
      'Click "Submit Test" button when you are done with both tasks',
      'Ensure stable internet connection before starting',
      'Do not refresh the page during the test',
      'Your answers are auto-saved periodically',
      'You can only take this test once',
      'AI analysis and expert review provided after submission',
    ],
    startRoute: `/take-writing-tests/${category}/${testId}`,
  };

  return <Instructions {...writingInstructions} />;
}
