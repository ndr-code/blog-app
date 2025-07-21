import { useState, useRef, useEffect } from 'react';
import type { User } from '@/interfaces/post.interface';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './Buttons';
import { ConfirmDialog } from './ConfirmDialog';
import { AvatarIcon } from './Avatar';
import * as Dialog from '@radix-ui/react-dialog';
import { BiSolidCamera } from 'react-icons/bi';

interface EditProfileFormProps {
  open: boolean;
  onClose: () => void;
  onProfileUpdated?: (user: User) => void;
}

export const EditProfileForm = ({
  open,
  onClose,
  onProfileUpdated,
}: EditProfileFormProps) => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState(user?.headline || '');

  useEffect(() => {
    setName(user?.name || '');
    setHeadline(user?.headline || '');
  }, [user]);

  useEffect(() => {
    if (open) {
      setName(user?.name || '');
      setHeadline(user?.headline || '');
    }
  }, [open, user]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const handleConfirmUpdate = async () => {
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const formData = new FormData();
      formData.append('name', name);
      formData.append('headline', headline);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) {
          const errorMsg = data.message || 'Failed to update profile';
          setError(errorMsg);
          console.error('Profile update error:', data);
          setLoading(false);
          return;
        }

        const userRes = await fetch('/api/users/profile', {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (userRes.ok) {
          const newUser = await userRes.json();
          if (setUser) setUser(newUser);
          if (onProfileUpdated) onProfileUpdated(newUser);
        }
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1200);
      } else {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        throw new Error(
          'Unexpected server response. Please check the API endpoint and method.'
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to update profile');
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-fadeIn' />
        <Dialog.Content className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          <div
            className='bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto p-6 relative flex flex-col max-h-[90vh]'
            role='dialog'
            aria-modal='true'
            aria-labelledby='edit-profile-title'
            aria-describedby='edit-profile-desc'
          >
            <Dialog.Close asChild>
              <Button
                type='button'
                variant='ghost'
                className='absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700 cursor-pointer'
                aria-label='Close edit profile modal'
              >
                &times;
              </Button>
            </Dialog.Close>
            <Dialog.Title
              className='text-lg font-bold mb-4'
              id='edit-profile-title'
            >
              Edit Profile
            </Dialog.Title>
            <div className='flex flex-col items-center mb-6'>
              <div className='relative'>
                <AvatarIcon
                  user={user}
                  size={80}
                  className='w-20 h-20 mb-2'
                  {...(avatarPreview ? { src: avatarPreview } : {})}
                />
                <Button
                  type='button'
                  className='absolute bottom-6 right-0 bg-primary-300 text-white rounded-full p-2 shadow hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200'
                  aria-label='Upload avatar'
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  <BiSolidCamera className='w-3 h-3' />
                </Button>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleAvatarChange}
                  aria-label='Choose avatar image'
                  disabled={loading}
                />
              </div>
            </div>
            <form onSubmit={handleSubmit} aria-label='Edit profile form'>
              <ConfirmDialog
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title='Confirm Update Profile'
                message='Are you sure you want to update your profile?'
                actionText='Update'
                onAction={handleConfirmUpdate}
              />
              <label
                htmlFor='profile-name'
                className='block text-sm font-semibold mb-2'
                id='edit-profile-desc'
              >
                Name
              </label>
              <input
                id='profile-name'
                type='text'
                className='w-full p-3 border border-gray-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 transition shadow-sm mb-4'
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                aria-label='Profile name'
                aria-required='true'
                placeholder={user?.name || 'Enter your name'}
              />
              <label
                htmlFor='profile-headline'
                className='block text-sm font-semibold mb-2'
              >
                Profile Headline
              </label>
              <input
                id='profile-headline'
                type='text'
                className='w-full p-3 border border-gray-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 transition shadow-sm mb-6'
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                disabled={loading}
                aria-label='Profile headline'
                placeholder={user?.headline || 'Enter your headline'}
              />
              {error && (
                <div
                  className='mb-2 text-red-500 text-sm font-medium'
                  role='alert'
                  aria-live='assertive'
                >
                  {error}
                </div>
              )}
              {success && (
                <div
                  className='mb-2 text-green-600 text-sm font-medium'
                  role='status'
                  aria-live='polite'
                >
                  Profile updated successfully.
                </div>
              )}
              <Button
                type='submit'
                className='w-full bg-primary-300 hover:bg-primary-300/90 text-white font-bold cursor-pointer py-3 rounded-full text-base mt-2 transition-all disabled:opacity-60'
                disabled={loading}
                aria-label='Update Profile'
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
