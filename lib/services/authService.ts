// lib/services/authService.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  authProvider: string;
  profilePicture?: string;
  roles: string[];
  isAdmin: boolean;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
  message: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  timestamp?: string;
}

/**
 * Admin login with email and password
 */
export const adminLogin = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};
