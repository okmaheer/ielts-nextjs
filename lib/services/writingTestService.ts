// lib/services/writingTestService.ts

import api from '../api';

// Types
export interface WritingTest {
  id: number;
  name: string;
  description: string;
  type: number;
  category: number;
  duration: number;
  total_marks: number;
  created_at: string;
  updated_at: string;
}

export interface WritingQuestion {
  id: number;
  test_id: number;
  task_number: number;
  question_text: string;
  image_url: string | null;
  word_limit: number;
  created_at: string;
  updated_at: string;
}

export interface WritingTestWithQuestions {
  test: WritingTest;
  questions: WritingQuestion[];
}

export interface WritingTestsResponse {
  success: boolean;
  data: WritingTest[];
  message: string;
}

export interface WritingTestDetailsResponse {
  success: boolean;
  data: WritingTestWithQuestions;
  message: string;
}

export interface SubmitWritingTestPayload {
  test_id: number;
  answers: {
    task_number: number;
    answer_text: string;
    word_count: number;
  }[];
  time_taken: number; // in seconds
}

export interface SubmitWritingTestResponse {
  success: boolean;
  data: {
    submission_id: number;
    message: string;
  };
  message: string;
}

export type TestCategory = 'academic' | 'generalTraining';

// API Service Functions
export const writingTestService = {
  // Get academic writing tests
  async getAcademicWritingTests(): Promise<WritingTest[]> {
    const response = await api.get('/take-test/writing/academic-writing-test');
    return response.data.data;
  },

  // Get general training writing tests
  async getGeneralTrainingWritingTests(): Promise<WritingTest[]> {
    const response = await api.get(
      '/take-test/writing/general-training-writing-test'
    );
    return response.data.data;
  },

  // Generic method to get tests by category
  async getTestsByCategory(category: TestCategory): Promise<WritingTest[]> {
    if (category === 'academic') {
      return this.getAcademicWritingTests();
    } else {
      return this.getGeneralTrainingWritingTests();
    }
  },

  // Get test details with questions
  async getTestDetails(testId: number): Promise<WritingTestWithQuestions> {
    const response = await api.get<WritingTestDetailsResponse>(
      `/take-test/writing/${testId}`
    );
    return response.data.data;
  },

  // Submit writing test
  async submitWritingTest(
    payload: SubmitWritingTestPayload
  ): Promise<SubmitWritingTestResponse> {
    const response = await api.post<SubmitWritingTestResponse>(
      '/take-test/writing/submit',
      payload
    );
    return response.data;
  },
};
