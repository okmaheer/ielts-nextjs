import api from '../api';

export interface SubscriptionInfo {
  price: string;
  currency: string;
  itemName: string;
  testCounts: {
    academicWriting: number;
    generalTrainingWriting: number;
  };
}

export interface InitiatePaymentResponse {
  paymentUrl: string;
  transactionId: string;
}

export interface PaymentCallbackResponse {
  transactionId: string;
  status: string;
  isSuccess: boolean;
}

export interface PaymentStatusResponse {
  transactionId: string;
  status: string;
  amount: number;
  currency: string;
  isSuccess: boolean;
  createdAt: string;
}

export const paymentService = {
  async getSubscriptionInfo(): Promise<SubscriptionInfo> {
    const response = await api.get('/payment/subscription-info');
    return response.data.data;
  },

  async initiatePayment(): Promise<InitiatePaymentResponse> {
    const response = await api.post('/payment/initiate');
    return response.data.data;
  },

  async verifyCallback(
    params: Record<string, string>
  ): Promise<PaymentCallbackResponse> {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/payment/callback?${queryString}`);
    return response.data.data;
  },

  async getPaymentStatus(
    transactionId: string
  ): Promise<PaymentStatusResponse> {
    const response = await api.get(`/payment/status/${transactionId}`);
    return response.data.data;
  },
};

export default paymentService;
