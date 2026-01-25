import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { router } from '../router';
import { login, logout as apiLogout, refreshToken as apiRefreshToken } from '../services/api';
import type { StaffRole, StaffPrivilege } from '../services/api';
import toast from 'react-hot-toast';

interface AuthUser {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  role: StaffRole;
  privileges: StaffPrivilege;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: StaffRole) => boolean;
  hasPrivilege: (privilege: StaffPrivilege) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('accessToken');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Auto token refresh
  useEffect(() => {
    if (!user) return;

    const refreshTokenValue = sessionStorage.getItem('refreshToken');
    if (!refreshTokenValue) return;

    const interval = setInterval(async () => {
      try {
        const response = await apiRefreshToken(refreshTokenValue);
        if (response.success && response.data) {
          sessionStorage.setItem('accessToken', response.data.accessToken);
          sessionStorage.setItem('refreshToken', response.data.refreshToken);
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        // Clear session and redirect to login
        sessionStorage.clear();
        setUser(null);
        router.navigate({ to: '/login' });
      }
    }, 14 * 60 * 1000); // Refresh every 14 minutes

    return () => clearInterval(interval);
  }, [user]);

  const loginUser = async (username: string, password: string) => {
    try {
      const response = await login(username, password);

      if (response.success && response.data) {
        const { accessToken, refreshToken, ...userData } = response.data;

        // Store tokens
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('refreshToken', refreshToken);

        // Store user data
        const authUser: AuthUser = {
          userId: userData.userId,
          username: userData.username,
          email: userData.email,
          fullName: userData.fullName,
          role: userData.role,
          privileges: userData.privileges,
        };

        sessionStorage.setItem('user', JSON.stringify(authUser));
        setUser(authUser);

        toast.success('Login successful!');
        router.navigate({ to: '/dashboard' });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      sessionStorage.clear();
      setUser(null);
      toast.success('Logged out successfully');
      router.navigate({ to: '/login' });
    }
  };

  const hasRole = (role: StaffRole): boolean => {
    return user?.role === role;
  };

  const hasPrivilege = (privilege: StaffPrivilege): boolean => {
    if (!user) return false;

    // Admin role has all privileges
    if (user.role === 'ADMIN') return true;

    // Check specific privilege hierarchy: UPDATE > CREATE > READ
    const privilegeHierarchy: Record<StaffPrivilege, number> = {
      'READ': 1,
      'CREATE': 2,
      'UPDATE': 3,
    };

    return privilegeHierarchy[user.privileges] >= privilegeHierarchy[privilege];
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login: loginUser, logout: logoutUser, hasRole, hasPrivilege }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
