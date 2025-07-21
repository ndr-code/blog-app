'use client';
import * as React from 'react';
import * as Primitive from '@radix-ui/react-slot';
import { Slot } from '@radix-ui/react-slot';
import { BiLike, BiSolidLike } from 'react-icons/bi';
import { FaRegMessage } from 'react-icons/fa6';
import clsx from 'clsx';
import { cn } from '@/utils/cn';
import { useLike } from '@/hooks/useLike';
import { Toast } from './Toast';
import { useAuth } from '@/hooks/useAuth';
import { Post } from '@/interfaces/post.interface';
import { LikeTooltip } from './Tooltips';
import { CommentTooltip } from './Tooltips';

// Default Button component
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'phantom';
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-primary-300 text-white hover:bg-primary-400 flex items-center justify-center  ',
  secondary:
    'bg-white text-primary-300 border border-primary-300 hover:bg-primary-50 flex items-center justify-center',
  danger:
    'bg-red-500 text-white hover:bg-red-600 flex items-center justify-center',
  ghost:
    'bg-transparent text-primary-300 hover:underline hover:text-primary-400 flex items-center justify-center',
  phantom:
    'bg-transparent text-neutral-500 hover:text-primary-300 flex items-center justify-center px-2',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, variant = 'primary', className = '', ...props }, ref) => {
    const Comp = asChild ? Primitive.Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={`px-2 py-2 rounded-full font-semibold transition-colors duration-200 focus:outline-none  disabled:opacity-90 disabled:cursor-not-allowed cursor-pointer ${
          variantClasses[variant] || ''
        } ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

// IconButton component

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, asChild = false, size = 'md', ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer',
          sizeClasses[size],
          className
        )}
        type={props.type || 'button'}
        {...props}
      />
    );
  }
);
IconButton.displayName = 'IconButton';

// LikeButton component

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  size?: 'small' | 'medium';
  onLikeToggle?: (updatedPost: Post) => void;
}

export const LikeButton = ({
  postId,
  initialLikes,
  size = 'medium',
  onLikeToggle,
}: LikeButtonProps) => {
  const { isLoggedIn, user } = useAuth();
  const { likes, isLiked, isLoading, handleLikeClick } = useLike({
    postId,
    initialLikes,
    onLikeToggle,
    currentUserId: user?.id ?? null,
  });

  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMsg, setToastMsg] = React.useState('');

  const iconSize = size === 'small' ? 16 : 20;

  const handleClick = () => {
    if (!isLoggedIn) return;
    handleLikeClick();
    setToastMsg(isLiked ? 'Post unliked!' : 'Post liked!');
    setToastOpen(true);
  };

  return (
    <>
      <div
        className='flex items-center relative'
        aria-label='Like button group'
      >
        {isLoggedIn ? (
          <Button
            type='button'
            onClick={handleClick}
            disabled={isLoading}
            variant='phantom'
            className={clsx(
              'flex items-center gap-2',
              isLiked ? 'text-primary-300' : 'text-gray-500',
              'hover:text-primary-300 transition-colors',
              isLoggedIn ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
            )}
            aria-label='Like'
            aria-pressed={isLiked}
            aria-live='polite'
            style={{ background: 'none', border: 'none' }}
          >
            {isLiked ? (
              <BiSolidLike
                size={iconSize}
                className='text-primary-300'
                aria-hidden='true'
              />
            ) : (
              <BiLike
                size={iconSize}
                className={!isLoggedIn ? 'grayscale' : ''}
                aria-hidden='true'
              />
            )}
            <span
              className='text-xs lg:text-sm'
              aria-label='Like count'
              id={`like-count-${postId}`}
            >
              {likes}
            </span>
          </Button>
        ) : (
          <LikeTooltip>
            <Button
              type='button'
              variant='phantom'
              className={clsx(
                'flex items-center gap-2',
                'text-gray-500',
                'hover:text-primary-300 transition-colors',
                'cursor-not-allowed opacity-60'
              )}
              aria-label='Login to like'
              aria-disabled='true'
              aria-hidden='false'
              style={{ background: 'none', border: 'none' }}
              tabIndex={-1}
              disabled
            >
              <BiLike
                size={iconSize}
                className='grayscale'
                aria-hidden='true'
              />
              <span
                className='transition-colors duration-200 text-xs lg:text-sm text-neutral-500'
                aria-label='Like count'
              >
                {likes}
              </span>
            </Button>
          </LikeTooltip>
        )}
      </div>
      <Toast
        open={toastOpen}
        onOpenChange={setToastOpen}
        title={toastMsg}
        duration={2200}
      />
    </>
  );
};

// CommentButton component

interface CommentButtonProps {
  isLoggedIn: boolean;
  onClick?: () => void;
  commentCount: number;
}

export const CommentButton = ({
  isLoggedIn,
  onClick,
  commentCount,
}: CommentButtonProps) => {
  return (
    <div
      className='flex items-center relative ml-2'
      aria-label='Comment button group'
    >
      {isLoggedIn ? (
        <Button
          type='button'
          onClick={onClick}
          variant='phantom'
          className='cursor-pointer gap-2'
          aria-label='Comment'
          aria-controls={`comment-count-${commentCount}`}
        >
          <FaRegMessage
            size={16}
            className='cursor-inherit'
            aria-hidden='true'
          />

          <span
            className='text-xs lg:text-sm '
            aria-label='Comment count'
            id={`comment-count-${commentCount}`}
          >
            {commentCount}
          </span>
        </Button>
      ) : (
        <CommentTooltip>
          <Button
            type='button'
            variant='phantom'
            className='transition-all duration-100 cursor-not-allowed opacity-60 gap-2'
            aria-label='Login to comment'
            aria-disabled='true'
            tabIndex={-1}
            disabled
          >
            <FaRegMessage
              size={16}
              className='cursor-inherit text-neutral-500'
              aria-hidden='true'
            />
            <span
              className='text-xs lg:text-sm text-neutral-500'
              aria-label='Comment count'
            >
              {commentCount}
            </span>
          </Button>
        </CommentTooltip>
      )}
    </div>
  );
};
