import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { unstable_PasswordToggleField as PasswordToggleField } from 'radix-ui';
import { EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons';
import * as Label from '@radix-ui/react-label';
import { useAuthContext } from '@/context/AuthContext';
import { Input } from './Input';
import { Button } from './Buttons';
import { SuccessDialog } from './SuccessDialog';

export const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    api: '',
  });
  const [loading, setLoading] = useState(false);
  const [showSuccesDialog, setShowSuccesDialog] = useState(false);
  const router = useRouter();
  const { register } = useAuthContext();

  const validate = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      api: '',
    };
    if (!name) newErrors.name = 'Enter your name';
    if (!email) {
      newErrors.email = 'Enter your email';
    }
    if (!password) newErrors.password = 'Enter your password';
    if (password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Enter your confirm password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
    } else {
      setErrors({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        api: '',
      });
      setLoading(true);
      try {
        const result = await register(name, email, password);
        if (!result.success) {
          setErrors((prev) => ({
            ...prev,
            api: result.error || 'Registration failed',
          }));
        } else {
          setShowSuccesDialog(true);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSuccesDialogClose = () => {
    setShowSuccesDialog(false);
    router.push('/login');
  };

  return (
    <div className='bg-white p-8 rounded-lg shadow-md w-full min-w-sm'>
      <h2 className='text-2xl font-bold mb-6 text-left'>Sign Up</h2>
      <form onSubmit={handleSubmit} noValidate aria-label='Register form'>
        {/* Name */}
        <div className='mb-4'>
          <Label.Root
            htmlFor='name'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            Name
          </Label.Root>
          <Input
            type='text'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            placeholder='Enter your name'
            disabled={loading}
            className='shadow w-full text-gray-700 leading-tight focus:shadow-outline text-sm p-3'
            aria-describedby={errors.name ? 'name-error' : undefined}
            aria-invalid={!!errors.name}
            aria-required='true'
          />
          {errors.name && (
            <p
              id='name-error'
              className='text-red-500 text-xs italic mt-2'
              role='alert'
              aria-live='polite'
            >
              {errors.name}
            </p>
          )}
        </div>
        {/* Email */}
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
          {errors.email && (
            <p
              id='email-error'
              className='text-red-500 text-xs italic mt-2'
              role='alert'
              aria-live='polite'
            >
              {errors.email}
            </p>
          )}
        </div>
        {/* Password */}
        <div className='mb-4'>
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
                className='shadow w-full text-gray-700 leading-tight focus:shadow-outline h-9 text-sm px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300/50'
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
        {/* Confirm Password */}
        <div className='mb-6'>
          <Label.Root
            htmlFor='confirmPassword'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            Confirm Password
          </Label.Root>
          <PasswordToggleField.Root>
            <div className='relative'>
              <PasswordToggleField.Input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                id='confirmPassword'
                name='confirmPassword'
                placeholder='Enter your confirm password'
                disabled={loading}
                className='shadow w-full text-gray-700 leading-tight focus:shadow-outline h-9 text-sm px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300/50'
                aria-describedby={
                  errors.confirmPassword ? 'confirmPassword-error' : undefined
                }
                aria-invalid={!!errors.confirmPassword}
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
          {errors.confirmPassword && (
            <p
              id='confirmPassword-error'
              className='text-red-500 text-xs italic mt-2'
              role='alert'
              aria-live='polite'
            >
              {errors.confirmPassword}
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
        <Button
          type='submit'
          className='w-full'
          disabled={loading}
          aria-label='Register'
          aria-busy={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
        <div className='text-center mt-4'>
          <p className='text-sm'>
            Already have an account?{' '}
            <Link
              href='/login'
              className='font-bold text-primary-300/90 hover:text-primary-300 cursor-pointer hover:underline'
              aria-label='Login to your account'
            >
              Login
            </Link>
          </p>
        </div>
      </form>
      {showSuccesDialog && (
        <SuccessDialog
          isOpen={showSuccesDialog}
          onClose={handleSuccesDialogClose}
          title='Registration Successful!'
          message='Your account has been created successfully. Please login to continue.'
        />
      )}
    </div>
  );
};
