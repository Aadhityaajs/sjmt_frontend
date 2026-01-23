// services/authApi.ts

const API_BASE_URL = 'http://localhost:3000/api';

// Type definitions
export interface LoginData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  username: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'USER' | 'MODERATOR';
  privileges: 'READ' | 'WRITE' | 'DELETE' | 'ADMIN';
  expiresIn: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

/**
 * Login user with username/email and password
 * @param {string} usernameOrEmail - User's username or email
 * @param {string} password - User's password
 * @returns {Promise<ApiResponse<LoginData>>} Login response data
 */
export const login = async (
  usernameOrEmail: string,
  password: string
): Promise<ApiResponse<LoginData>> => {
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

    const data: ApiResponse<LoginData> = await response.json();

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
 * @returns {Promise<ApiResponse<null>>} Logout response data
 */
export const logout = async (): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: ApiResponse<null> = await response.json();

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
 * Register new user
 * @param {RegisterData} userData - User registration data
 * @returns {Promise<ApiResponse<LoginData>>} Registration response data
 */
export const register = async (
  userData: RegisterData
): Promise<ApiResponse<LoginData>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data: ApiResponse<LoginData> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

// Default export (optional, if you prefer default import)
export default {
  login,
  logout,
  register,
};