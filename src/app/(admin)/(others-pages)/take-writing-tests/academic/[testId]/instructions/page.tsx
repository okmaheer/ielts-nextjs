// app/(admin)/(others-pages)/take-writing-tests/academic/[testId]/instructions/page.tsx

'use client';

import { useParams } from 'next/navigation';
import Instructions from '@/components/takewritingtest/Instructions';

export default function AcademicWritingTestInstructionsPage() {
  const params = useParams();
  const testId = params.testId as string;

  // Define instructions for academic writing test
  const writingInstructions = {
    testType: 'Writing' as const,
    category: 'Academic' as 'Academic' | 'General Training',
    duration: 60,
    testName: `Test #${testId}`,
    sections: [
      {
        title: 'Task 1',
        duration: 20,
        description: 'You should spend about 20 minutes on this task.',
        requirements: [
          'Write at least 150 words (maximum 180 words)',
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
          'Write at least 250 words (maximum 320 words)',
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
          'Word count shown below your answer box. Task 1 requires minimum 150 words (max 180). Task 2 requires minimum 250 words (max 320). You cannot exceed the maximum word limit.',
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
      'Word requirements: 200 words (Task 1) and 250-320 words (Task 2)',
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
    startRoute: `/take-writing-tests/academic/${testId}`,
  };

  return <Instructions {...writingInstructions} />;
}
