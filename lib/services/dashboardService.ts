import apiClient from '../../lib/api';

// Types for Admin Dashboard
export interface AdminDashboardData {
  overview: {
    totalUsers: number;
    totalTests: number;
    totalSubmissions: number;
    totalExpertReviewRequests: number;
    recentSubmissions: number;
    activeUsersCount: number;
  };
  expertReviews: {
    total: number;
    byStatus: {
      pending?: number;
      in_progress?: number;
      completed?: number;
      rejected?: number;
    };
  };
  scores: {
    avgAiScore: number;
    avgExpertScore: number;
  };
  aiCosts: {
    totalCost: number;
    avgCostPerSubmission: number;
    totalTokensUsed: number;
    totalEvaluations: number;
    submissionsWithCostData: number;
  };
  submissionsChart: {
    last7Days: Record<string, number>;
  };
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
  topPerformers: Array<{
    id: string;
    name: string;
    email: string;
    avgScore: number;
    testCount: number;
  }>;
}

// Types for User Dashboard
export interface UserDashboardData {
  overview: {
    totalTestsTaken: number;
    avgScore: number;
    highestScore: number;
    lowestScore: number;
    expertReviewRequests: number;
  };
  expertReviews: {
    total: number;
    byStatus: {
      pending?: number;
      in_progress?: number;
      completed?: number;
      rejected?: number;
    };
  };
  taskPerformance: {
    task1Avg: number;
    task2Avg: number;
    task1Count: number;
    task2Count: number;
  };
  recentTests: Array<{
    id: string;
    testName: string;
    category: string;
    score: number;
    expertScore: number | null;
    task1Score: number;
    task2Score: number;
    date: string;
  }>;
  progress: Array<{
    testNumber: number;
    score: number;
    date: string;
  }>;
}

export const dashboardService = {
  /**
   * Get admin dashboard statistics
   */
  getAdminDashboard: async (): Promise<AdminDashboardData> => {
    const response = await apiClient.get('/dashboard/admin');
    return response.data;
  },

  /**
   * Get user dashboard statistics
   */
  getUserDashboard: async (): Promise<UserDashboardData> => {
    const response = await apiClient.get('/dashboard/user');
    return response.data;
  },
};

export default dashboardService;
