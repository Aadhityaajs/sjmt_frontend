# API Structure Documentation

## 📁 New File Organization

```
src/services/api/
├── config.ts          # API configuration
├── types.ts           # TypeScript interfaces
├── authApi.ts         # Authentication
├── userApi.ts         # User operations
├── adminApi.ts        # Admin operations
└── index.ts           # Exports everything
```

---

## 1. config.ts

### API_BASE_URL
```typescript
export const API_BASE_URL = 'http://localhost:3000/api';
```

### getAuthHeaders()
```typescript
export const getAuthHeaders = () => {
  const token = sessionStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
```

---

## 2. types.ts

### Enums
```typescript
export type UserRole = 'ADMIN' | 'STAFF';
export type UserStatus = 'ACTIVE' | 'BLOCKED';
export type UserPrivilege = 'READ' | 'CREATE' | 'UPDATE';
```

### Interfaces
```typescript
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
```

---

## 3. authApi.ts

### Functions

#### login()
```typescript
login(username: string, password: string): Promise<ApiResponse<AuthResponse>>
```
- **Endpoint:** `POST /api/auth/login`
- **Body:** `{ username, password }`
- **Returns:** Access token, refresh token, user info

#### logout()
```typescript
logout(): Promise<ApiResponse<void>>
```
- **Endpoint:** `POST /api/auth/logout`
- **Headers:** Requires auth token
- **Returns:** Success message

#### refreshToken()
```typescript
refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>>
```
- **Endpoint:** `POST /api/auth/refresh-token`
- **Body:** `{ refreshToken }`
- **Returns:** New access & refresh tokens

---

## 4. userApi.ts

### Functions

#### getUserProfile()
```typescript
getUserProfile(): Promise<ApiResponse<UserResponse>>
```
- **Endpoint:** `GET /api/users/profile`
- **Headers:** Requires auth token
- **Returns:** Current user's profile

#### updateUserProfile()
```typescript
updateUserProfile(updates: UpdateProfileRequest): Promise<ApiResponse<UserResponse>>
```
- **Endpoint:** `PUT /api/users/profile`
- **Headers:** Requires auth token
- **Body:** `{ fullName?, phoneNumber? }`
- **Returns:** Updated user profile

---

## 5. adminApi.ts

### Functions

#### getAllUsers()
```typescript
getAllUsers(): Promise<ApiResponse<UserResponse[]>>
```
- **Endpoint:** `GET /api/admin/users`
- **Headers:** Requires admin auth token
- **Returns:** Array of all users

#### getUserById()
```typescript
getUserById(userId: number): Promise<ApiResponse<UserResponse>>
```
- **Endpoint:** `GET /api/admin/users/{userId}`
- **Headers:** Requires admin auth token
- **Returns:** Single user details

#### createUser()
```typescript
createUser(userData: CreateUserRequest): Promise<ApiResponse<UserResponse>>
```
- **Endpoint:** `POST /api/admin/users`
- **Headers:** Requires admin auth token
- **Body:** `{ username, email, fullName, phoneNumber?, role, privileges }`
- **Returns:** Created user details
- **Note:** Password is auto-generated and emailed

#### updateUserRolePrivileges()
```typescript
updateUserRolePrivileges(
  userId: number,
  updates: UpdateRolePrivilegesRequest
): Promise<ApiResponse<UserResponse>>
```
- **Endpoint:** `PUT /api/admin/users/{userId}/role-privileges`
- **Headers:** Requires admin auth token
- **Body:** `{ role?, privileges? }`
- **Returns:** Updated user details

#### updateUserStatus()
```typescript
updateUserStatus(
  userId: number,
  status: UserStatus
): Promise<ApiResponse<UserResponse>>
```
- **Endpoint:** `PUT /api/admin/users/{userId}/status`
- **Headers:** Requires admin auth token
- **Body:** `{ status: 'ACTIVE' | 'BLOCKED' }`
- **Returns:** Updated user details

#### deleteUser()
```typescript
deleteUser(userId: number): Promise<ApiResponse<void>>
```
- **Endpoint:** `DELETE /api/admin/users/{userId}`
- **Headers:** Requires admin auth token
- **Returns:** Success message

#### resetUserPassword()
```typescript
resetUserPassword(userId: number): Promise<ApiResponse<void>>
```
- **Endpoint:** `POST /api/admin/users/{userId}/reset-password`
- **Headers:** Requires admin auth token
- **Returns:** Success message
- **Note:** Sends password reset email to user

---

## 6. index.ts

### Exports

