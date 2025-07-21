import * as React from 'react';
import { Button } from './Buttons';
import * as LabelPrimitive from '@radix-ui/react-label';
import { ConfirmDialog } from './ConfirmDialog';
import { unstable_PasswordToggleField as PasswordToggleField } from 'radix-ui';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';

type PasswordFieldProps = {
  label: string;
  id: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  autoComplete?: 'current-password' | 'new-password';
};

const PasswordField = ({
  label,
  id,
  name,
  placeholder,
  value,
  onChange,
  disabled,
  autoComplete,
}: PasswordFieldProps) => (
  <fieldset className='mb-6 w-full flex flex-col justify-start'>
    <LabelPrimitive.Root
      className='text-sm font-semibold mb-2 text-gray-800 block select-none'
      htmlFor={id}
    >
      {label}
    </LabelPrimitive.Root>
    <PasswordToggleField.Root>
      <div className='relative'>
        <PasswordToggleField.Input
          className='shadow w-full text-gray-700 leading-tight focus:shadow-outline h-9 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300/50 text-sm'
          id={id}
          placeholder={placeholder}
          aria-label={label}
          name={name}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        <PasswordToggleField.Toggle className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer bg-transparent border-none'>
          <PasswordToggleField.Icon
            visible={<EyeOpenIcon className='h-5 w-5 text-gray-400' />}
            hidden={<EyeClosedIcon className='h-5 w-5 text-gray-400' />}
          />
        </PasswordToggleField.Toggle>
      </div>
    </PasswordToggleField.Root>
  </fieldset>
);

const UpdatePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirmUpdate = async () => {
    setIsConfirmOpen(false);
    setLoading(true);
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/users/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });
      let data = null;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      }
      if (!res.ok || !data || !data.success) {
        throw new Error((data && data.message) || 'Failed to update password');
      }
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to update password');
      } else {
        setError('Failed to update password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        className='max-w-lg w-full'
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        aria-labelledby='update-password-title'
        aria-describedby='update-password-desc'
        role='form'
      >
        {error && (
          <div
            className='mb-4 text-red-500 text-sm font-medium'
            role='alert'
            aria-live='assertive'
            aria-atomic='true'
          >
            {error}
          </div>
        )}
        {success && (
          <div
            className='mb-4 text-green-600 text-sm font-medium'
            role='status'
            aria-live='polite'
            aria-atomic='true'
          >
            Password updated successfully.
          </div>
        )}
        <PasswordField
          label='Current Password'
          id='currentPassword'
          name='currentPassword'
          placeholder='Enter current password'
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={loading}
          autoComplete='current-password'
        />
        <PasswordField
          label='New Password'
          id='newPassword'
          name='newPassword'
          placeholder='Enter new password'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={loading}
          autoComplete='new-password'
        />
        <PasswordField
          label='Confirm New Password'
          id='confirmPassword'
          name='confirmPassword'
          placeholder='Enter confirm new password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
          autoComplete='new-password'
        />
        <Button
          type='submit'
          variant='primary'
          className='w-full rounded-full py-3 text-sm font-semibold flex items-center justify-center mt-2'
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </form>
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title='Update Password'
        message='Are you sure you want to change your password?'
        actionText='Update Password'
        onAction={handleConfirmUpdate}
        aria-labelledby='confirm-update-password-title'
        aria-describedby='confirm-update-password-desc'
      />
    </>
  );
};

export default UpdatePasswordForm;
