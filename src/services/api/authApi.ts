import { API_BASE_URL, getAuthHeaders } from './config';
import type { ApiResponse, AuthResponse } from './types';

/**
 * Login user with username and password
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
 * Change password for authenticated user
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data: ApiResponse<void> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Password change failed');
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
 * Request password reset link
 */
export const forgotPassword = async (email: string): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data: ApiResponse<void> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send reset email');
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
 * Reset password using token
 */
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<ApiResponse<void>> => {
  console.log("reset password api")
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });

    const data: ApiResponse<void> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Password reset failed');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};
