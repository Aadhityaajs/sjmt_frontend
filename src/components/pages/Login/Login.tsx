import { useState, type FormEvent } from 'react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { validateUsernameOrEmail, validatePassword } from '../../../utils';
import { login, type ApiResponse, type LoginData } from '../../../services/authApi';

interface FormErrors {
  usernameOrEmail?: string;
  password?: string;
}

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);


const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Validate all fields
  const usernameOrEmailError = validateUsernameOrEmail(usernameOrEmail);
  const passwordError = validatePassword(password);

  if (usernameOrEmailError || passwordError) {
    setErrors({
      usernameOrEmail: usernameOrEmailError,
      password: passwordError,
    });
    return;
  }

  // Clear errors
  setErrors({});
  setIsSubmitting(true);

  try {
    const response: ApiResponse<LoginData> = await login(usernameOrEmail, password);
    
    if (response.success) {
      console.log('Login successful:', response.data);
      
      // Store tokens
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      // Store user data
      const userData = {
        userId: response.data.userId,
        username: response.data.username,
        email: response.data.email,
        fullName: response.data.fullName,
        role: response.data.role,
        privileges: response.data.privileges,
      };
      localStorage.setItem('user', JSON.stringify(userData));

      // Show success message
      alert(`${response.message || 'Login successful!'}`);
      
      // Redirect to dashboard or home page
      // Example: navigate('/dashboard');
    } else {
      setErrors({ 
        usernameOrEmail: response.message || 'Login failed' 
      });
    }
    
  } catch (error) {
    console.error('Login failed:', error);
    setErrors({ 
      usernameOrEmail: error instanceof Error ? error.message : 'Invalid username/email or password' 
    });
  } finally {
    setIsSubmitting(false);
  }
};

  const handleUsernameOrEmailBlur = () => {
    const error = validateUsernameOrEmail(usernameOrEmail);
    setErrors(prev => ({ ...prev, usernameOrEmail: error }));
  };

  const handlePasswordBlur = () => {
    const error = validatePassword(password);
    setErrors(prev => ({ ...prev, password: error }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Please sign in to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username or Email Field */}
            <div>
              <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="usernameOrEmail"
                  type="text"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  onBlur={handleUsernameOrEmailBlur}
                  className={`block w-full pl-10 pr-3 py-2.5 border ${errors.usernameOrEmail ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                    } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors`}
                  placeholder="username or you@example.com"
                  disabled={isSubmitting}
                />
              </div>
              {errors.usernameOrEmail && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.usernameOrEmail}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handlePasswordBlur}
                  className={`block w-full pl-10 pr-10 py-2.5 border ${errors.password ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                    } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors`}
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isSubmitting
                  ? 'bg-indigo-400 dark:bg-indigo-500 cursor-not-allowed'
                  : 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-indigo-500 dark:focus:ring-indigo-400'
                } transition-colors`}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <a href="#" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
