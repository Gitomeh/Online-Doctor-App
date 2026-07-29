/**
 * Form validation utilities
 * Common validation functions to avoid duplication
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns True if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param password - Password string to validate
 * @returns True if password meets requirements
 */
export function isValidPassword(password: string): boolean {
  if (password.length < 8) return false;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  return hasUppercase && hasLowercase && hasNumber;
}

/**
 * Validate required field
 * @param value - Value to check
 * @returns True if value is not empty
 */
export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validate minimum length
 * @param value - Value to check
 * @param minLength - Minimum required length
 * @returns True if value meets minimum length
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return value.trim().length >= minLength;
}

/**
 * Validate maximum length
 * @param value - Value to check
 * @param maxLength - Maximum allowed length
 * @returns True if value is within maximum length
 */
export function hasMaxLength(value: string, maxLength: number): boolean {
  return value.trim().length <= maxLength;
}

/**
 * Validate past date
 * @param dateString - ISO date string
 * @returns True if date is not in the past
 */
export function isNotPastDate(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

/**
 * Common validation error messages
 */
export const VALIDATION_ERRORS = {
  REQUIRED: (field: string) => `${field} is required`,
  EMAIL_INVALID: "Please enter a valid email address",
  EMAIL_EXISTS: "An account with this email already exists",
  PASSWORD_WEAK: "Password must be at least 8 characters with uppercase, lowercase, and number",
  PASSWORD_MISMATCH: "Passwords do not match",
  MIN_LENGTH: (field: string, min: number) => `${field} must be at least ${min} characters`,
  PAST_DATE: "Date cannot be in the past",
  DUPLICATE_APPOINTMENT: "You already have an appointment with this doctor on this date"
} as const;