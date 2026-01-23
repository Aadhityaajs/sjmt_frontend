/**
 * Validation utility functions
 */

/**
 * Validates an email address
 * @param email - The email string to validate
 * @returns Error message if invalid, undefined if valid
 */
export const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return undefined;
};

/**
 * Validates a password with strong security requirements
 * @param password - The password string to validate
 * @returns Error message if invalid, undefined if valid
 */
export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number';
  }
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return 'Password must contain at least one special character (@$!%*?&)';
  }
  return undefined;
};

/**
 * Validates a required field
 * @param value - The value to validate
 * @param fieldName - The name of the field for error message
 * @returns Error message if invalid, undefined if valid
 */
export const validateRequired = (value: string, fieldName: string): string | undefined => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return undefined;
};

/**
 * Validates minimum length
 * @param value - The value to validate
 * @param minLength - Minimum required length
 * @param fieldName - The name of the field for error message
 * @returns Error message if invalid, undefined if valid
 */
export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string
): string | undefined => {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  return undefined;
};

/**
 * Validates maximum length
 * @param value - The value to validate
 * @param maxLength - Maximum allowed length
 * @param fieldName - The name of the field for error message
 * @returns Error message if invalid, undefined if valid
 */
export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string
): string | undefined => {
  if (value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return undefined;
};

/**
 * Validates a phone number (basic format)
 * @param phone - The phone number to validate
 * @returns Error message if invalid, undefined if valid
 */
export const validatePhone = (phone: string): string | undefined => {
  if (!phone) {
    return 'Phone number is required';
  }
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
    return 'Please enter a valid phone number';
  }
  return undefined;
};

/**
 * Validates that two values match (e.g., password confirmation)
 * @param value1 - First value
 * @param value2 - Second value
 * @param fieldName - The name of the field for error message
 * @returns Error message if they don't match, undefined if they match
 */
export const validateMatch = (
  value1: string,
  value2: string,
  fieldName: string
): string | undefined => {
  if (value1 !== value2) {
    return `${fieldName} do not match`;
  }
  return undefined;
};

/**
 * Validates a username
 * @param username - The username string to validate
 * @returns Error message if invalid, undefined if valid
 */
export const validateUsername = (username: string): string | undefined => {
  if (!username) {
    return 'Username is required';
  }
  if (username.length < 3) {
    return 'Username must be at least 3 characters long';
  }
  if (username.length > 20) {
    return 'Username must not exceed 20 characters';
  }
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return 'Username can only contain letters, numbers, underscores, and hyphens';
  }
  return undefined;
};

/**
 * Validates username or email (accepts either format)
 * @param value - The username or email string to validate
 * @returns Error message if invalid, undefined if valid
 */
export const validateUsernameOrEmail = (value: string): string | undefined => {
  if (!value) {
    return 'Username or email is required';
  }

  // Check if it looks like an email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmail = emailRegex.test(value);

  if (isEmail) {
    // Validate as email
    return validateEmail(value);
  } else {
    // Validate as username
    return validateUsername(value);
  }
};
