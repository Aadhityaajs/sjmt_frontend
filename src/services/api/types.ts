// Common API types
export type StaffRole = 'ADMIN' | 'STAFF';
export type StaffStatus = 'ACTIVE' | 'BLOCKED';
export type StaffPrivilege = 'READ' | 'CREATE' | 'UPDATE';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  username: string;
  email: string;
  fullName: string;
  role: StaffRole;
  privileges: StaffPrivilege;
  expiresIn: number;
}

export interface StaffResponse {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  emailVerified: boolean;
  role: StaffRole;
  status: StaffStatus;
  privileges: StaffPrivilege;
  createdAt: string;
  lastLogin?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CreateStaffRequest {
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: StaffRole;
  privileges: StaffPrivilege;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
}

export interface UpdateStaffRequest {
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  role?: StaffRole;
  privileges?: StaffPrivilege;
}

export interface UpdateRolePrivilegesRequest {
  role?: StaffRole;
  privileges?: StaffPrivilege;
}

export interface UpdateStatusRequest {
  status: StaffStatus;
}

// Customer types
export type CustomerStatus = 'WHITELISTED' | 'BLACKLISTED';

export interface CustomerResponse {
  customerId: number;
  customerName: string;
  customerEmail: string;
  phoneNumber?: string;
  gstNumber?: string;
  address: string;
  city: string;
  state: string;
  pincode: number;
  createdAt: string;
  status: CustomerStatus;
}

export interface CustomerRequest {
  customerName: string;
  customerEmail: string;
  phoneNumber?: string;
  gstNumber?: string;
  address: string;
  city: string;
  state: string;
  pincode: number;
}
