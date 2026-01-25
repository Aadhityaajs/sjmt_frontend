import { API_BASE_URL, getAuthHeaders } from './config';
import type { ApiResponse, CustomerResponse, CustomerRequest } from './types';

/**
 * Get all customers
 */
export const getAllCustomers = async (): Promise<ApiResponse<CustomerResponse[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data: ApiResponse<CustomerResponse[]> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch customers');
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
 * Get customer by ID
 */
export const getCustomerById = async (customerId: number): Promise<ApiResponse<CustomerResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data: ApiResponse<CustomerResponse> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch customer');
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
 * Create new customer
 */
export const createCustomer = async (customerData: CustomerRequest): Promise<ApiResponse<CustomerResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(customerData),
    });

    const data: ApiResponse<CustomerResponse> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create customer');
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
 * Update customer
 */
export const updateCustomer = async (
  customerId: number,
  customerData: CustomerRequest
): Promise<ApiResponse<CustomerResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(customerData),
    });

    const data: ApiResponse<CustomerResponse> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update customer');
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
 * Toggle customer status (WHITELISTED <-> BLACKLISTED)
 */
export const toggleCustomerStatus = async (customerId: number): Promise<ApiResponse<CustomerResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}/toggle-status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    const data: ApiResponse<CustomerResponse> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to toggle customer status');
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
 * Delete (blacklist) customer
 */
export const deleteCustomer = async (customerId: number): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data: ApiResponse<void> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete customer');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};
