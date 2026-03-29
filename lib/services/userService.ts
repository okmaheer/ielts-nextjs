import api from '../api';

// Types
export interface User {
  id: bigint | string;
  name: string;
  email: string;
  phone: string;
  country: string;
  duration?: string;
  status: number | string;
  isUserPaid?: boolean;
  authProvider?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface PaginatedUsers {
  data: User[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
  next_page: number | null;
  prev_page: number | null;
}

export interface UserFilters {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  duration: string;
  status: string; // Changed from number to string
}

export interface UpdateUserData {
  user_id: string | number;
  name: string;
  email: string;
  phone: string;
  password?: string; // Optional - only update if provided
  country: string;
  duration: string;
  status: string; // Changed from number to string
}

// API Service Functions
export const userService = {
  // Get all users with pagination and filters
  async getUsers(filters?: UserFilters): Promise<PaginatedUsers> {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.per_page)
      params.append('per_page', filters.per_page.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.sort_order) params.append('sort_order', filters.sort_order);

    const response = await api.get(`/user/index?${params.toString()}`);
    return response.data.data;
  },

  // Get countries for form
  async getCountries(): Promise<string[]> {
    const response = await api.get('/user/create');
    return response.data.data.countries;
  },

  // Create new user
  async createUser(data: CreateUserData): Promise<User> {
    const response = await api.post('/user/store', data);
    return response.data.data;
  },

  // Get single user for editing
  async getUserById(
    id: string | number
  ): Promise<{ user: User; countries: string[] }> {
    const response = await api.get(`/user/edit/${id}`);
    return response.data.data;
  },

  // Update user
  async updateUser(data: UpdateUserData): Promise<User> {
    const response = await api.post('/user/update', data);
    return response.data.data;
  },

  // Delete user
  async deleteUser(id: string | number): Promise<void> {
    await api.get(`/user/delete/${id}`);
  },
};
