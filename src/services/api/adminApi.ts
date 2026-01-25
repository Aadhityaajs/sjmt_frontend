import { API_BASE_URL, getAuthHeaders } from './config';
import type {
  ApiResponse,
  StaffResponse,
  CreateStaffRequest,
  UpdateStaffRequest,
  UpdateRolePrivilegesRequest,
  StaffStatus
} from './types';

/**
 * Get all users (Admin only)
 */
export const getAllStaffs = async (): Promise<ApiResponse<StaffResponse[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data: ApiResponse<StaffResponse[]> = await response.json();

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
 * Get user by ID (Admin only)
 */
export const getStaffById = async (userId: number): Promise<ApiResponse<StaffResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data: ApiResponse<StaffResponse> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user');
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
export const createStaff = async (userData: CreateStaffRequest): Promise<ApiResponse<StaffResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    const data: ApiResponse<StaffResponse> = await response.json();

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
 * Update staff details (Admin only)
 */
export const updateStaff = async (
  userId: number,
  updates: UpdateStaffRequest
): Promise<ApiResponse<StaffResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    const data: ApiResponse<StaffResponse> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update staff');
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
export const updateStaffRolePrivileges = async (
  userId: number,
  updates: UpdateRolePrivilegesRequest
): Promise<ApiResponse<StaffResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role-privileges`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    const data: ApiResponse<StaffResponse> = await response.json();

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
export const updateStaffStatus = async (
  userId: number,
  status: StaffStatus
): Promise<ApiResponse<StaffResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    const data: ApiResponse<StaffResponse> = await response.json();

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
export const deleteStaff = async (userId: number): Promise<ApiResponse<void>> => {
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
 * Reset user password (Admin only)
 */
export const resetStaffPassword = async (userId: number): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/reset-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    const data: ApiResponse<void> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to reset password');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};
