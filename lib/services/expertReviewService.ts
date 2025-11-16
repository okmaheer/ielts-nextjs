// lib/services/expertReviewService.ts

import api from '../api';

// Types
export interface ExpertReviewRequest {
  id: string;
  submission_id: string;
  user_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  requested_at: string;
  reviewed_at: string | null;
  admin_notes: string | null;
  submission?: {
    id: string;
    test_id: string;
    overall_band_score: number;
    expert_score: number | null;
    expert_feedback: string | null;
    expert_feedback_sent: boolean;
    created_at: string;
  };
}

export interface RequestReviewPayload {
  submission_id: string;
}

export interface RequestReviewResponse {
  success: boolean;
  data: {
    id: string;
    submission_id: string;
    status: string;
    requested_at: string;
    message: string;
  };
  message: string;
}

export interface ReviewStatusResponse {
  success: boolean;
  data: {
    has_request: boolean;
    request_id?: string;
    status?: string;
    requested_at?: string;
    reviewed_at?: string | null;
  };
  message: string;
}

// API Service Functions
export const expertReviewService = {
  // Request expert review for a submission
  async requestReview(
    submissionId: string
  ): Promise<RequestReviewResponse['data']> {
    const response = await api.post<RequestReviewResponse>(
      '/expert-review/request',
      { submission_id: submissionId }
    );
    return response.data.data;
  },

  // Get all user's review requests
  async getMyRequests(): Promise<ExpertReviewRequest[]> {
    const response = await api.get<{
      success: boolean;
      data: ExpertReviewRequest[];
      message: string;
    }>('/expert-review/my-requests');
    return response.data.data;
  },

  // Get single review request details
  async getRequestDetails(requestId: string): Promise<ExpertReviewRequest> {
    const response = await api.get<{
      success: boolean;
      data: ExpertReviewRequest;
      message: string;
    }>(`/expert-review/request/${requestId}`);
    return response.data.data;
  },

  // Check if expert review exists for a submission
  async checkReviewStatus(
    submissionId: string
  ): Promise<ReviewStatusResponse['data']> {
    const response = await api.get<ReviewStatusResponse>(
      `/expert-review/check/${submissionId}`
    );
    return response.data.data;
  },
};
