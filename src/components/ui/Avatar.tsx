import React, { useState } from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import { User } from '@/interfaces/post.interface';
import { getAvatarUrl } from '@/utils/avatar';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from './Buttons';

// AvatarIcon

export const AvatarRoot = React.forwardRef<
  React.ComponentRef<typeof Avatar.Root>,
  React.ComponentPropsWithoutRef<typeof Avatar.Root>
>(({ className = '', ...props }, ref) => (
  <Avatar.Root
    ref={ref}
    className={`w-8 h-8 rounded-full border border-neutral-200 overflow-hidden bg-neutral-100 ${className}`}
    {...props}
  />
));
AvatarRoot.displayName = 'AvatarRoot';

export const AvatarImage: React.FC<
  React.ComponentPropsWithoutRef<typeof Avatar.Image>
> = ({ className = '', alt, ...props }) => {
  const [errored, setErrored] = useState(false);
  if (errored) return null;
  return (
    <Avatar.Image
      className={`w-8 h-8 object-cover rounded-full ${className}`}
      onError={() => setErrored(true)}
      alt={alt}
      aria-label={alt}
      aria-hidden={alt ? 'false' : 'true'}
      {...props}
    />
  );
};

export const AvatarFallback = React.forwardRef<
  React.ComponentRef<typeof Avatar.Fallback>,
  React.ComponentPropsWithoutRef<typeof Avatar.Fallback>
>(({ className = '', children, ...props }, ref) => (
  <Avatar.Fallback
    ref={ref}
    className={`w-8 h-8 flex items-center justify-center bg-neutral-200 text-neutral-500 text-sm rounded-full ${className}`}
    aria-label={
      typeof children === 'string'
        ? `Avatar fallback: ${children}`
        : 'Avatar fallback'
    }
    role='img'
    {...props}
  >
    {children}
  </Avatar.Fallback>
));
AvatarFallback.displayName = 'AvatarFallback';

interface AvatarProps {
  user?: User | null;
  className?: string;
  size?: number;
}

export const AvatarIcon: React.FC<AvatarProps> = ({
  user,
  className = '',
  size = 32,
}) => {
  const avatarUrl = getAvatarUrl(user?.avatarUrl);
  const initial = user?.name ? user.name[0] : '?';
  const label = user?.name || user?.email || 'User';
  return (
    <AvatarRoot
      className={`border border-neutral-200 bg-neutral-100 ${className}`}
      style={{ width: size, height: size }}
      aria-label={label}
      role='img'
    >
      <AvatarImage
        src={avatarUrl}
        alt={label}
        style={{ width: size, height: size }}
      />
      <AvatarFallback style={{ width: size, height: size }}>
        {initial}
      </AvatarFallback>
    </AvatarRoot>
  );
};

// AvatarDialog

export const AvatarDialog = ({ user }: { user: User }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <span className='cursor-pointer' onClick={() => setOpen(true)}>
          <AvatarIcon user={user} size={80} className='w-20 h-20' />
        </span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-fadeIn' />
        <Dialog.Content className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center mx-auto'>
            <AvatarIcon user={user} size={640} />
            <Dialog.Close asChild>
              <Button variant='ghost' className='mt-4'>
                Close
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
