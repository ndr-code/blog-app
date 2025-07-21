'use client';
import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  leftIcon,
  error,
  className = '',
  id,
  ...props
}) => {
  const reactId = useId();
  const inputId = id || `input-${reactId}`;
  const errorId = `${inputId}-error`;
  return (
    <div className='relative w-full'>
      {leftIcon && (
        <span className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
          {leftIcon}
        </span>
      )}
      <input
        {...props}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`w-full py-2 pl-${
          leftIcon ? '10' : '3'
        } pr-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300/50 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
      />
      {error && (
        <p
          id={errorId}
          className='text-red-500 text-xs italic mt-2'
          role='alert'
          aria-live='polite'
        >
          {error}
        </p>
      )}
    </div>
  );
};
