// services/authApi.ts

const API_BASE_URL = 'http://localhost:3000/api';

// Type definitions based on OpenAPI spec
export type UserRole = 'ADMIN' | 'STAFF';
export type UserStatus = 'ACTIVE' | 'BLOCKED';
export type UserPrivilege = 'READ' | 'CREATE' | 'UPDATE';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  privileges: UserPrivilege;
  expiresIn: number;
}

export interface UserResponse {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  emailVerified: boolean;
  role: UserRole;
  status: UserStatus;
  privileges: UserPrivilege;
  createdAt: string;
  lastLogin?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: UserRole;
  privileges: UserPrivilege;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
}

export interface UpdateRolePrivilegesRequest {
  role?: UserRole;
  privileges?: UserPrivilege;
}

export interface UpdateStatusRequest {
  status: UserStatus;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = sessionStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Login user with username/email and password
 */
export const login = async (
  usernameOrEmail: string,
  password: string
): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: usernameOrEmail,
        password,
      }),
    });

    const data: ApiResponse<AuthResponse> = await response.json();

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

/**
 * Logout user
 */
export const logout = async (): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    const data: ApiResponse<void> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Logout failed');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (refreshToken: string): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data: ApiResponse<AuthResponse> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Token refresh failed');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

/**
 * Get all users (Admin only)
 */
export const getAllUsers = async (): Promise<ApiResponse<UserResponse[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data: ApiResponse<UserResponse[]> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch users');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

/**
 * Create new user (Admin only)
 */
export const createUser = async (userData: CreateUserRequest): Promise<ApiResponse<UserResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    const data: ApiResponse<UserResponse> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create user');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

/**
 * Update user role and privileges (Admin only)
 */
export const updateUserRolePrivileges = async (
  userId: number,
  updates: UpdateRolePrivilegesRequest
): Promise<ApiResponse<UserResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role-privileges`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    const data: ApiResponse<UserResponse> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update user');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

/**
 * Update user status (Admin only)
 */
export const updateUserStatus = async (
  userId: number,
  status: UserStatus
): Promise<ApiResponse<UserResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    const data: ApiResponse<UserResponse> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update user status');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

/**
 * Delete user (Admin only)
 */
export const deleteUser = async (userId: number): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data: ApiResponse<void> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete user');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

/**
 * Get current user profile
 */
export const getUserProfile = async (): Promise<ApiResponse<UserResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data: ApiResponse<UserResponse> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};