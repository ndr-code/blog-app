import { useState } from 'react';

interface ValidationErrors {
  [key: string]: string;
}

interface ValidationRules {
  [key: string]: (value: string) => string;
}

export const useFormValidation = (initialErrors: ValidationErrors) => {
  const [errors, setErrors] = useState<ValidationErrors>(initialErrors);

  const validateField = (value: string, rules: ValidationRules): string => {
    for (const rule of Object.values(rules)) {
      const error = rule(value);
      if (error) return error;
    }
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email) return 'Enter your email';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Email address is invalid';
    return '';
  };

  const validatePassword = (
    password: string,
    minLength: number = 6
  ): string => {
    if (!password) return 'Enter your password';
    if (password.length < minLength)
      return `Password must be at least ${minLength} characters`;
    return '';
  };

  const validateRequired = (value: string, fieldName: string): string => {
    if (!value) return `Enter your ${fieldName}`;
    return '';
  };

  const validatePasswordMatch = (
    password: string,
    confirmPassword: string
  ): string => {
    if (!confirmPassword) return 'Enter your confirm password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  };

  const setFieldError = (field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const clearErrors = () => {
    setErrors(initialErrors);
  };

  const hasErrors = (): boolean => {
    return Object.values(errors).some((error) => error !== '');
  };

  return {
    errors,
    setErrors,
    validateField,
    validateEmail,
    validatePassword,
    validateRequired,
    validatePasswordMatch,
    setFieldError,
    clearErrors,
    hasErrors,
  };
};
