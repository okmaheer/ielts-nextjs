// lib/services/adminExpertReviewService.ts

import api from '../api';

// Types
export interface AdminExpertReviewRequest {
  id: string;
  submission_id: string;
  user_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  requested_at: string;
  reviewed_at: string | null;
  admin_notes: string | null;
  submission: {
    id: string;
    test_id: string;
    task1_answer: string | null;
    task1_word_count: number | null;
    task2_answer: string | null;
    task2_word_count: number | null;
    time_taken: number;
    ai_evaluation: Record<string, unknown>;
    overall_band_score: number;
    expert_score: number | null;
    expert_feedback: string | null;
    expert_feedback_sent: boolean;
    created_at: string;
    test: {
      id: string;
      title: string;
      category: string;
      questions: {
        id: string;
        task_number: number;
        question_text: string;
        word_limit: number;
      }[];
    };
  };
}

export interface ExpertEvaluation {
  task1?: {
    task_achievement: number;
    coherence_cohesion: number;
    lexical_resource: number;
    grammatical_accuracy: number;
    overall_band: number;
    feedback: string;
    improvements: string[];
  };
  task2?: {
    task_response: number;
    coherence_cohesion: number;
    lexical_resource: number;
    grammatical_accuracy: number;
    overall_band: number;
    feedback: string;
    improvements: string[];
  };
}

export interface SubmitExpertReviewPayload {
  expert_evaluation: ExpertEvaluation;
  expert_overall_score: number;
  admin_notes?: string;
  status?: string;
}

// API Service Functions
export const adminExpertReviewService = {
  // Get all expert review requests (with optional status filter)
  async getAllRequests(status?: string): Promise<AdminExpertReviewRequest[]> {
    const params = status && status !== 'all' ? { status } : {};
    const response = await api.get<{
      success: boolean;
      data: AdminExpertReviewRequest[];
      message: string;
    }>('/expert-review/admin/all', { params });
    return response.data.data;
  },

  // Get single review request details
  async getRequestDetails(
    requestId: string
  ): Promise<AdminExpertReviewRequest> {
    const response = await api.get<{
      success: boolean;
      data: AdminExpertReviewRequest;
      message: string;
    }>(`/expert-review/admin/request/${requestId}`);
    return response.data.data;
  },

  // Submit expert review
  async submitReview(
    requestId: string,
    payload: SubmitExpertReviewPayload
  ): Promise<{ request_id: string; status: string; message: string }> {
    const response = await api.post<{
      success: boolean;
      data: { request_id: string; status: string; message: string };
      message: string;
    }>(`/expert-review/admin/request/${requestId}/submit`, payload);
    return response.data.data;
  },

  // Update review request status
  async updateStatus(
    requestId: string,
    status: string,
    admin_notes?: string
  ): Promise<{
    id: string;
    status: string;
    reviewed_at: string | null;
    admin_notes: string | null;
  }> {
    const response = await api.patch<{
      success: boolean;
      data: {
        id: string;
        status: string;
        reviewed_at: string | null;
        admin_notes: string | null;
      };
      message: string;
    }>(`/expert-review/admin/request/${requestId}/status`, {
      status,
      admin_notes,
    });
    return response.data.data;
  },
};
