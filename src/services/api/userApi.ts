import { API_BASE_URL, getAuthHeaders } from './config';
import type { ApiResponse, StaffResponse, UpdateProfileRequest } from './types';

/**
 * Get current user profile
 */
export const getStaffProfile = async (): Promise<ApiResponse<StaffResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data: ApiResponse<StaffResponse> = await response.json();

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

/**
 * Update current user profile
 */
export const updateStaffProfile = async (
  updates: UpdateProfileRequest
): Promise<ApiResponse<StaffResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    const data: ApiResponse<StaffResponse> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};
