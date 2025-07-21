import React, { useState } from 'react';
import Link from 'next/link';
import { AxiosError } from 'axios';
import * as Label from '@radix-ui/react-label';
import { unstable_PasswordToggleField as PasswordToggleField } from 'radix-ui';
import { EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons';
import { useAuthContext } from '@/context/AuthContext';
import { Input } from './Input';
import { Button } from './Buttons';
import { SuccessDialog } from './SuccessDialog';

function decodeJWT(token: string): { id: number; email: string } | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { id: payload.id, email: payload.email };
  } catch {
    return null;
  }
}

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', api: '' });
  const [loading, setLoading] = useState(false);
  const [showSuccesDialog, setShowSuccesDialog] = useState(false);
  const { login } = useAuthContext();

  const validate = () => {
    const newErrors = { email: '', password: '', api: '' };
    if (!email) {
      newErrors.email = 'Enter your email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!password) {
      newErrors.password = 'Enter your password';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: '', password: '', api: '' });
    const newErrors = validate();
    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'login', email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      const token = data.token;
      const decoded = decodeJWT(token);
      if (decoded) {
        const userRes = await fetch(`/api/users/${decoded.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        login(token, userData);
      }
      setShowSuccesDialog(true);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setErrors((prev) => ({
          ...prev,
          api: err.response?.data?.message || 'Login failed',
        }));
      } else {
        setErrors((prev) => ({ ...prev, api: 'An unexpected error occurred' }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuccesDialogClose = () => {
    setShowSuccesDialog(false);
  };

  const handleContinue = () => {
    window.location.href = '/';
  };

  return (
    <div className='bg-white p-8 rounded-lg shadow-md w-full min-w-sm'>
      <h2 className='text-2xl font-bold mb-6 text-left'>Sign In</h2>
      <form onSubmit={handleSubmit} noValidate aria-label='Login form'>
        <div className='mb-4'>
          <Label.Root
            htmlFor='email'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            Email
          </Label.Root>
          <Input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder='Enter your email'
            disabled={loading}
            className='shadow w-full text-gray-700 leading-tight focus:shadow-outline text-sm p-3'
            aria-describedby={errors.email ? 'email-error' : undefined}
            aria-invalid={!!errors.email}
            aria-required='true'
          />
        </div>
        <div className='mb-6'>
          <Label.Root
            htmlFor='password'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            Password
          </Label.Root>
          <PasswordToggleField.Root>
            <div className='relative'>
              <PasswordToggleField.Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id='password'
                name='password'
                placeholder='Enter your password'
                disabled={loading}
                className='shadow w-full text-gray-700 leading-tight focus:shadow-outline h-9 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300/50 text-sm'
                aria-describedby={
                  errors.password ? 'password-error' : undefined
                }
                aria-invalid={!!errors.password}
                aria-required='true'
              />
              <PasswordToggleField.Toggle className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer bg-transparent border-none'>
                <PasswordToggleField.Icon
                  visible={<EyeOpenIcon className='h-5 w-5 text-gray-400' />}
                  hidden={<EyeClosedIcon className='h-5 w-5 text-gray-400' />}
                />
              </PasswordToggleField.Toggle>
            </div>
          </PasswordToggleField.Root>
          {errors.password && (
            <p
              id='password-error'
              className='text-red-500 text-xs italic mt-2'
              role='alert'
              aria-live='polite'
            >
              {errors.password}
            </p>
          )}
        </div>
        {errors.api && (
          <p
            className='text-red-500 text-xs italic mb-4'
            role='alert'
            aria-live='polite'
          >
            {errors.api}
          </p>
        )}
        <div className='flex items-center justify-between'>
          <Button
            type='submit'
            className='w-full px-4 py-2 bg-primary-300 text-white hover:bg-primary-400 transition-colors font-medium cursor-pointer'
            disabled={loading}
            aria-label='Login'
            aria-busy={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </div>
        <div className='text-center mt-4'>
          <p className='text-sm'>
            Don&apos;t have an account?{' '}
            <Link
              href='/register'
              className='font-semibold hover:underline text-primary-300/90 hover:text-primary-300 cursor-pointer'
              aria-label='Register new account'
            >
              Register
            </Link>
          </p>
        </div>
      </form>

      <SuccessDialog
        isOpen={showSuccesDialog}
        onClose={handleSuccesDialogClose}
        title='Login Successful!'
        message='Welcome back! You have been successfully logged in.'
        footer={
          <Button onClick={handleContinue} className='w-full mt-4'>
            Continue
          </Button>
        }
      />
    </div>
  );
};
