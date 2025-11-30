// lib/services/writingTestService.ts

import api from '../api';

// Types
export interface TestSubmission {
  id: string;
  overall_band_score: number;
  task1_score: number;
  task2_score: number;
  task1_completed: boolean;
  task2_completed: boolean;
  submitted_at: string;
}

export interface WritingTest {
  id: number;
  name: string;
  title?: string; // Alias for name
  description?: string;
  type: number;
  category: number;
  duration?: number;
  total_marks?: number;
  created_at: string;
  updated_at: string;
  submission?: TestSubmission | null;
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
    submission_id: string;
    overall_band: number;
    evaluation: AIEvaluation;
    message: string;
  };
  message: string;
}

export interface AIEvaluation {
  task1?: TaskEvaluation;
  task2?: TaskEvaluation;
  average_band: number;
  tokens_used?: number;
  estimated_cost?: string;
}

export interface TaskEvaluation {
  task_achievement?: number; // For Task 1
  task_achievement_details?: string; // For Task 1
  task_response?: number; // For Task 2
  task_response_details?: string; // For Task 2
  coherence_cohesion: number;
  coherence_cohesion_details?: string;
  lexical_resource: number;
  lexical_resource_details?: string;
  grammatical_accuracy: number;
  grammatical_accuracy_details?: string;
  overall_band: number;
  feedback: string;
  improvements: string[];
}

export interface SubmissionDetails {
  id: string;
  user_id: string;
  test_id: string;
  task1_answer: string | null;
  task1_word_count: number | null;
  task2_answer: string | null;
  task2_word_count: number | null;
  time_taken: number;
  ai_evaluation: AIEvaluation;
  expert_score: number | null;
  expert_feedback: string | null;
  expert_feedback_sent: boolean;
  overall_band_score: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SubmissionDetailsResponse {
  success: boolean;
  data: SubmissionDetails;
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

  // Get submission details by ID
  async getSubmissionDetails(submissionId: string): Promise<SubmissionDetails> {
    const response = await api.get<SubmissionDetailsResponse>(
      `/take-test/writing/submission/${submissionId}`
    );
    return response.data.data;
  },

  // Get all user submissions
  async getUserSubmissions(): Promise<SubmissionDetails[]> {
    const response = await api.get<{
      success: boolean;
      data: SubmissionDetails[];
      message: string;
    }>('/take-test/writing/submissions');
    return response.data.data;
  },
};
