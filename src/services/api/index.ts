// Re-export all API functions and types
export * from './types';
export * from './config';
export * as authApi from './authApi';
export * as userApi from './userApi';
export * as adminApi from './adminApi';
export * as customerApi from './customerApi';

// For backward compatibility, also export individual functions
export { login, logout, refreshToken, changePassword, forgotPassword, resetPassword } from './authApi';
export { getStaffProfile, updateStaffProfile } from './userApi';
export {
  getAllStaffs,
  getStaffById,
  createStaff,
  updateStaff,
  updateStaffRolePrivileges,
  updateStaffStatus,
  deleteStaff,
  resetStaffPassword,
} from './adminApi';
export {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  toggleCustomerStatus,
  deleteCustomer,
} from './customerApi';