```typescript
// Export all types
export * from './types';

// Export config
export * from './config';

// Export namespaced APIs
export * as authApi from './authApi';
export * as userApi from './userApi';
export * as adminApi from './adminApi';

// Export individual functions (for convenience)
export { login, logout, refreshToken } from './authApi';
export { getUserProfile, updateUserProfile } from './userApi';
export {
  getAllUsers,
  getUserById,
  createUser,
  updateUserRolePrivileges,
  updateUserStatus,
  deleteUser,
  resetUserPassword,
} from './adminApi';
```

---

## Usage Examples

### Import Styles

#### Option 1: Import specific functions
```typescript
import { login, logout } from '../services/api';
import { getAllUsers, updateUserStatus } from '../services/api';
import type { UserResponse, UserStatus } from '../services/api';

const response = await login(username, password);
const users = await getAllUsers();
```

#### Option 2: Import namespaced
```typescript
import { authApi, adminApi } from '../services/api';
import type { UserResponse } from '../services/api';

const response = await authApi.login(username, password);
const users = await adminApi.getAllUsers();
```

#### Option 3: Import everything
```typescript
import * as api from '../services/api';

const response = await api.login(username, password);
const users = await api.getAllUsers();
```

### Common Patterns

#### Authentication Flow
```typescript
import { login } from '../services/api';

// Login
const response = await login(username, password);
if (response.success) {
  sessionStorage.setItem('accessToken', response.data.accessToken);
  sessionStorage.setItem('refreshToken', response.data.refreshToken);
}
```

#### Fetch Users (Admin)
```typescript
import { getAllUsers } from '../services/api';

const response = await getAllUsers();
if (response.success) {
  setUsers(response.data);
}
```

#### Block/Unblock User
```typescript
import { updateUserStatus } from '../services/api';

const newStatus = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
const response = await updateUserStatus(user.userId, newStatus);

if (response.success) {
  toast.success(`User ${newStatus.toLowerCase()}`);
}
```

#### Create User
```typescript
import { createUser } from '../services/api';
import type { CreateUserRequest } from '../services/api';

const userData: CreateUserRequest = {
  username: 'johndoe',
  email: 'john@example.com',
  fullName: 'John Doe',
  phoneNumber: '1234567890',
  role: 'STAFF',
  privileges: 'READ',
};

const response = await createUser(userData);
if (response.success) {
  toast.success('User created! Password sent via email.');
}
```

---

## Error Handling

All API functions throw errors that can be caught:

```typescript
try {
  const response = await getAllUsers();
  if (response.success) {
    // Handle success
  }
} catch (error) {
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('An unexpected error occurred');
  }
}
```

---

## Backend Requirements

### Headers
All authenticated endpoints require:
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

### Response Format
All endpoints return:
```json
{
  "success": true/false,
  "message": "Success/Error message",
  "data": { ... },
  "timestamp": "2025-01-23T12:00:00Z"
}
```

### Status Codes
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Migration from Old API

### Before
```typescript
import * as authApi from '../services/authApi';

await authApi.login(username, password);
await authApi.getAllUsers();
```

### After
```typescript
import { login, getAllUsers } from '../services/api';

await login(username, password);
await getAllUsers();
```

### Both Work!
The old `authApi.ts` file is kept for backward compatibility, but the new structure is recommended.

---

## Benefits of New Structure

1. **Separation of Concerns** - Each file has a single responsibility
2. **Better Organization** - Easy to find specific API functions
3. **Smaller Files** - Each file under 200 lines
4. **Type Safety** - All types in one place
5. **Easier Testing** - Can mock individual modules
6. **Better Imports** - Import only what you need
7. **Maintainability** - Changes isolated to specific files

---

## File Sizes

| File | Lines | Purpose |
|------|-------|---------|
| types.ts | 67 | TypeScript interfaces |
| config.ts | 11 | API configuration |
| authApi.ts | 82 | Authentication |
| userApi.ts | 56 | User operations |
| adminApi.ts | 188 | Admin operations |
| index.ts | 18 | Re-exports |
| **Total** | **422** | All API code |

Compare to old structure:
- `authApi.ts` (old): 323 lines (everything mixed)
- New structure: 422 lines (but organized and maintainable)

---

## Summary

The new API structure provides:
- ✅ Clear separation by functionality
- ✅ Easy to navigate and maintain
- ✅ Type-safe with TypeScript
- ✅ Consistent error handling
- ✅ Backward compatible
- ✅ Production-ready

All functions are documented and ready to use! 🚀
